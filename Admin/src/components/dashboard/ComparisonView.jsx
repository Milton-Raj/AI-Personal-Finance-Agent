import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';

const ComparisonView = ({ data }) => {
    const metrics = [
        {
            name: 'Revenue',
            thisWeek: 12500,
            lastWeek: 10800,
            icon: DollarSign,
            format: (val) => `$${val.toLocaleString()}`
        },
        {
            name: 'New Users',
            thisWeek: 245,
            lastWeek: 198,
            icon: Users,
            format: (val) => val.toLocaleString()
        },
        {
            name: 'Conversions',
            thisWeek: 42,
            lastWeek: 38,
            icon: TrendingUp,
            format: (val) => val
        }
    ];

    const getChange = (current, previous) => {
        const change = ((current - previous) / previous) * 100;
        return {
            value: Math.abs(change).toFixed(1),
            isPositive: change >= 0
        };
    };

    return (
        <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Week-over-Week Comparison</h3>

            <div className="space-y-4">
                {metrics.map((metric, idx) => {
                    const change = getChange(metric.thisWeek, metric.lastWeek);
                    const Icon = metric.icon;

                    return (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span className="text-white font-medium">{metric.name}</span>
                                </div>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${change.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {change.isPositive ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}
                                    <span className="text-sm font-semibold">{change.value}%</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">This Week</p>
                                    <p className="text-xl font-bold text-white">{metric.format(metric.thisWeek)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Last Week</p>
                                    <p className="text-lg font-semibold text-gray-300">{metric.format(metric.lastWeek)}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ComparisonView;
