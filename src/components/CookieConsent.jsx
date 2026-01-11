import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-4 shadow-lg z-50 animate-fade-in-up">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-300">
                    We use cookies to ensure the website functions properly. By continuing, you agree to our <a href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</a>.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => setIsVisible(false)} // Just dismiss for session
                        className="px-4 py-2 bg-transparent hover:bg-slate-800 text-slate-400 text-sm font-semibold rounded-lg transition-colors border border-slate-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
