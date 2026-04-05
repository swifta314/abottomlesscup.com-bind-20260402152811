'use client';

const NOISE_LEVELS = ['quiet', 'moderate', 'lively'];
const BEST_FOR_OPTIONS = ['study', 'remote work', 'meetings', 'dates', 'casual'];
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

export default function FilterBar({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });
  const toggle = (key) => onChange({ ...filters, [key]: !filters[key] });

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D8] p-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* State */}
        <div>
          <label className="text-xs font-medium text-[#9B9B9B] uppercase tracking-wide mb-1.5 block">State</label>
          <select
            value={filters.state}
            onChange={(e) => update('state', e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E0D8] rounded-lg text-sm text-[#1C1410] bg-white focus:outline-none focus:border-[#C4956A]"
          >
            <option value="">All states</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Best For */}
        <div>
          <label className="text-xs font-medium text-[#9B9B9B] uppercase tracking-wide mb-1.5 block">Best For</label>
          <select
            value={filters.best_for}
            onChange={(e) => update('best_for', e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E0D8] rounded-lg text-sm text-[#1C1410] bg-white focus:outline-none focus:border-[#C4956A]"
          >
            <option value="">Any use</option>
            {BEST_FOR_OPTIONS.map(o => <option key={o} value={o} className="capitalize">{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
          </select>
        </div>

        {/* Noise Level */}
        <div>
          <label className="text-xs font-medium text-[#9B9B9B] uppercase tracking-wide mb-1.5 block">Noise Level</label>
          <select
            value={filters.noise_level}
            onChange={(e) => update('noise_level', e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E0D8] rounded-lg text-sm text-[#1C1410] bg-white focus:outline-none focus:border-[#C4956A]"
          >
            <option value="">Any level</option>
            {NOISE_LEVELS.map(l => <option key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
          </select>
        </div>

        {/* Toggles */}
        <div>
          <label className="text-xs font-medium text-[#9B9B9B] uppercase tracking-wide mb-1.5 block">Features</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                onClick={() => toggle('wifi')}
                className={`w-8 h-4 rounded-full transition-colors relative ${filters.wifi ? 'bg-[#C4956A]' : 'bg-[#E8E0D8]'}`}
              >
                <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${filters.wifi ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-[#4A4A4A]">WiFi</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                onClick={() => toggle('outlets')}
                className={`w-8 h-4 rounded-full transition-colors relative ${filters.outlets ? 'bg-[#C4956A]' : 'bg-[#E8E0D8]'}`}
              >
                <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${filters.outlets ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-[#4A4A4A]">Outlets</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
