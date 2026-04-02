'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection({ faqs = [] }) {
  const [open, setOpen] = useState(null);

  if (!faqs.length) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold text-[#1C1410] mb-8">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E8E0D8] overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#FAFAF8] transition-colors"
            >
              <span className="font-medium text-[#1C1410] pr-4">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-[#9B9B9B] shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-6 pb-5">
                <p className="text-[#6B6B6B] text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
