import React, { useState } from 'react';
import Layout from './components/Layout';
import InputSection from './components/InputSection';
import ResultCard from './components/ResultCard';
import { analyzeNotice } from './lib/analyzer';

function App() {
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
      <div className="text-center mb-10 animate-fade-in">
        <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Don't Panic. <span className="text-indigo-400">Decode It.</span>
        </h2>
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

export default App;
