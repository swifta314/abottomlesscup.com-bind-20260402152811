'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle } from 'lucide-react';

const INPUT = 'w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm text-espresso-800 bg-white focus:outline-none focus:border-espresso-400 transition-all';
const LABEL = 'block text-sm font-medium text-espresso-700 mb-1.5';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from('contact_messages').insert([form]);
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-16">
        <CheckCircle size={40} className="text-sage-600 mx-auto mb-4" />
        <h2 className="font-display text-2xl text-espresso-800 mb-2">Message Sent</h2>
        <p className="text-espresso-600 text-sm">We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={LABEL}>Name *</label>
        <input required className={INPUT} value={form.name} onChange={(e) => set('name', e.target.value)} />
      </div>
      <div>
        <label className={LABEL}>Email *</label>
        <input required type="email" className={INPUT} value={form.email} onChange={(e) => set('email', e.target.value)} />
      </div>
      <div>
        <label className={LABEL}>Subject</label>
        <input className={INPUT} value={form.subject} onChange={(e) => set('subject', e.target.value)} />
      </div>
      <div>
        <label className={LABEL}>Message *</label>
        <textarea required rows={5} className={INPUT} value={form.message} onChange={(e) => set('message', e.target.value)} />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
