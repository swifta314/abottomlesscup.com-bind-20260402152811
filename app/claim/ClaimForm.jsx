'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle } from 'lucide-react';

const INPUT = 'w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm text-espresso-800 bg-white focus:outline-none focus:border-espresso-400 focus:ring-2 focus:ring-espresso-400/20 transition-all';
const LABEL = 'block text-sm font-medium text-espresso-700 mb-1.5';

export default function ClaimForm() {
  const [form, setForm] = useState({ shop_name: '', city: '', state: '', owner_name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.from('claim_requests').insert([{ ...form, status: 'pending' }]);
    if (err) setError('Something went wrong. Please try again.');
    else setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-16">
        <CheckCircle size={40} className="text-sage-600 mx-auto mb-4" />
        <h2 className="font-display text-2xl text-espresso-800 mb-2">Claim Request Sent</h2>
        <p className="text-espresso-600 text-sm">We'll be in touch to verify ownership within a few business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={LABEL}>Shop Name *</label>
        <input required className={INPUT} value={form.shop_name} onChange={(e) => set('shop_name', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>City *</label>
          <input required className={INPUT} value={form.city} onChange={(e) => set('city', e.target.value)} />
        </div>
        <div>
          <label className={LABEL}>State *</label>
          <input required maxLength={2} className={INPUT} value={form.state} onChange={(e) => set('state', e.target.value.toUpperCase())} />
        </div>
      </div>
      <div>
        <label className={LABEL}>Your Name *</label>
        <input required className={INPUT} value={form.owner_name} onChange={(e) => set('owner_name', e.target.value)} />
      </div>
      <div>
        <label className={LABEL}>Email Address *</label>
        <input required type="email" className={INPUT} value={form.email} onChange={(e) => set('email', e.target.value)} />
      </div>
      <div>
        <label className={LABEL}>Message (optional)</label>
        <textarea rows={3} className={INPUT} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Anything you'd like us to know..." />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Claim Request'}
      </button>
    </form>
  );
}
