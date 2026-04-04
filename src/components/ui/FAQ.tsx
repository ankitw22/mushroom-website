'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './FAQ.module.css';

interface FAQItem {
  id: string;
  q: string;
  a: string;
  link?: {
    href: string;
    text: string;
  };
}

interface FAQProps {
  data: FAQItem[];
  title?: string;
  accent?: string;
  className?: string;
}

export default function FAQ({ 
  data, 
  title = "Frequently Asked", 
  accent = "Questions",
  className = "" 
}: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05 }
    );

    const section = sectionRef.current;
    if (section) {
      section.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.sectionFaq} ${className}`}>
      <div className={styles.sectionFaqPricing}>
        <div className={styles.faqHeader}>
          <h2 className={styles.sectionHeadline}>
            {title} <span className={styles.accent}>{accent}</span>
          </h2>
        </div>
        <div className={styles.faqGrid}>
          {data.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleFaq(item.id)}
              className={`${styles.faqCard} ${openId === item.id ? styles.faqCardOpen : ''}`}
            >
              <div className={styles.faqQuestion}>
                <span className={styles.faqQText}>{item.q}</span>
                <span className={`${styles.faqToggle} ${openId === item.id ? styles.faqToggleOpen : ''}`}>
                  +
                </span>
              </div>
              <div className={`${styles.faqAnswer} ${openId === item.id ? styles.faqAnswerOpen : ''}`}>
                <div className={styles.faqAnswerInner}>
                  {item.a}
                  {item.link && (
                    <>
                      {' '}
                      <a
                        href={item.link.href}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.link.text}
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
