import React from 'react';
import { SERIOUSNESS_LEVELS } from '../lib/constants';

const PanicLevel = ({ level, confidence }) => {
    const getColor = (lvl) => {
        switch (lvl) {
            case SERIOUSNESS_LEVELS.HIGH: return 'bg-red-100 text-red-800 border-red-200';
            case SERIOUSNESS_LEVELS.MEDIUM: return 'bg-amber-100 text-amber-800 border-amber-200';
            case SERIOUSNESS_LEVELS.LOW: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getLabel = (lvl) => {
        switch (lvl) {
            case SERIOUSNESS_LEVELS.HIGH: return 'High Priority';
            case SERIOUSNESS_LEVELS.MEDIUM: return 'Action Required';
            case SERIOUSNESS_LEVELS.LOW: return 'Informational';
            default: return 'Unknown';
        }
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <div className={`px-4 py-2 rounded-full border font-bold text-sm flex items-center gap-2 ${getColor(level)}`}>
                <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${level === SERIOUSNESS_LEVELS.HIGH ? 'bg-red-500' : level === SERIOUSNESS_LEVELS.MEDIUM ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${level === SERIOUSNESS_LEVELS.HIGH ? 'bg-red-600' : level === SERIOUSNESS_LEVELS.MEDIUM ? 'bg-amber-600' : 'bg-emerald-600'}`}></span>
                </span>
                {getLabel(level)}
            </div>

            <div className="text-xs text-slate-400 font-medium bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                AI Confidence: <span className={confidence === 'HIGH' ? 'text-green-400' : confidence === 'MEDIUM' ? 'text-amber-400' : 'text-slate-400'}>{confidence}</span>
            </div>
        </div>
    );
};

export default PanicLevel;
