import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 300); // Allow fade out
        }, 2000); // Show for 2 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!visible) return null;

    return (
        <div className="splash-screen animate-fade-in">
            <div className="text-center">
                <div className="mb-4">
                    {/* Simple Icon placeholder */}
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <h1 className="text-xl font-semibold mb-2 text-slate-900">Gov Notice Decoder</h1>
                <p className="text-sm text-slate-500">Understand government notices clearly and calmly.</p>

                <div className="mt-8 flex justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
