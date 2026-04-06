'use client';

import { useEffect, useRef, useState } from 'react';

interface ChatDemoSectionProps {
  clientTitle: string;
  appName: string;
}

interface Message {
  type: 'user' | 'tool' | 'ai';
  text: string;
}

interface Scenario {
  messages: Message[];
}

export function ChatDemoSection({ clientTitle, appName }: ChatDemoSectionProps) {
  const scenarios: Scenario[] = [
    {
      messages: [
        { type: 'user', text: `What happened in ${appName} today?` },
        { type: 'tool', text: `🍄 Calling ${appName} via Mushrooms MCP…` },
        { type: 'ai', text: `Here's a summary of today's activity in ${appName}. I fetched the latest updates and organised them for you.` },
      ],
    },
    {
      messages: [
        { type: 'user', text: `Create a new entry in ${appName} with the details I sent earlier.` },
        { type: 'tool', text: `🍄 Writing to ${appName} via Mushrooms MCP…` },
        { type: 'ai', text: `Done! I've created the new entry in ${appName} using the details from your earlier message.` },
      ],
    },
    {
      messages: [
        { type: 'user', text: `Search ${appName} for anything related to Q3 reports.` },
        { type: 'tool', text: `🍄 Searching ${appName} via Mushrooms MCP…` },
        { type: 'ai', text: `Found 4 results related to Q3 reports in ${appName}. Here are the most relevant ones:` },
      ],
    },
  ];

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<{ type: string; text: string; typed: string }[]>([]);
  const [fading, setFading] = useState(false);
  const [toolPulsing, setToolPulsing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const scenario = scenarios[scenarioIdx];

    async function runScenario() {
      setVisibleMessages([]);
      setToolPulsing(false);

      for (let i = 0; i < scenario.messages.length; i++) {
        if (cancelled) return;
        const msg = scenario.messages[i];

        await sleep(i === 0 ? 500 : 900);
        if (cancelled) return;

        if (msg.type === 'user') {
          setVisibleMessages((prev) => [...prev, { type: 'user', text: msg.text, typed: msg.text }]);
        } else if (msg.type === 'tool') {
          setVisibleMessages((prev) => [...prev, { type: 'tool', text: msg.text, typed: msg.text }]);
          setToolPulsing(true);
          await sleep(1400);
          if (cancelled) return;
          setToolPulsing(false);
        } else {
          // typewriter for AI
          setVisibleMessages((prev) => [...prev, { type: 'ai', text: msg.text, typed: '' }]);
          for (let c = 1; c <= msg.text.length; c++) {
            if (cancelled) return;
            await sleep(18);
            setVisibleMessages((prev) => {
              const copy = [...prev];
              copy[copy.length - 1] = { ...copy[copy.length - 1], typed: msg.text.slice(0, c) };
              return copy;
            });
          }
        }

        scrollBottom();
      }

      // wait then fade out and switch
      await sleep(3200);
      if (cancelled) return;
      setFading(true);
      await sleep(500);
      if (cancelled) return;
      setFading(false);
      setScenarioIdx((s) => (s + 1) % scenarios.length);
    }

    runScenario();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioIdx]);

  function scrollBottom() {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }

  return (
    <div className="chat-demo-section">
      <div className="chat-demo-inner">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2
            style={{
              fontFamily: 'var(--pixel)',
              fontSize: 'clamp(20px, 2.8vw, 36px)',
              color: 'var(--ink)',
              lineHeight: 1.3,
              marginBottom: 10,
            }}
          >
            From Prompt <span style={{ color: '#fff' }}>to Action</span>
          </h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: 15, color: 'rgba(10,10,10,0.6)' }}>
            Watch {clientTitle} connect to {appName} in real time.
          </p>
        </div>

        <div className="chat-demo-window">
          <div className="chat-demo-bar">
            <div className="chat-demo-dots">
              <span className="chat-demo-dot chat-demo-dot--r" />
              <span className="chat-demo-dot chat-demo-dot--y" />
              <span className="chat-demo-dot chat-demo-dot--g" />
            </div>
            <span className="chat-demo-label">🍄 {clientTitle} · {appName}</span>
          </div>
          <div
            ref={containerRef}
            className="chat-demo-messages"
            style={{
              opacity: fading ? 0 : 1,
              transition: 'opacity 0.45s ease',
              height: 300,
              overflowY: 'auto',
            }}
          >
            {visibleMessages.map((msg, i) => {
              if (msg.type === 'user') {
                return <div key={i} className="cdm-user">{msg.typed}</div>;
              }
              if (msg.type === 'tool') {
                return (
                  <div
                    key={i}
                    className="cdm-tool"
                    style={toolPulsing && i === visibleMessages.length - 1 ? {
                      background: 'linear-gradient(90deg,rgba(130,220,180,.55) 0%,rgba(130,220,180,.55) 20%,rgba(220,255,235,1) 50%,rgba(130,220,180,.55) 80%,rgba(130,220,180,.55) 100%)',
                      backgroundSize: '250% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'cdm-wave 2.3s linear infinite',
                    } : {}}
                  >
                    {msg.typed}
                  </div>
                );
              }
              const isLast = i === visibleMessages.length - 1;
              const isTyping = isLast && msg.typed.length < msg.text.length;
              return (
                <div key={i} className="cdm-ai">
                  {msg.typed}
                  {isTyping && (
                    <span style={{
                      display: 'inline-block',
                      width: 2,
                      height: '1em',
                      background: 'currentColor',
                      marginLeft: 2,
                      verticalAlign: 'text-bottom',
                      animation: 'cdm-blink 0.7s step-end infinite',
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cdm-wave {
          0%   { background-position: 120% 0; }
          100% { background-position: -120% 0; }
        }
        @keyframes cdm-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
