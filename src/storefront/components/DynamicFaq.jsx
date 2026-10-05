import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DynamicFaq() {
  const { faqs, homepageSections } = useCms();
  const [openId, setOpenId] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="vb2-sec" id="faq">
      <div className="container container-narrow">
        <div className="vb2-sec-header">
          <span className="vb2-eyebrow">সাধারণ জিজ্ঞাসা</span>
          <h2 className="vb2-title">
            সচরাচর জিজ্ঞাসিত <em>প্রশ্নোত্তর</em>
          </h2>
          <p className="vb2-lead">
            জিরো এলার্জি সম্পর্কে গ্রাহকদের সাধারণ কিছু প্রশ্নের উত্তর
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--ink)'
                  }}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp size={18} color="#0a8d49" /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: '0 20px 18px 20px',
                      fontSize: '14px',
                      color: 'var(--mut)',
                      lineHeight: 1.65,
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '12px'
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
