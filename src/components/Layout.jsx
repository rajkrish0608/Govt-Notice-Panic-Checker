import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import PrivacyBadge from './PrivacyBadge';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="py-6 mb-4">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
                    <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
                        <ShieldCheck className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                            Gov Notice <span className="text-indigo-400">Decoder</span>
                        </h1>
                        <p className="text-xs text-slate-400 tracking-wide uppercase">AI-Powered Risk Assessment Tool</p>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 pb-12">
                {children}
                <PrivacyBadge />
            </main>

            <Footer />
            <CookieConsent />
        </div>
    );
};

export default Layout;
