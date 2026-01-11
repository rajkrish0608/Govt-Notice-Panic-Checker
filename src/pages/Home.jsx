import React, { useState } from 'react';
import Layout from '../components/Layout';
import InputSection from '../components/InputSection';
import ResultCard from '../components/ResultCard';
import SEO from '../components/SEO';
import { analyzeNotice } from '../lib/analyzer';

function Home() {
    const [result, setResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async (text) => {
        setIsAnalyzing(true);
        try {
            // Real API Call
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
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Layout>
            <SEO
                title="Analyze Government Notices Instantly"
                description="Decode confusing government notices with AI. Understand seriousness, next steps, and legal implications in simple language."
            />
            <div className="text-center mb-10 animate-fade-in">
                <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                    Don't Panic. <span className="text-indigo-400">Decode It.</span>
                </h2>
                <div className="flex justify-center gap-4 mb-4 text-xs font-medium text-indigo-300 uppercase tracking-widest">
                    <span className="bg-indigo-900/30 px-2 py-1 rounded border border-indigo-500/20">No Login Required</span>
                    <span className="bg-indigo-900/30 px-2 py-1 rounded border border-indigo-500/20">No Data Stored</span>
                    <span className="bg-indigo-900/30 px-2 py-1 rounded border border-indigo-500/20">AI Analysis</span>
                </div>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                    Received a confusing government notice? Paste the text below to instantly understand its seriousness and next steps in simple language.
                </p>
            </div>

            <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

            {result && (
                <div id="result-section">
                    <ResultCard result={result} />
                </div>
            )}
        </Layout>
    );
}

export default Home;
