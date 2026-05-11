'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { submitPluginRequest } from '@/lib/requests';

interface AppInfo {
    name: string;
    iconurl?: string;
    category?: string[];
    appslugname?: string;
    brandcolor?: string;
}

interface RequestPluginProps {
    appInfo?: AppInfo;
    secondAppInfo?: AppInfo | null;
    type?: string;
    onClose: () => void;
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function RequestPlugin({ appInfo, secondAppInfo = null, type, onClose }: RequestPluginProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [formData, setFormData] = useState({
        userEmail: '',
        userName: '',
        useCase: '',
        plugName: appInfo?.name || '',
        source: 'website',
        environment: 'prod',
        plug: appInfo,
    });
    const [emailError, setEmailError] = useState('');
    const emailInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'userEmail') {
            if (value === '' || isValidEmail(value)) {
                setEmailError('');
            } else {
                setEmailError('Please enter a valid email address.');
            }
        }
    };

    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleDone = async () => {
        setShowSuccessPopup(false);
        handleClose();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.userEmail) {
            alert('Email is required.');
            return;
        }

        if (!formData.userName) {
            alert('Name is required.');
            return;
        }

        if (!isValidEmail(formData.userEmail)) {
            setEmailError('Please enter a valid email address.');
            if (emailInputRef.current) {
                emailInputRef.current.focus();
            }
            return;
        }

        if (!formData.useCase) {
            alert('Use case is required.');
            return;
        }

        await submitForm();
        setShowSuccessPopup(true);
    };

    const submitForm = async () => {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.signals) {
            // @ts-ignore
            window.signals.identify({
                email: formData.userEmail,
            });
        }

        const { plug, ...cleanedPayload } = formData;
        const payload = {
            ...cleanedPayload,
            userNeed: `New ${type || 'App'}`,
            category: appInfo?.category?.join(', '),
        };

        try {
            setIsLoading(true);
            const pluginData = await submitPluginRequest(payload);
            if (pluginData?.data?.success) {
                handleClose();
            }
        } catch (error) {
            console.error('Failed to submit:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center">
            <div className="absolute inset-0 backdrop-blur-sm" onClick={handleClose} />

            {showSuccessPopup && (
                <div className="relative z-10 bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#068F57' }}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                ></path>
                            </svg>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--ink)' }}>
                                Got your request! We&apos;ll get back to you within 48 hours. 🚀
                            </p>
                            <p className="text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(10,10,10,0.6)' }}>
                                Have more queries? Feel free to{' '}
                                <Link
                                    className="underline hover:text-[#068F57] transition-colors"
                                    href={'https://cal.id/team/viasocket/workflow-setup-discussion'}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                >
                                    schedule a meeting
                                </Link>{' '}
                                with us.
                            </p>
                        </div>

                        <div className="flex gap-3 w-full pt-5">
                            <button
                                className="flex-1 py-2 px-4 text-white text-sm rounded-lg transition-all hover:opacity-90"
                                style={{ backgroundColor: '#068F57', fontFamily: "'Poppins', sans-serif" }}
                                onClick={handleDone}
                                disabled={isLoading}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!showSuccessPopup && (
                <div className="relative z-10 bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3 items-center">
                                {type && appInfo?.iconurl && (
                                    <Image
                                        src={appInfo?.iconurl || 'https://placehold.co/40x40'}
                                        height={36}
                                        width={36}
                                        alt={"plugin icon"}
                                        className="rounded-lg"
                                    />
                                )}
                                <h3
                                    className="font-bold"
                                    style={{
                                        fontFamily: "'Symtext', 'Press Start 2P', monospace",
                                        fontSize: '16px',
                                        color: 'var(--ink)',
                                        lineHeight: 1.4
                                    }}
                                >
                                    Request a new{' '}
                                    {type
                                        ? `${type == 'trigger' ? 'Trigger' : 'Action'} for ${formData?.plug?.name}`
                                        : 'Mushroom'}
                                </h3>
                            </div>
                            <p
                                className="text-base font-medium"
                                style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(10,10,10,0.7)' }}
                            >
                                Sit back and relax — we&apos;ll build your {type ? `${type}` : 'app'} in only 48 hours! 🚀
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
                            {secondAppInfo && (
                                <label className="w-full">
                                    <div className="mb-1.5">
                                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: 'rgba(10,10,10,0.6)' }}>Select App</span>
                                    </div>
                                    <select
                                        className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:border-[#068F57]"
                                        style={{
                                            borderColor: 'rgba(10,10,10,0.15)',
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: '14px'
                                        }}
                                        value={formData?.plug?.name}
                                        onChange={(e) => {
                                            const selectedName = e.target.value;
                                            const selectedApp =
                                                selectedName === appInfo?.name ? appInfo : secondAppInfo;
                                            setFormData((prev) => ({
                                                ...prev,
                                                plug: selectedApp,
                                                plugName: selectedApp?.name,
                                            }));
                                        }}
                                    >
                                        <option value={appInfo?.name}>{appInfo?.name}</option>
                                        <option value={secondAppInfo?.name}>{secondAppInfo?.name}</option>
                                    </select>
                                </label>
                            )}

                            <label className="w-full">
                                <div className="mb-1.5">
                                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: 'rgba(10,10,10,0.6)' }}>Name</span>
                                </div>
                                <input
                                    required
                                    type="text"
                                    name="userName"
                                    placeholder="Enter your name"
                                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:border-[#068F57]"
                                    style={{
                                        borderColor: 'rgba(10,10,10,0.15)',
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '14px'
                                    }}
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label className="w-full">
                                <div className="mb-1.5">
                                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: 'rgba(10,10,10,0.6)' }}>Email</span>
                                </div>
                                <input
                                    required
                                    type="email"
                                    name="userEmail"
                                    placeholder="Enter your email"
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:border-[#068F57] ${emailError ? 'border-red-500' : ''}`}
                                    style={{
                                        borderColor: emailError ? '#ef4444' : 'rgba(10,10,10,0.15)',
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '14px'
                                    }}
                                    value={formData.userEmail}
                                    onChange={handleInputChange}
                                    ref={emailInputRef}
                                />
                                {emailError && <span className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{emailError}</span>}
                            </label>

                            {!type && (
                                <label className="w-full">
                                    <div className="mb-1.5">
                                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: 'rgba(10,10,10,0.6)' }}>App Name</span>
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        name="plugName"
                                        placeholder="Enter app name"
                                        className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:border-[#068F57]"
                                        style={{
                                            borderColor: 'rgba(10,10,10,0.15)',
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: '14px'
                                        }}
                                        value={formData.plugName}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            )}

                            <label className="w-full">
                                <div className="mb-1.5">
                                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: 'rgba(10,10,10,0.6)' }}>Use Case</span>
                                </div>
                                <textarea
                                    required
                                    name="useCase"
                                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:border-[#068F57] resize-none"
                                    placeholder="Please describe your use case"
                                    value={formData.useCase}
                                    onChange={(event) => {
                                        handleInputChange(event);
                                        event.target.style.height = 'auto';
                                        event.target.style.height = `${event.target.scrollHeight}px`;
                                    }}
                                    rows={3}
                                    style={{
                                        borderColor: 'rgba(10,10,10,0.15)',
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '14px',
                                        overflow: 'hidden'
                                    }}
                                ></textarea>
                            </label>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-2.5 px-4 text-white rounded-lg transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: '#068F57', fontFamily: "'Poppins', sans-serif", fontSize: '14px' }}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </button>
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    className="flex-1 py-2.5 px-4 border rounded-lg transition-all hover:bg-gray-50"
                                    style={{
                                        borderColor: 'rgba(10,10,10,0.2)',
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '14px',
                                        color: 'var(--ink)'
                                    }}
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function IntegrationsRequestComp({ appInfo, secondAppInfo, type, onClose }: RequestPluginProps) {
    return (
        <RequestPlugin appInfo={appInfo} secondAppInfo={secondAppInfo} type={type} onClose={onClose} />
    );
}
