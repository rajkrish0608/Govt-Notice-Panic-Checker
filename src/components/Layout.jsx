import React from 'react';
import { ShieldCheck } from 'lucide-react';

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
            </main>

            <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-800/50 mt-auto">
                <p>© 2026 Gov Notice Decoder. Built for public awareness.</p>
                <p className="text-xs mt-1 opacity-60">Not affiliated with any government body.</p>
            </footer>
        </div>
    );
};

export default Layout;
