import React, { useState } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { analyzeNotice } from '../lib/analyzer';

function Home() {
    const [result, setResult] = useState(null);
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        if (!text || text.length < 10) return;

        setIsAnalyzing(true);
        setError(null);
        try {
            const analysisResult = await analyzeNotice(text);
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
            setError("Analysis failed. Please try again.");
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

            <div className="container-max pt-16 pb-24">
                {/* Hero Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1>Gov Notice Decoder</h1>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
                        Understand government notices. <br />
                        Without panic. Without confusion.
                    </p>

                    <div className="trust-signals">
                        <span className="trust-item">No Login Required</span>
                        <span className="text-muted">•</span>
                        <span className="trust-item">No Data Stored</span>
                        <span className="text-muted">•</span>
                        <span className="trust-item">General Guidance Only</span>
                    </div>
                </div>

                {/* Input Section */}
                <div className="card mb-12">
                    <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                        Paste Notice or SMS Content
                    </label>
                    <textarea
                        className="w-full h-48 mb-6 focus:ring-1 focus:ring-indigo-500"
                        placeholder="Paste the full text of the notice, message, or email here. Include all available details for better accuracy."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isAnalyzing}
                    />

                    <div className="flex justify-end">
                        <button
                            className="btn btn-primary w-full md:w-auto min-w-[160px]"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || text.length < 10}
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Notice'}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Result Section */}
                {result && (
                    <div id="result-section" className="animate-fade-in space-y-8">

                        {/* Header Card */}
                        <div className="card flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="mb-1">Assessment Complete</h3>
                                <p className="mb-0 text-sm">Based on the text provided</p>
                            </div>
                            <div className={`badge ${result.seriousness === 'HIGH' ? 'badge-high' :
                                    result.seriousness === 'MEDIUM' ? 'badge-medium' : 'badge-low'
                                }`}>
                                Risk Level: {result.seriousness}
                            </div>
                        </div>

                        {/* Main Analysis Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* What This Means */}
                            <div className="card">
                                <h3 className="mb-4 text-indigo-400">What This Means</h3>
                                <p className="mb-0">{result.summary}</p>
                            </div>

                            {/* What You Should Do */}
                            <div className="card">
                                <h3 className="mb-4 text-indigo-400">What You Should Do</h3>
                                <p className="mb-0">{result.action}</p>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="card">
                            <h3 className="mb-4">Recommended Next Steps</h3>
                            <ul className="bullet-list space-y-2">
                                {result.nextSteps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Disclaimer */}
                        <div className="text-center max-w-2xl mx-auto mt-12">
                            <p className="text-legal italic opacity-50">
                                Disclaimer: This tool provides general informational guidance only and does not offer legal or financial advice.
                                Always verify important notices with official sources or a qualified professional.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Home;
