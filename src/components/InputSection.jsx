import React, { useState } from 'react';
import { Search, FileText, Loader2 } from 'lucide-react';

const InputSection = ({ onAnalyze, isAnalyzing }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAnalyze(text);
        }
    };

    return (
        <div className="glass-panel p-6 max-w-2xl mx-auto mt-8">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="notice-text" className="block text-sm font-medium text-slate-300 mb-2">
                        Paste Notice Text / SMS Content
                    </label>
                    <textarea
                        id="notice-text"
                        rows={8}
                        className="w-full text-sm leading-relaxed"
                        placeholder="Paste the full text of the notice, SMS, or email here. Include as much detail as possible for better accuracy..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    {/* Visual placeholder for File Upload - MVP only supports text */}
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-600 rounded-lg text-slate-400 text-sm hover:border-slate-400 transition-colors cursor-not-allowed opacity-60"
                        title="File upload coming soon"
                    >
                        <FileText className="w-4 h-4" /> Upload Photo (PDF/IMG)
                    </button>

                    <button
                        type="submit"
                        disabled={!text.trim() || isAnalyzing}
                        className={`btn-primary flex items-center gap-2 ${(!text.trim() || isAnalyzing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                            </>
                        ) : (
                            <>
                                <Search className="w-4 h-4" /> Assess Risk
                            </>
                        )}
                    </button>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                    *Currently supports text input only. For photos, please transcribe the key details.
                </p>
            </form>
        </div>
    );
};

export default InputSection;
