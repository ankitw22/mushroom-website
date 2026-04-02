'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Type declaration for window.signals
declare global {
  interface Window {
    signals?: {
      identify?: (data: { email: string }) => void;
    };
  }
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function RequestPlugin({ appInfo, secondAppInfo = null, type, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [formData, setFormData] = useState({
        userEmail: '',
        userName: '',
        mushroomAppName: '',
        useCase: '',
        plugName: appInfo?.name,
        source: 'website',
        environment: 'prod',
        plug: appInfo,
    });
    const [emailError, setEmailError] = useState('');
    const emailInputRef = useRef(null);

    const handleInputChange = (event) => {
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
        else {
            console.error('onclose not found in RequestPlugin');
        }
    };

    const handleDone = async () => {
        setShowSuccessPopup(false);
        handleClose();
    };

    const handleSubmit = async (event) => {
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
    };

    const submitForm = async () => {
        // Only identify user if signals is available
        if (window.signals && typeof window.signals.identify === 'function') {
            window.signals.identify({
                email: formData.userEmail,
            });
        }

        const formDataToSend = formData;
        const { plug, ...cleanedPayload } = formDataToSend;
        (cleanedPayload as any).userNeed = `New ${type || 'App'}`;
        (cleanedPayload as any).category = appInfo?.category?.join(', ');

        // Debug: Log the data being sent
        console.log('Submitting data:', cleanedPayload);

        try {
            setIsLoading(true);
            const pluginResponse = await fetch('https://flow.sokt.io/func/scriPIvL7pBP', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedPayload),
            });

            console.log('Response status:', pluginResponse.status);
            console.log('Response ok:', pluginResponse.ok);

            if (!pluginResponse.ok) {
                const errorText = await pluginResponse.text();
                console.error('Error response:', errorText);
                alert(`Server error: ${pluginResponse.status} - ${errorText}`);
                return;
            }

            const pluginData = await pluginResponse.json();
            console.log('Webhook response:', pluginData);

            if (pluginData?.data?.success) {
                setShowSuccessPopup(true);
            } else {
                alert('Failed to submit request. Server returned unsuccessful response.');
            }
        } catch (error: any) {
            console.error('Failed to submit:', error);
            alert(`Failed to submit: ${error?.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/20">
            {showSuccessPopup ? (
                <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                ></path>
                            </svg>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="flex items-left gap-1">
                                <span className="text-sm">
                                    {' '}
                                    Got your request! We'll get back to you within 48 hours. 🚀
                                </span>{' '}
                            </p>
                            <p className="text-sm">
                                Have more queries? Feel free to{' '}
                                <Link
                                    className="underline hover:text-accent"
                                    href={'https://cal.id/team/viasocket/workflow-setup-discussion'}
                                    target="_blank"
                                >
                                    schedule a meeting
                                </Link>{' '}
                                with us.
                            </p>
                        </div>

                        <div className="flex gap-3 w-full px-5 pt-5">
                            <button
                                className="bg-green-700 py-2 px-4 text-white text-sm rounded hover:bg-green-800 transition-colors"
                                onClick={handleDone}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Done'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3 items-center">
                                {
                                    // <Image
                                    //     src={formData?.plug?.iconurl || 'https://placehold.co/40x40'}
                                    //     height={36}
                                    //     width={36}
                                    //     alt={"plugin icon"}
                                    // />
                                }
                                <h3 className="h3 font-bold">
                                    Request a new{' '}
                                    {type
                                        ? `${type == 'trigger' ? 'Trigger' : 'Action'} for ${formData?.plug?.name}` 
                                        : 'Integration'}
                                </h3>
                            </div>
                            <p className="flex items-center gap-1">
                                <span className="text-lg font-medium">
                                    Sit back and relax — we'll build your {type ? `${type}` : 'app'} in only 48 hours!
                                    🚀
                                </span>{' '}
                            </p>
                        </div>
                        <div className="flex gap-1 flex-col">
                            {secondAppInfo && (
                                <label className="block w-full">
                                    <div className="text-sm font-medium mb-2">
                                        <span className="label-text">Select App</span>
                                    </div>
                                    <select
                                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

                            <label className="block w-full">
                                <div className="text-sm font-medium mb-2">
                                    <span className="label-text">Name</span>
                                </div>
                                <input
                                    required
                                    type="text"
                                    name="userName"
                                    placeholder="Enter your name"
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label className="block w-full">
                                <div className="text-sm font-medium mb-2">
                                    <span className="label-text">Email</span>
                                </div>
                                <input
                                    required
                                    type="text"
                                    name="userEmail"
                                    placeholder="Enter your Email"
                                    className={`w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        emailError ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={formData.userEmail}
                                    onChange={handleInputChange}
                                    ref={emailInputRef}
                                />
                                {emailError && <span className="text-red-500 text-sm mt-1">{emailError}</span>}
                            </label>

                            <label className="block w-full">
                                <div className="text-sm font-medium mb-2">
                                    <span className="label-text">App Name</span>
                                </div>
                                <input
                                    required
                                    type="text"
                                    name="mushroomAppName"
                                    placeholder="Enter App name"
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={formData.mushroomAppName}
                                    onChange={handleInputChange}
                                />
                            </label>
                            {!type && (
                                <label className="block w-full">
                                    <div className="text-sm font-medium mb-2">
                                        <span className="label-text">Plugin Name</span>
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        name="plugName"
                                        placeholder="Plugin Name"
                                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        value={formData.plugName}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            )}
                            <label className="block w-full">
                                <div className="text-sm font-medium mb-2">
                                    <span className="label-text">Use Case</span>
                                </div>
                                <textarea
                                    required
                                    name="useCase"
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[100px] resize-none"
                                    placeholder="Please describe your use case"
                                    value={formData.useCase}
                                    onChange={(event) => {
                                        handleInputChange(event);
                                        event.target.style.height = 'auto';
                                        event.target.style.height = `${event.target.scrollHeight}px`;
                                    }}
                                    rows="3"
                                ></textarea>
                            </label>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                disabled={isLoading} 
                                className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                onClick={handleSubmit}
                            >
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </button>
                            <button 
                                disabled={isLoading} 
                                className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function IntegrationsRequestComp({ appInfo, secondAppInfo, type, onClose }) {
    return (
        <RequestPlugin appInfo={appInfo} secondAppInfo={secondAppInfo} type={type} onClose={onClose} />
    );
}
