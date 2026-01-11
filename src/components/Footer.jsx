import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full py-6 mt-12 border-t border-slate-800 bg-slate-900/50">
            <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Panic Checker. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
                    <Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
