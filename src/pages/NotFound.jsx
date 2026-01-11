import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const NotFound = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h1 className="text-9xl font-bold text-slate-800">404</h1>
                <p className="text-2xl text-white font-semibold mt-4">Page Not Found</p>
                <p className="text-slate-400 mt-2 max-w-md">The page you are looking for does not exist or has been moved.</p>
                <Link
                    to="/"
                    className="mt-8 px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors text-white font-medium"
                >
                    Go Home
                </Link>
            </div>
        </Layout>
    );
};

export default NotFound;
