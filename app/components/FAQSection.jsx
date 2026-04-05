'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection({ faqs = [] }) {
  const [open, setOpen] = useState(null);

  if (!faqs?.length) return null;

  return (
    <section className="max-w-3xl mx-auto py-16">
      <h2 className="text-2xl font-bold text-stone-900 mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-stone-50 transition-colors"
            >
              <span className="font-medium text-stone-900 pr-4">{faq.question || faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-6 pb-5">
                <p className="text-stone-600 text-sm leading-relaxed">{faq.answer || faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
