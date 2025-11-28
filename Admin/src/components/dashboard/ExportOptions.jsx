import React from 'react';
import { Info } from 'lucide-react';

const ExportOptions = () => {
    return (
        <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 text-gray-400">
                <Info className="w-5 h-5" />
                <p className="text-sm">Export options have been moved to the dashboard header for easier access.</p>
            </div>
        </div>
    );
};

export default ExportOptions;
