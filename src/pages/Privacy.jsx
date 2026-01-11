import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Privacy = () => {
    return (
        <Layout>
            <SEO title="Privacy Policy" description="How we handle your data on Gov Notice Decoder." />
            <div className="max-w-4xl mx-auto text-slate-300 p-8">
                <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
                <div className="space-y-4">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">1. Data Collection</h2>
                        <p>We do not store your personal data permanently. The text you submit is processed for analysis and then discarded.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">2. Processing</h2>
                        <p>Your input is processed by third-party AI providers (Google Gemini) solely for the purpose of generating the analysis.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-2">3. Cookies</h2>
                        <p>We use essential cookies to ensure the website functions properly. We may use analytics cookies to understand usage patterns.</p>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default Privacy;
