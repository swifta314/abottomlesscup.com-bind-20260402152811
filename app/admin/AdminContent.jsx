'use client';

import { useState, useRef } from 'react';
import { Upload, CheckCircle, XCircle, AlertCircle, Download, Coffee, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const REQUIRED_COLUMNS = ['name', 'city', 'state', 'address', 'slug'];

const ALL_COLUMNS = [
  'name', 'address', 'city', 'state', 'website', 'phone', 'description',
  'hours', 'tags', 'features', 'wifi_yes_no', 'outlets_yes_no',
  'seating_type', 'best_for', 'noise_level', 'aesthetic_score',
  'coffee_quality', 'food_availability', 'slug', 'image_url'
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

  const rows = lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    return row;
  });

  return { headers, rows };
}

function validateRow(row, index) {
  const errors = [];
  REQUIRED_COLUMNS.forEach(col => {
    if (!row[col] || row[col].trim() === '') {
      errors.push(`Row ${index + 2}: Missing required field "${col}"`);
    }
  });
  if (row.slug && !/^[a-z0-9-]+$/.test(row.slug)) {
    errors.push(`Row ${index + 2}: Slug "${row.slug}" contains invalid characters (use only lowercase letters, numbers, hyphens)`);
  }
  if (row.website && row.website.trim() !== '' && !row.website.startsWith('http')) {
    errors.push(`Row ${index + 2}: Website should start with http:// or https://`);
  }
  return errors;
}

function transformRow(row) {
  return {
    name: row.name?.trim() || '',
    address: row.address?.trim() || '',
    city: row.city?.trim() || '',
    state: row.state?.trim() || '',
    website: row.website?.trim() || null,
    phone: row.phone?.trim() || null,
    description: row.description?.trim() || null,
    hours: row.hours?.trim() || null,
    tags: row.tags ? row.tags.split(';').map(t => t.trim()).filter(Boolean) : [],
    features: row.features ? row.features.split(';').map(f => f.trim()).filter(Boolean) : [],
    wifi_yes_no: row.wifi_yes_no ? ['yes', 'true', '1'].includes(row.wifi_yes_no.toLowerCase()) : false,
    outlets_yes_no: row.outlets_yes_no ? ['yes', 'true', '1'].includes(row.outlets_yes_no.toLowerCase()) : false,
    seating_type: row.seating_type?.trim() || null,
    best_for: row.best_for ? row.best_for.split(';').map(b => b.trim()).filter(Boolean) : [],
    noise_level: row.noise_level?.trim() || null,
    aesthetic_score: row.aesthetic_score ? parseFloat(row.aesthetic_score) : null,
    coffee_quality: row.coffee_quality ? parseFloat(row.coffee_quality) : null,
    food_availability: row.food_availability?.trim() || null,
    slug: row.slug?.trim() || slugify(row.name + '-' + row.city),
    image_url: row.image_url?.trim() || null,
    city_slug: slugify(row.city + '-' + row.state),
    status: 'active',
  };
}

const SAMPLE_CSV = `name,address,city,state,website,phone,description,hours,tags,features,wifi_yes_no,outlets_yes_no,seating_type,best_for,noise_level,aesthetic_score,coffee_quality,food_availability,slug,image_url
Blue Bottle Coffee,"300 Webster St",Oakland,CA,https://bluebottlecoffee.com,510-555-0100,"Award-winning specialty coffee roaster.","Mon-Fri 7am-6pm; Sat-Sun 8am-5pm",specialty;third-wave,wifi;outlets;pour-over,yes,yes,mixed,remote work;coffee enthusiasts,moderate,4.5,4.8,pastries,blue-bottle-coffee-oakland,https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop&q=80
Stumptown Coffee,"128 SW 3rd Ave",Portland,OR,https://stumptowncoffee.com,503-555-0200,"Portland's beloved specialty roaster with a cozy atmosphere.","Daily 6am-8pm",specialty;cozy;local,wifi;outlets;nitro-cold-brew,yes,yes,cozy,students;travelers,low,4.3,4.7,snacks,stumptown-coffee-portland,https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&q=80`;

export default function AdminContent() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [importMode, setImportMode] = useState('upsert');
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (!f || !f.name.endsWith('.csv')) {
      alert('Please upload a valid .csv file.');
      return;
    }
    setFile(f);
    setResults(null);
    setValidationErrors([]);
    setPreview(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const { headers, rows } = parseCSV(e.target.result);
      const missingRequired = REQUIRED_COLUMNS.filter(c => !headers.includes(c));
      const errors = [];

      if (missingRequired.length > 0) {
        errors.push(`Missing required columns: ${missingRequired.join(', ')}`);
        setValidationErrors(errors);
        setPreview({ headers, rows: rows.slice(0, 3), totalRows: rows.length, allRows: rows });
        return;
      }

      rows.forEach((row, i) => {
        errors.push(...validateRow(row, i));
      });

      setValidationErrors(errors);
      setPreview({ headers, rows: rows.slice(0, 3), totalRows: rows.length, allRows: rows });
    };
    reader.readAsText(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleImport = async () => {
    if (!preview || validationErrors.some(e => e.startsWith('Missing required columns'))) return;
    setImporting(true);
    setResults(null);

    const rows = preview.allRows;
    const transformed = rows.map(transformRow);

    let successCount = 0;
    let failCount = 0;
    const failedRows = [];

    const BATCH_SIZE = 50;
    for (let i = 0; i < transformed.length; i += BATCH_SIZE) {
      const batch = transformed.slice(i, i + BATCH_SIZE);
      try {
        let error;
        if (importMode === 'upsert') {
          const res = await supabase
            .from('coffee_shops')
            .upsert(batch, { onConflict: 'slug' });
          error = res.error;
        } else {
          const res = await supabase
            .from('coffee_shops')
            .insert(batch);
          error = res.error;
        }

        if (error) {
          failCount += batch.length;
          failedRows.push({ batch: i / BATCH_SIZE + 1, error: error.message });
        } else {
          successCount += batch.length;
        }
      } catch (err) {
        failCount += batch.length;
        failedRows.push({ batch: i / BATCH_SIZE + 1, error: err.message });
      }
    }

    setResults({ successCount, failCount, failedRows, total: transformed.length });
    setImporting(false);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_coffee_shops.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setValidationErrors([]);
    setResults(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
              <Coffee size={18} className="text-amber-700" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>
              CSV Import
            </h1>
          </div>
          <p className="text-stone-500 text-sm ml-12">
            Bulk import coffee shops from a CSV file. Supports up to 5,000 rows per upload.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Actions Row */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={downloadSample}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            <Download size={15} />
            Download Sample CSV
          </button>
          <button
            onClick={() => setShowSchema(!showSchema)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            <FileText size={15} />
            View Schema
            {showSchema ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Schema Reference */}
        {showSchema && (
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-stone-800 mb-3">CSV Column Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left py-2 pr-4 text-stone-500 font-medium">Column</th>
                    <th className="text-left py-2 pr-4 text-stone-500 font-medium">Required</th>
                    <th className="text-left py-2 text-stone-500 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { col: 'name', req: true, note: 'Full name of the coffee shop' },
                    { col: 'address', req: true, note: 'Street address' },
                    { col: 'city', req: true, note: 'City name (e.g. New York)' },
                    { col: 'state', req: true, note: 'State abbreviation (e.g. NY)' },
                    { col: 'slug', req: true, note: 'URL-safe identifier, lowercase with hyphens only' },
                    { col: 'website', req: false, note: 'Full URL including https://' },
                    { col: 'phone', req: false, note: 'Phone number as string' },
                    { col: 'description', req: false, note: 'Short description of the shop' },
                    { col: 'hours', req: false, note: 'Hours as plain text (e.g. Mon-Fri 7am-6pm)' },
                    { col: 'tags', req: false, note: 'Semicolon-separated (e.g. cozy;specialty;local)' },
                    { col: 'features', req: false, note: 'Semicolon-separated (e.g. wifi;outlets;pour-over)' },
                    { col: 'wifi_yes_no', req: false, note: 'yes / no / true / false / 1 / 0' },
                    { col: 'outlets_yes_no', req: false, note: 'yes / no / true / false / 1 / 0' },
                    { col: 'seating_type', req: false, note: 'e.g. cozy, open, mixed, bar seating' },
                    { col: 'best_for', req: false, note: 'Semicolon-separated (e.g. remote work;studying)' },
                    { col: 'noise_level', req: false, note: 'quiet / moderate / lively' },
                    { col: 'aesthetic_score', req: false, note: 'Number 1–5 (e.g. 4.5)' },
                    { col: 'coffee_quality', req: false, note: 'Number 1–5 (e.g. 4.8)' },
                    { col: 'food_availability', req: false, note: 'e.g. none, pastries, full menu' },
                    { col: 'image_url', req: false, note: 'Full URL to listing image' },
                  ].map(({ col, req, note }) => (
                    <tr key={col} className="border-b border-stone-50">
                      <td className="py-2 pr-4 font-mono text-stone-800">{col}</td>
                      <td className="py-2 pr-4">
                        {req
                          ? <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">Required</span>
                          : <span className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded text-xs">Optional</span>
                        }
                      </td>
                      <td className="py-2 text-stone-500">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Import Mode */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-stone-800 mb-3">Import Mode</h3>
          <div className="flex gap-3">
            <label className={`flex items-start gap-3 flex-1 p-3 rounded-lg border cursor-pointer transition-colors ${importMode === 'upsert' ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:bg-stone-50'}`}>
              <input
                type="radio"
                name="importMode"
                value="upsert"
                checked={importMode === 'upsert'}
                onChange={() => setImportMode('upsert')}
                className="mt-0.5 accent-amber-600"
              />
              <div>
                <p className="text-sm font-medium text-stone-800">Upsert (Recommended)</p>
                <p className="text-xs text-stone-500 mt-0.5">Insert new rows, update existing ones matching by slug.</p>
              </div>
            </label>
            <label className={`flex items-start gap-3 flex-1 p-3 rounded-lg border cursor-pointer transition-colors ${importMode === 'insert' ? 'border-amber-400 bg-amber-50' : 'border-stone-200 hover:bg-stone-50'}`}>
              <input
                type="radio"
                name="importMode"
                value="insert"
                checked={importMode === 'insert'}
                onChange={() => setImportMode('insert')}
                className="mt-0.5 accent-amber-600"
              />
              <div>
                <p className="text-sm font-medium text-stone-800">Insert Only</p>
                <p className="text-xs text-stone-500 mt-0.5">Skip rows with duplicate slugs, insert new ones only.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Upload Area */}
        {!preview && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-amber-400 bg-amber-50'
                : 'border-stone-300 bg-white hover:border-amber-300 hover:bg-stone-50'
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload size={24} className="text-stone-400" />
            </div>
            <p className="text-stone-800 font-medium mb-1">Drop your CSV file here</p>
            <p className="text-stone-500 text-sm mb-3">or click to browse files</p>
            <p className="text-stone-400 text-xs">Accepts .csv files up to 5,000 rows</p>
          </div>
        )}

        {/* Preview & Validation */}
        {preview && !results && (
          <div className="space-y-4">
            {/* File Info */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                  <FileText size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">{file?.name}</p>
                  <p className="text-xs text-stone-500">{preview.totalRows} rows detected</p>
                </div>
              </div>
              <button onClick={reset} className="text-xs text-stone-400 hover:text-stone-600 underline">
                Remove
              </button>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={16} className="text-red-500" />
                  <p className="text-sm font-semibold text-red-700">
                    {validationErrors.length} validation {validationErrors.length === 1 ? 'issue' : 'issues'} found
                  </p>
                </div>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {validationErrors.map((err, i) => (
                    <li key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                      <span className="mt-0.5">•</span>
                      {err}
                    </li>
                  ))}
                </ul>
                {validationErrors.some(e => e.startsWith('Missing required columns')) && (
                  <p className="text-xs text-red-600 mt-3 font-medium">
                    ⚠ Cannot import — required columns are missing. Please fix your CSV and re-upload.
                  </p>
                )}
              </div>
            )}

            {validationErrors.length > 0 && !validationErrors.some(e => e.startsWith('Missing required columns')) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  Rows with warnings will still be imported with available data. Review issues above before proceeding.
                </p>
              </div>
            )}

            {/* Data Preview */}
            <div className="bg-white border border-stone-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-stone-800 mb-3">
                Preview (first {Math.min(3, preview.rows.length)} of {preview.totalRows} rows)
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-stone-100">
                      {REQUIRED_COLUMNS.map(col => (
                        <th key={col} className="text-left py-2 pr-4 text-stone-500 font-medium">{col}</th>
                      ))}
                      {preview.headers.filter(h => !REQUIRED_COLUMNS.includes(h)).slice(0, 3).map(col => (
                        <th key={col} className="text-left py-2 pr-4 text-stone-400 font-medium">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row, i) => (
                      <tr key={i} className="border-b border-stone-50">
                        {REQUIRED_COLUMNS.map(col => (
                          <td key={col} className="py-2 pr-4 text-stone-700 max-w-[120px] truncate">{row[col] || '—'}</td>
                        ))}
                        {preview.headers.filter(h => !REQUIRED_COLUMNS.includes(h)).slice(0, 3).map(col => (
                          <td key={col} className="py-2 pr-4 text-stone-400 max-w-[120px] truncate">{row[col] || '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Import Button */}
            <div className="flex gap-3">
              <button
                onClick={handleImport}
                disabled={importing || validationErrors.some(e => e.startsWith('Missing required columns'))}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-700 text-white rounded-xl font-medium text-sm hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Importing {preview.totalRows} rows...
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    Import {preview.totalRows} Coffee Shops
                  </>
                )}
              </button>
              <button
                onClick={reset}
                disabled={importing}
                className="px-5 py-3 border border-stone-300 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-stone-800">Import Complete</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-stone-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-stone-800">{results.total}</p>
                <p className="text-xs text-stone-500 mt-1">Total Rows</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{results.successCount}</p>
                <p className="text-xs text-green-600 mt-1">Imported</p>
              </div>
              <div className={`rounded-lg p-4 text-center ${results.failCount > 0 ? 'bg-red-50' : 'bg-stone-50'}`}>
                <p className={`text-2xl font-bold ${results.failCount > 0 ? 'text-red-700' : 'text-stone-400'}`}>{results.failCount}</p>
                <p className={`text-xs mt-1 ${results.failCount > 0 ? 'text-red-500' : 'text-stone-400'}`}>Failed</p>
              </div>
            </div>

            {results.failCount === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle size={16} className="text-green-600" />
                <p className="text-sm text-green-700 font-medium">All rows imported successfully.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.failedRows.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                    <XCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700">Batch {f.batch}: {f.error}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={reset}
                className="px-5 py-2.5 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
              >
                Import Another File
              </button>
              <a
                href="/browse"
                className="px-5 py-2.5 border border-stone-300 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
              >
                View Listings
              </a>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-stone-800 mb-3">Tips for a smooth import</h3>
          <ul className="space-y-2">
            {[
              'Save your spreadsheet as CSV (UTF-8) from Excel or Google Sheets.',
              'Slugs must be unique — use lowercase letters and hyphens only (e.g. blue-bottle-coffee-nyc).',
              'Separate multiple values in tags, features, and best_for with semicolons, not commas.',
              'Boolean fields (wifi_yes_no, outlets_yes_no) accept: yes, no, true, false, 1, 0.',
              'Scores (aesthetic_score, coffee_quality) should be numbers between 1 and 5.',
              'Use Upsert mode to safely re-import updated data without creating duplicates.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-stone-600">
                <span className="w-4 h-4 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-[10px] mt-0.5">{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
