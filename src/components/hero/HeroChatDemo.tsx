'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './HeroChatDemo.module.css';

/* ── Conversation data ── */
const conversations = [
    {
        user: 'Summarize my unread emails and create tasks in Linear',
        tools: ['FETCH_DATA', 'PROCESS_RESULTS'],
        appIcon: { letter: 'L', bg: '#5E6AD2', src: '/api/icon/linear.app' },
        processing: 'Emails fetched. Filtering unread.',
        claude: 'Done. Created 4 action items in Linear from your unread emails.',
    },
    {
        user: 'Post the sprint summary to #engineering on Slack',
        tools: ['FORMAT_CONTENT', 'SEND_MESSAGE'],
        appIcon: { letter: 'S', bg: '#4A154B', src: '/api/icon/slack.com' },
        processing: 'Summary formatted. Channel verified.',
        claude: 'Posted to #engineering. 8 team members notified.',
    },
    {
        user: 'Find all open GitHub issues and log them to Notion',
        tools: ['SEARCH_DATA', 'FILTER_RESULTS'],
        appIcon: { letter: 'GH', bg: '#24292e', src: '/api/icon/github.com' },
        processing: 'Issues fetched. Deduplicating entries.',
        claude: 'Logged 12 open issues to your Notion database.',
    },
    {
        user: 'Schedule a follow-up and send calendar invites to the team',
        tools: ['CREATE_ITEM', 'FETCH_MEMBERS'],
        appIcon: { letter: 'C', bg: '#1a73e8', src: '/api/icon/google.com' },
        processing: 'Event created. Retrieving attendees.',
        claude: 'Meeting scheduled. Invites sent to all 5 attendees.',
    },
];

const CHAT_AIS = [
    { name: 'Claude', src: '/api/icon/claude.com' },
    { name: 'ChatGPT', src: '/api/icon/openai.com' },
    { name: 'Cursor', src: '/api/icon/cursor.com' },
    { name: 'Gemini', src: '/api/icon/gemini.google.com' },
];

/* ── Types ── */
type VisibleItem =
    | { kind: 'user'; text: string }
    | { kind: 'tool'; text: string; pulsing: boolean; iconLetter?: string; iconSrc?: string }
    | { kind: 'ai'; text: string; typed: string; aiName: string; aiSrc: string; typing: boolean };

/* ── Component ── */
export default function HeroChatDemo() {
    const [items, setItems] = useState<VisibleItem[]>([]);
    const [fading, setFading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const cancelRef = useRef(false);

    const scrollBottom = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        cancelRef.current = false;
        let idx = 0;

        const sleep = (ms: number) =>
            new Promise<void>((r) => {
                const id = setTimeout(r, ms);
                // cleanup on cancel not strictly needed but harmless
                void id;
            });

        async function typeText(
            setter: React.Dispatch<React.SetStateAction<VisibleItem[]>>,
            text: string,
            speed: number,
            scrollFn: () => void
        ) {
            for (let c = 1; c <= text.length; c++) {
                if (cancelRef.current) return;
                await sleep(speed);
                setter((prev) => {
                    const copy = [...prev];
                    const last = copy[copy.length - 1];
                    if (last && last.kind === 'ai') {
                        copy[copy.length - 1] = { ...last, typed: text.slice(0, c), typing: c < text.length };
                    }
                    return copy;
                });
                scrollFn();
            }
        }

        async function runConvo() {
            while (!cancelRef.current) {
                const convo = conversations[idx];
                const ai = CHAT_AIS[idx % CHAT_AIS.length];

                // fade out
                setFading(true);
                await sleep(500);
                if (cancelRef.current) return;

                // clear
                setItems([]);
                setFading(false);
                await sleep(120);
                if (cancelRef.current) return;

                // user message
                setItems([{ kind: 'user', text: convo.user }]);
                scrollBottom();
                await sleep(500);
                if (cancelRef.current) return;

                // tool calls
                for (const tool of convo.tools) {
                    setItems((prev) => [
                        ...prev,
                        {
                            kind: 'tool',
                            text: '> ' + tool,
                            pulsing: true,
                            iconLetter: convo.appIcon.letter,
                            iconSrc: convo.appIcon.src,
                        },
                    ]);
                    scrollBottom();
                    await sleep(2000);
                    if (cancelRef.current) return;

                    // stop pulsing
                    setItems((prev) => {
                        const copy = [...prev];
                        const last = copy[copy.length - 1];
                        if (last && last.kind === 'tool') {
                            copy[copy.length - 1] = { ...last, pulsing: false };
                        }
                        return copy;
                    });
                    await sleep(360);
                    if (cancelRef.current) return;
                }

                await sleep(300);
                if (cancelRef.current) return;

                // processing message (AI row)
                setItems((prev) => [
                    ...prev,
                    { kind: 'ai', text: convo.processing, typed: '', aiName: ai.name, aiSrc: ai.src, typing: true },
                ]);
                await typeText(setItems, convo.processing, 28, scrollBottom);
                if (cancelRef.current) return;
                await sleep(400);
                if (cancelRef.current) return;

                // executing tool
                setItems((prev) => [
                    ...prev,
                    { kind: 'tool', text: '> Executing Tool', pulsing: true, iconLetter: convo.appIcon.letter, iconSrc: convo.appIcon.src },
                ]);
                scrollBottom();
                await sleep(2000);
                if (cancelRef.current) return;
                setItems((prev) => {
                    const copy = [...prev];
                    const last = copy[copy.length - 1];
                    if (last && last.kind === 'tool') {
                        copy[copy.length - 1] = { ...last, pulsing: false };
                    }
                    return copy;
                });
                await sleep(500);
                if (cancelRef.current) return;

                // final AI response
                setItems((prev) => [
                    ...prev,
                    { kind: 'ai', text: convo.claude, typed: '', aiName: ai.name, aiSrc: ai.src, typing: true },
                ]);
                await typeText(setItems, convo.claude, 36, scrollBottom);
                if (cancelRef.current) return;

                await sleep(3200);
                if (cancelRef.current) return;

                idx = (idx + 1) % conversations.length;
            }
        }

        const timer = setTimeout(() => runConvo(), 800);
        return () => {
            cancelRef.current = true;
            clearTimeout(timer);
        };
    }, [scrollBottom]);

    return (
        <>

            <div className={styles.heroChatZone}>
                <div className={styles.chatDemoWindow}>
                    <div className={styles.chatDemoBar}>
                        <div className={styles.chatDemoDots}>
                            <span className={`${styles.chatDemoDot} ${styles.dotR}`} />
                            <span className={`${styles.chatDemoDot} ${styles.dotY}`} />
                            <span className={`${styles.chatDemoDot} ${styles.dotG}`} />
                        </div>
                        <span className={styles.chatDemoLabel}>🍄 Mushrooms</span>
                    </div>

                    <div
                        ref={containerRef}
                        className={styles.chatDemoMessages}
                        style={{ opacity: fading ? 0 : 1 }}
                    >
                        {items.map((item, i) => {
                            if (item.kind === 'user') {
                                return (
                                    <div key={i} className={styles.cdmUser}>
                                        {item.text}
                                    </div>
                                );
                            }

                            if (item.kind === 'tool') {
                                return (
                                    <div key={i} className={styles.cdmToolRow}>
                                        <div className={styles.cdmToolAppIcon}>
                                            {item.iconSrc ? (
                                                <img src={item.iconSrc} alt={item.iconLetter || ''} />
                                            ) : (
                                                item.iconLetter
                                            )}
                                        </div>
                                        <div
                                            className={`${styles.cdmToolText} ${item.pulsing ? styles.pulsing : ''}`}
                                        >
                                            {item.text}
                                        </div>
                                    </div>
                                );
                            }

                            // ai
                            return (
                                <div key={i} className={styles.cdmClaudeRow}>
                                    <div className={styles.cdmClaudeAvatar}>
                                        <img src={item.aiSrc} alt={item.aiName} />
                                    </div>
                                    <div className={styles.cdmClaude}>
                                        {item.typed}
                                        {item.typing && item.typed.length < item.text.length && (
                                            <span className={styles.cdmCursor} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}