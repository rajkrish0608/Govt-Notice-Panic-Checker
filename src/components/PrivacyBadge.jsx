import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PrivacyBadge = () => (
    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4" />
        <span>Uploaded notices are processed temporarily and not stored.</span>
    </div>
);

export default PrivacyBadge;
