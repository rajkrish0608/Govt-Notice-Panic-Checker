import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Disclaimer = () => {
    return (
        <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex gap-3 text-sm text-slate-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p>
                <strong className="text-amber-400">Disclaimer:</strong> This tool uses automated logic to provide general guidance only and is
                <span className="font-semibold text-white"> not legal advice</span>. Government rules change frequently.
                Always verify important notices with the official department website or a qualified Chartered Accountant / Lawyer before taking action.
            </p>
        </div>
    );
};

export default Disclaimer;
