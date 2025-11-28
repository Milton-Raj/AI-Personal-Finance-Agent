import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const RevenueBreakdown = ({ data }) => {
    const COLORS = ['#60a5fa', '#34d399', '#fbbf24'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-3 shadow-xl">
                    <p className="text-white font-bold">{payload[0].name}</p>
                    <p className="text-gray-400 text-sm">${payload[0].value.toLocaleString()}</p>
                    <p className="text-blue-400 text-xs">{payload[0].payload.percentage}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Revenue Breakdown</h3>

            {data && data.sources ? (
                <>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.sources}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.sources.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 space-y-3">
                        {data.sources.map((source, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: source.color || COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-sm text-gray-300">{source.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white">${source.value.toLocaleString()}</p>
                                    <p className="text-xs text-gray-400">{source.percentage}%</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-medium">Total Revenue</span>
                            <span className="text-2xl font-bold text-white">${data.total.toLocaleString()}</span>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-gray-400 text-sm text-center py-8">No revenue data available</p>
            )}
        </div>
    );
};

export default RevenueBreakdown;
