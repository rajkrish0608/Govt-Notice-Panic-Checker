import React from 'react';
import Footer from './Footer';
import CookieConsent from './CookieConsent';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Professional Top Bar */}
            <div className="top-bar">
                <div className="app-brand">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Gov Notice Decoder</span>
                </div>
                <nav className="text-sm">
                    {/* Placeholder for future nav items if needed */}
                </nav>
            </div>

            <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
                {children}
            </main>

            <Footer />
            <CookieConsent />
        </div>
    );
};

export default Layout;
