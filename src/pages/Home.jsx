import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
// Removed direct import to avoid breaking if component structure changes
// analyzeNotice is now internal or we update the lib

function Home() {
    const [result, setResult] = useState(null);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [activeTab, setActiveTab] = useState('text'); // 'text' or 'upload'
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("File size must be under 5MB");
                return;
            }
            setFile(selectedFile);
            setError(null);

            // Preview for images
            if (selectedFile.type.startsWith('image/')) {
                const url = URL.createObjectURL(selectedFile);
                setPreviewUrl(url);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleAnalyze = async () => {
        if (activeTab === 'text' && (!text || text.length < 10)) return;
        if (activeTab === 'upload' && !file) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();

            if (activeTab === 'text') {
                formData.append('text', text);
            } else {
                formData.append('file', file);
            }

            // Using fetch directly instead of lib/analyzer to handle FormData easily
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/analyze`, {
                method: 'POST',
                body: formData, // Auto-sets Content-Type to multipart/form-data
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Analysis failed: ${response.statusText}`);
            }

            const analysisResult = await response.json();
            setResult(analysisResult);

            // Smooth scroll to result
            setTimeout(() => {
                const resultElement = document.getElementById('result-section');
                if (resultElement) {
                    resultElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);

        } catch (err) {
            console.error(err);
            setError(err.message || "Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Layout>
            <SEO
                title="Gov Notice Decoder - Understand Government Notices"
                description="Understand government notices without panic. Secure AI analysis provides clear explanations and next steps."
            />

            <div className="max-w-3xl mx-auto">
                {/* Main Card */}
                <div className="card mb-8">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold mb-2 text-slate-900">Understand Your Notice</h2>
                        <p className="text-slate-500 text-sm max-w-lg mx-auto">
                            This tool provides a clear explanation of what a notice says, how serious it is, and what you should do next.
                        </p>
                    </div>

                    {/* Steps Row - Clean & Professional */}
                    <div className="flex justify-center gap-12 mb-8 border-b border-slate-100 pb-8">
                        <div className="text-center">
                            <div className="w-8 h-8 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-semibold text-sm mb-2">1</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Upload / Paste</div>
                        </div>
                        <div className="text-center">
                            <div className="w-8 h-8 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-semibold text-sm mb-2">2</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Auto-Review</div>
                        </div>
                        <div className="text-center">
                            <div className="w-8 h-8 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-semibold text-sm mb-2">3</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Get Action Plan</div>
                        </div>
                    </div>

                    {/* Input Tabs */}
                    <div className="flex gap-4 mb-4 border-b border-slate-200">
                        <button
                            className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === 'text' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('text')}
                        >
                            Paste Text
                        </button>
                        <button
                            className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === 'upload' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('upload')}
                        >
                            Upload File (PDF/Image)
                        </button>
                    </div>

                    {/* Input Area */}
                    <div className="mb-6">
                        {activeTab === 'text' ? (
                            <textarea
                                className="w-full min-h-[240px] p-4 bg-white border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-700 transition-all resize-y text-base leading-relaxed"
                                placeholder="Paste the complete text from the notice or message here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                disabled={isAnalyzing}
                                spellCheck={false}
                            />
                        ) : (
                            <div
                                className="w-full min-h-[240px] border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-8 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange}
                                />

                                {file ? (
                                    <div className="text-center">
                                        <div className="mb-4">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="h-40 object-contain mx-auto rounded shadow-sm" />
                                            ) : (
                                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <span className="font-bold text-xs">PDF</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-slate-800">{file.name}</p>
                                        <p className="text-xs text-slate-500 mb-4">{(file.size / 1024).toFixed(1)} KB</p>
                                        <button
                                            className="text-xs text-red-600 hover:underline"
                                            onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); }}
                                        >
                                            Remove File
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 mb-4 text-slate-400">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium mb-1">Click to upload or drag and drop</p>
                                        <p className="text-xs text-slate-500">PDF, JPG, PNG (Max 5MB)</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-6 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                No Account Needed
                            </span>
                            <span className="flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                Data Not Stored
                            </span>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {error && <span className="text-red-600 text-sm font-medium">{error}</span>}
                            <button
                                className="w-full md:w-auto btn-primary"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || (activeTab === 'text' ? text.length < 10 : !file)}
                            >
                                {isAnalyzing ? 'Reviewing...' : 'Review Notice'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Result Section */}
                {result && (
                    <div id="result-section" className="animate-fade-in space-y-6 pb-12">
                        <div className="card">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                <h3 className="text-lg font-semibold text-slate-900 m-0">Analysis Result</h3>
                                <span className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide ${result.seriousness === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-100' :
                                        result.seriousness === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                            'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    }`}>
                                    {result.seriousness} PRIORITY
                                </span>
                            </div>

                            <div className="grid gap-8">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Explanation</h4>
                                    <p className="text-slate-800 leading-7">
                                        {result.summary}
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Action</h4>
                                        <p className="text-slate-800 text-sm leading-6 mb-0">
                                            {result.action}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deadlines</h4>
                                        <p className="text-slate-800 text-sm leading-6 mb-0">
                                            {result.deadlines}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Next Steps</h4>
                                    <ul className="space-y-3">
                                        {result.nextSteps.map((step, index) => (
                                            <li key={index} className="flex gap-3 text-slate-700 text-sm">
                                                <span className="flex-shrink-0 w-5 h-5 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                                    {index + 1}
                                                </span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <p className="text-xs text-slate-400 max-w-lg mx-auto">
                                Disclaimer: This tool provides general guidance only and does not replace professional or legal advice.
                                Always verify important notices with official sources.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Home;
