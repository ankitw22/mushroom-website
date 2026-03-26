'use client';

import { useEffect, useRef } from 'react';

const BLOG_POSTS = [
  {
    title: "What is MCP and Why It's the Future of AI Integration",
    date: 'Apr 2025',
    readTime: '5 min',
    image: 'http://blog.viasocket.com/blog/content/images/2025/04/Your-paragraph-text--32-.png',
    link: 'https://viasocket.com/blog/what-is-mcp-and-why-its-the-future-of-ai-integration',
  },
  {
    title: 'Connect Mushrooms MCP with Your AI Assistant',
    date: 'Apr 2025',
    readTime: '4 min',
    image: 'http://blog.viasocket.com/blog/content/images/2025/04/737f5c4e-4caf-4b10-b001-9e9386b494d7.png',
    link: 'https://viasocket.com/blog/connect-viasocket-mcp-with-your-ai-assistant',
  },
  {
    title: 'MCP Servers: A Comprehensive Guide',
    date: 'Apr 2025',
    readTime: '6 min',
    image: 'http://blog.viasocket.com/blog/content/images/2025/04/5a28015a-b297-4639-987a-09d8f01010c2.png',
    link: 'https://viasocket.com/blog/mcp-servers-a-comprehensive-guide',
  },
  {
    title: 'How Mushrooms Works — A Complete Guide',
    date: 'May 2025',
    readTime: '5 min',
    image: 'http://blog.viasocket.com/blog/content/images/2025/05/Your-paragraph-text--36-.png',
    link: 'https://viasocket.com/blog/how-viasocket-works-a-complete-guide',
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay;
            if (delay) {
              el.style.transitionDelay = `${parseInt(delay) * 0.13}s`;
            }
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
    <section 
      ref={sectionRef} 
      className="section-blogs py-10 px-12 pb-[60px] max-w-[1200px] mx-auto max-[768px]:px-5 max-[540px]:px-5" 
      id="blog"
    >
      <div className="blogs-header reveal mb-10">
        <h2 
          className="section-headline leading-tight"
          style={{
            fontFamily: "'Symtext', 'Press Start 2P', monospace",
            fontSize: 'clamp(22px, 3.4vw, 40px)',
            color: 'var(--ink)',
          }}
        >
          FROM THE <span className="text-[#068F57]">MUSHROOMS BLOG.</span>
        </h2>
      </div>

      <div className="blogs-grid reveal grid grid-cols-4 gap-4 max-[768px]:grid-cols-2 max-[540px]:grid-cols-1" data-delay="1">
        {BLOG_POSTS.map((post, idx) => (
          <a
            key={idx}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-card bg-white border-2 border-[#068F57] rounded-[14px] overflow-hidden flex flex-col transition-all cursor-pointer no-underline hover:translate-y-[-4px] hover:shadow-[0_14px_36px_rgba(0,0,0,0.07)] hover:border-[#068F57]"
          >
            <img
              className="blog-thumb w-full aspect-video object-cover block bg-[#e2e8f0]"
              src={post.image}
              alt={post.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
            <div 
              className="blog-thumb-placeholder hidden w-full aspect-video bg-gradient-to-br from-[#e2e8f0] to-[#d1d9e2] items-center justify-center"
            >
              <span 
                style={{
                  fontFamily: "'Symtext', 'Press Start 2P', monospace",
                  fontSize: '9px',
                  color: 'rgba(10,10,10,0.2)',
                  letterSpacing: '0.06em',
                }}
              >
                BLOG
              </span>
            </div>
            <div className="blog-body py-[22px] px-6 pb-6 flex flex-col flex-1 gap-3">
              <div 
                className="blog-meta flex items-center gap-2.5"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '10px',
                  color: 'rgba(10,10,10,0.35)',
                }}
              >
                <span>{post.date}</span>
                <span className="blog-meta-sep opacity-40">·</span>
                <span>{post.readTime}</span>
              </div>
              <p 
                className="blog-title flex-1"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  lineHeight: 1.5,
                }}
              >
                {post.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
