import React from 'react';
import PanicLevel from './PanicLevel';
import Disclaimer from './Disclaimer';
import { AlertOctagon, CheckCircle, HelpCircle, Clock, FileWarning } from 'lucide-react';

const ResultCard = ({ result }) => {
    if (!result) return null;

    return (
        <div className="glass-panel p-6 mt-8 animate-fade-in max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold tracking-tight text-white mb-1">Assessment Report</h2>
                <span className="text-xs uppercase tracking-widest text-slate-400 border border-slate-700 px-2 py-1 rounded">
                    {result.type}
                </span>
            </div>

            <PanicLevel level={result.seriousness} confidence={result.confidence} />

            {result.redFlags && (
                <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                    <h3 className="flex items-center gap-2 text-red-300 font-bold mb-2">
                        <AlertOctagon className="w-5 h-5" /> Potential Red Flags Identified
                    </h3>
                    <p className="text-sm text-red-200">{result.redFlags}</p>
                </div>
            )}

            <div className="space-y-6">
                <Section title="What This Means" icon={<HelpCircle className="w-5 h-5 text-indigo-400" />}>
                    <p className="text-slate-300 leading-relaxed">{result.summary}</p>
                </Section>

                <Section title="What You Should Do" icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}>
                    <p className="font-medium text-white mb-3">{result.action}</p>
                    <ul className="space-y-2">
                        {result.nextSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                                <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-indigo-500" />
                                {step}
                            </li>
                        ))}
                    </ul>
                </Section>

                {result.deadlines && (
                    <Section title="Deadlines / Dates" icon={<Clock className="w-5 h-5 text-amber-400" />}>
                        <p className="text-sm text-slate-300">{result.deadlines}</p>
                    </Section>
                )}
            </div>

            <Disclaimer />
        </div>
    );
};

const Section = ({ title, icon, children }) => (
    <div className="border-t border-slate-700/50 pt-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            {icon} {title}
        </h3>
        {children}
    </div>
);

export default ResultCard;
