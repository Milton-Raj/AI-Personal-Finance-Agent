import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Users,
    Target,
    Award,
    Calendar,
    AlertCircle,
    CheckCircle,
    Trophy,
    Medal,
    Star
} from 'lucide-react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { adminService } from '../services/api';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [forecast, setForecast] = useState(null);
    const [cohorts, setCohorts] = useState(null);
    const [goals, setGoals] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [forecastData, cohortsData, goalsData] = await Promise.all([
                    adminService.getAnalyticsForecast(),
                    adminService.getCohortAnalysis(),
                    adminService.getGoals()
                ]);
                setForecast(forecastData);
                setCohorts(cohortsData);
                setGoals(goalsData);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="text-white">Loading analytics...</div>;
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'ahead': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'on_track': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'at_risk': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const getRetentionColor = (value) => {
        if (value >= 80) return 'bg-green-500';
        if (value >= 60) return 'bg-yellow-500';
        if (value >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>
                <p className="text-gray-400">Predictive insights, cohort analysis, and goal tracking</p>
            </div>

            {/* Predictive Analytics */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    Predictive Analytics
                </h3>

                {/* Insights Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {forecast?.insights?.map((insight, index) => (
                        <div
                            key={index}
                            className={`glass-card p-4 rounded-xl border ${insight.type === 'positive' ? 'border-green-500/20' :
                                    insight.type === 'warning' ? 'border-yellow-500/20' :
                                        'border-blue-500/20'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {insight.type === 'positive' ? (
                                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                ) : insight.type === 'warning' ? (
                                    <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                )}
                                <p className="text-sm text-gray-300">{insight.message}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Revenue Forecast Chart */}
                <div className="glass-card p-6 rounded-2xl">
                    <h4 className="text-lg font-bold text-white mb-6">30-Day Revenue Forecast</h4>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecast?.revenue_forecast || []}>
                                <defs>
                                    <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="day"
                                    stroke="#6b7280"
                                    label={{ value: 'Days', position: 'insideBottom', offset: -5, fill: '#9ca3af' }}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                                    label={{ value: 'Revenue', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a2e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Predicted']}
                                />
                                <Area type="monotone" dataKey="upper_bound" stroke="none" fill="rgba(96, 165, 250, 0.1)" />
                                <Area type="monotone" dataKey="predicted" stroke="#60a5fa" strokeWidth={3} fill="url(#forecastGradient)" />
                                <Area type="monotone" dataKey="lower_bound" stroke="none" fill="rgba(96, 165, 250, 0.1)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Cohort Analysis */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    Cohort Analysis
                </h3>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="glass-card p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Week 1 Retention</p>
                        <p className="text-2xl font-bold text-white">{cohorts?.summary?.avg_retention_week_1}%</p>
                    </div>
                    <div className="glass-card p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Week 4 Retention</p>
                        <p className="text-2xl font-bold text-white">{cohorts?.summary?.avg_retention_week_4}%</p>
                    </div>
                    <div className="glass-card p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Week 12 Retention</p>
                        <p className="text-2xl font-bold text-white">{cohorts?.summary?.avg_retention_week_12}%</p>
                    </div>
                    <div className="glass-card p-4 rounded-xl">
                        <p className="text-gray-400 text-sm mb-1">Avg Premium Conv.</p>
                        <p className="text-2xl font-bold text-white">{cohorts?.summary?.avg_premium_conversion}%</p>
                    </div>
                </div>

                {/* Retention Heatmap */}
                <div className="glass-card p-6 rounded-2xl overflow-x-auto">
                    <h4 className="text-lg font-bold text-white mb-4">Retention Heatmap</h4>
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-13 gap-2">
                            {/* Header */}
                            <div className="text-gray-400 text-sm font-semibold">Cohort</div>
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="text-gray-400 text-xs text-center">W{i + 1}</div>
                            ))}

                            {/* Cohort Rows */}
                            {cohorts?.cohorts?.map((cohort, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="text-white text-sm font-medium flex items-center">
                                        {cohort.cohort}
                                        <span className="text-xs text-gray-500 ml-2">({cohort.size})</span>
                                    </div>
                                    {cohort.retention.map((value, i) => (
                                        <div
                                            key={i}
                                            className={`h-10 rounded flex items-center justify-center text-white text-xs font-semibold ${getRetentionColor(value)}`}
                                        >
                                            {value}%
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Goal Tracking */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-400" />
                    Goal Tracking
                </h3>

                {/* Goals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals?.goals?.map((goal) => (
                        <div key={goal.id} className="glass-card p-6 rounded-2xl">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="text-lg font-bold text-white">{goal.name}</h4>
                                    <p className="text-sm text-gray-400">Target: {goal.unit}{goal.target.toLocaleString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(goal.status)}`}>
                                    {goal.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">{goal.unit}{goal.current.toLocaleString()}</span>
                                    <span className="text-blue-400 font-semibold">{goal.progress.toFixed(1)}%</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${goal.status === 'ahead' ? 'bg-green-500' :
                                                goal.status === 'on_track' ? 'bg-blue-500' :
                                                    'bg-yellow-500'
                                            }`}
                                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Deadline: {goal.deadline}</span>
                                </div>
                                <span>{goal.target - goal.current > 0 ? `${goal.target - goal.current} to go` : 'Goal achieved!'}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Achievements */}
                <div className="glass-card p-6 rounded-2xl">
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Award className="w-6 h-6 text-yellow-400" />
                        Achievements
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {goals?.achievements?.map((achievement, idx) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-xl border ${achievement.unlocked
                                        ? 'bg-yellow-500/10 border-yellow-500/20'
                                        : 'bg-white/5 border-white/10 opacity-50'
                                    }`}
                            >
                                <div className="flex flex-col items-center text-center gap-2">
                                    {achievement.unlocked ? (
                                        <Trophy className="w-12 h-12 text-yellow-400" />
                                    ) : (
                                        <Medal className="w-12 h-12 text-gray-500" />
                                    )}
                                    <p className="text-sm font-semibold text-white">{achievement.name}</p>
                                    {achievement.unlocked && achievement.date && (
                                        <p className="text-xs text-gray-400">{achievement.date}</p>
                                    )}
                                    {!achievement.unlocked && (
                                        <p className="text-xs text-gray-500">Locked</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
