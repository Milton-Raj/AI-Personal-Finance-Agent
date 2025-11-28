import React from 'react';
import { MapPin } from 'lucide-react';

const GeographicMap = () => {
    const regions = [
        { name: 'North America', users: 4523, revenue: 125000, growth: '+15%', color: 'bg-blue-500' },
        { name: 'Europe', users: 3210, revenue: 98000, growth: '+12%', color: 'bg-green-500' },
        { name: 'Asia', users: 5678, revenue: 145000, growth: '+28%', color: 'bg-purple-500' },
        { name: 'South America', users: 1234, revenue: 34000, growth: '+8%', color: 'bg-yellow-500' },
        { name: 'Africa', users: 890, revenue: 21000, growth: '+18%', color: 'bg-orange-500' }
    ];

    const maxUsers = Math.max(...regions.map(r => r.users));

    return (
        <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-400" />
                Geographic Distribution
            </h3>

            {/* Simple Bar Chart Representation */}
            <div className="space-y-4">
                {regions.map((region, idx) => {
                    const widthPercent = (region.users / maxUsers) * 100;

                    return (
                        <div
                            key={idx}
                            className="animate-fade-in"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${region.color}`} />
                                    <span className="text-sm font-medium text-white">{region.name}</span>
                                </div>
                                <span className="text-xs text-green-400 font-semibold">{region.growth}</span>
                            </div>

                            <div className="relative h-12 bg-white/5 rounded-xl overflow-hidden">
                                <div
                                    className={`absolute inset-y-0 left-0 ${region.color} opacity-30 transition-all duration-1000`}
                                    style={{ width: `${widthPercent}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-between px-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Users</p>
                                        <p className="text-sm font-bold text-white">{region.users.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Revenue</p>
                                        <p className="text-sm font-bold text-white">${(region.revenue / 1000).toFixed(0)}K</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Top Region Highlight */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                <p className="text-sm text-purple-400 font-medium mb-1">🔥 Hotspot</p>
                <p className="text-sm text-white">
                    <span className="font-bold">Asia</span> is your fastest growing region with +28% growth
                </p>
            </div>
        </div>
    );
};

export default GeographicMap;
