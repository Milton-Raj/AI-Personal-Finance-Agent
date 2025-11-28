import React from 'react';
import { Users, ArrowRight, X } from 'lucide-react';

const ConversionFunnel = () => {
    const stages = [
        { name: 'Visitors', count: 10000, percentage: 100, color: 'bg-blue-500' },
        { name: 'Sign Ups', count: 2500, percentage: 25, color: 'bg-green-500' },
        { name: 'Active Users', count: 1800, percentage: 18, color: 'bg-yellow-500' },
        { name: 'Premium Trial', count: 450, percentage: 4.5, color: 'bg-orange-500' },
        { name: 'Premium Paid', count: 180, percentage: 1.8, color: 'bg-purple-500' }
    ];

    const getDropOff = (current, next) => {
        if (!next) return null;
        const dropOff = current.count - next.count;
        const dropOffPercent = ((dropOff / current.count) * 100).toFixed(1);
        return { count: dropOff, percent: dropOffPercent };
    };

    return (
        <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Conversion Funnel</h3>

            <div className="space-y-3">
                {stages.map((stage, idx) => {
                    const dropOff = getDropOff(stage, stages[idx + 1]);

                    return (
                        <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                            {/* Stage */}
                            <div className="relative">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium">{stage.name}</span>
                                            <span className="text-gray-400 text-sm">{stage.percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${stage.color} transition-all duration-500`}
                                                style={{ width: `${stage.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{stage.count.toLocaleString()}</p>
                                        <p className="text-xs text-gray-400">users</p>
                                    </div>
                                </div>
                            </div>

                            {/* Drop-off indicator */}
                            {dropOff && (
                                <div className="flex items-center justify-center my-2">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                                        <X className="w-3 h-3 text-red-400" />
                                        <span className="text-xs text-red-400 font-medium">
                                            {dropOff.count.toLocaleString()} drop-off ({dropOff.percent}%)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Insights */}
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-400 font-medium mb-1">💡 Key Insight</p>
                <p className="text-sm text-gray-300">
                    Biggest drop-off at Sign Up → Active (28%). Consider improving onboarding flow.
                </p>
            </div>
        </div>
    );
};

export default ConversionFunnel;
