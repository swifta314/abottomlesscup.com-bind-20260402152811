'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

const INPUT = 'w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm text-espresso-800 bg-white focus:outline-none focus:border-espresso-400 focus:ring-2 focus:ring-espresso-400/20 transition-all';
const LABEL = 'block text-sm font-medium text-espresso-700 mb-1.5';

export default function SubmitForm() {
  const [form, setForm] = useState({
    name: '', address: '', city: '', state: '', website: '', phone: '',
    hours: '', description: '', tags: '', wifi_yes_no: false, outlets_yes_no: false,
    seating_type: '', best_for: '', noise_level: '', food_availability: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const slug = `${slugify(form.name)}-${form.city.toLowerCase().replace(/\s+/g, '-')}`;
    const { error: err } = await supabase.from('coffee_shops').insert([{
      ...form,
      slug,
      status: 'pending',
    }]);
    if (err) {
      setError('Something went wrong. Please try again.');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-16">
        <CheckCircle size={40} className="text-sage-600 mx-auto mb-4" />
        <h2 className="font-display text-2xl text-espresso-800 mb-2">Submission Received!</h2>
        <p className="text-espresso-600 text-sm">
          We&apos;ll review your listing and it&apos;ll be live within a few business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Shop Name *</label>
          <input required className={INPUT} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Blue Bottle Coffee" />
        </div>
        <div>
          <label className={LABEL}>Phone</label>
          <input className={INPUT} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(212) 555-0100" />
        </div>
      </div>
      <div>
        <label className={LABEL}>Address *</label>
        <input required className={INPUT} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="123 Main St" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>City *</label>
          <input required className={INPUT} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="New York" />
        </div>
        <div>
          <label className={LABEL}>State *</label>
          <input required maxLength={2} className={INPUT} value={form.state} onChange={(e) => set('state', e.target.value.toUpperCase())} placeholder="NY" />
        </div>
      </div>
      <div>
        <label className={LABEL}>Website</label>
        <input className={INPUT} value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://yourdomain.com" />
      </div>
      <div>
        <label className={LABEL}>Hours</label>
        <input className={INPUT} value={form.hours} onChange={(e) => set('hours', e.target.value)} placeholder="Mon–Fri 7am–7pm, Sat–Sun 8am–5pm" />
      </div>
      <div>
        <label className={LABEL}>Description</label>
        <textarea rows={4} className={INPUT} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Tell us about your shop..." />
      </div>
      <div>
        <label className={LABEL}>Tags (comma-separated)</label>
        <input className={INPUT} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="specialty coffee, cozy, laptop-friendly" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Seating Type</label>
          <input className={INPUT} value={form.seating_type} onChange={(e) => set('seating_type', e.target.value)} placeholder="indoor, outdoor, bar" />
        </div>
        <div>
          <label className={LABEL}>Best For</label>
          <input className={INPUT} value={form.best_for} onChange={(e) => set('best_for', e.target.value)} placeholder="studying, meetings, dates" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Noise Level</label>
          <select className={INPUT} value={form.noise_level} onChange={(e) => set('noise_level', e.target.value)}>
            <option value="">Select...</option>
            <option value="quiet">Quiet</option>
            <option value="moderate">Moderate</option>
            <option value="lively">Lively</option>
          </select>
        </div>
        <div>
          <label className={LABEL}>Food Available</label>
          <input className={INPUT} value={form.food_availability} onChange={(e) => set('food_availability', e.target.value)} placeholder="pastries, full menu, none" />
        </div>
      </div>
      <div className="flex flex-wrap gap-5">
        {[
          { key: 'wifi_yes_no', label: 'Free WiFi' },
          { key: 'outlets_yes_no', label: 'Power Outlets' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 text-sm text-espresso-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form[key]}
              onChange={(e) => set(key, e.target.checked)}
              className="w-4 h-4 accent-espresso-800"
            />
            {label}
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Coffee Shop'}
      </button>
    </form>
  );
}
