import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const UserEngagement = () => {
    const engagementScore = 78;
    const dau = 1234;
    const mau = 8567;
    const retentionRate = 68;

    const engagementData = [
        { day: 'Mon', score: 72 },
        { day: 'Tue', score: 75 },
        { day: 'Wed', score: 78 },
        { day: 'Thu', score: 76 },
        { day: 'Fri', score: 80 },
        { day: 'Sat', score: 74 },
        { day: 'Sun', score: 78 }
    ];

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreGradient = (score) => {
        if (score >= 80) return 'from-green-500 to-emerald-600';
        if (score >= 60) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-pink-600';
    };

    return (
        <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400" />
                User Engagement
            </h3>

            {/* Engagement Score Circle */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                    <svg className="transform -rotate-90 w-40 h-40">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                            fill="none"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 70}`}
                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - engagementScore / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#a78bfa" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${getScoreColor(engagementScore)}`}>
                            {engagementScore}
                        </span>
                        <span className="text-sm text-gray-400">Health Score</span>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/5 text-center">
                    <p className="text-xs text-gray-400 mb-1">DAU</p>
                    <p className="text-lg font-bold text-white">{dau.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 text-center">
                    <p className="text-xs text-gray-400 mb-1">MAU</p>
                    <p className="text-lg font-bold text-white">{mau.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 text-center">
                    <p className="text-xs text-gray-400 mb-1">Retention</p>
                    <p className="text-lg font-bold text-white">{retentionRate}%</p>
                </div>
            </div>

            {/* Trend Chart */}
            <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={10} />
                        <YAxis hide domain={[60, 85]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a2e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="score" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserEngagement;
