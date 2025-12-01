import React, { useState, useEffect } from 'react';
import {
    Users,
    DollarSign,
    TrendingUp,
    ShoppingBag,
    Wallet,
    Coins,
    Calendar,
    Download,
    FileText,
    Mail,
    ChevronDown,
    Moon,
    Sun
} from 'lucide-react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';
import { adminService } from '../services/api';
import QuickStatsTicker from '../components/dashboard/QuickStatsTicker';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TopPerformers from '../components/dashboard/TopPerformers';
import SmartAlerts from '../components/dashboard/SmartAlerts';
import RevenueBreakdown from '../components/dashboard/RevenueBreakdown';
import GeographicMap from '../components/dashboard/GeographicMap';
import ConversionFunnel from '../components/dashboard/ConversionFunnel';
import ComparisonView from '../components/dashboard/ComparisonView';
import UserEngagement from '../components/dashboard/UserEngagement';
import ExportOptions from '../components/dashboard/ExportOptions';
import { useTheme } from '../context/ThemeContext';

const AnalyticsCard = ({ title, value, change, icon: Icon, data, chartType = 'line', color = '#60a5fa' }) => {
    const renderChart = () => {
        const chartProps = {
            data,
            margin: { top: 5, right: 5, bottom: 5, left: 5 }
        };

        switch (chartType) {
            case 'area':
                return (
                    <AreaChart {...chartProps}>
                        <defs>
                            <linearGradient id={`gradient - ${title} `} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#gradient - ${title})`} />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart {...chartProps}>
                        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            default:
                return (
                    <LineChart {...chartProps}>
                        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
                    </LineChart>
                );
        }
    };

    return (
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
                    {change && (
                        <div className={`flex items - center gap - 1 text - sm font - medium ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                            } `}>
                            <TrendingUp className="w-4 h-4" />
                            <span>{change}</span>
                            <span className="text-gray-500 text-xs">vs last period</span>
                        </div>
                    )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                    <Icon className="w-6 h-6" style={{ color }} />
                </div>
            </div>

            <div className="h-20 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('7days');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const { theme, toggleTheme } = useTheme();

    // Premium features state
    const [quickStats, setQuickStats] = useState([]);
    const [activityFeed, setActivityFeed] = useState([]);
    const [topPerformers, setTopPerformers] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [revenueBreakdown, setRevenueBreakdown] = useState(null);

    const generateTrendData = (baseValue, variance = 0.2) => {
        return Array.from({ length: 7 }, (_, i) => ({
            day: i,
            value: Math.floor(baseValue * (1 + (Math.random() - 0.5) * variance))
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Calculate dates based on range
                let startDate = null;
                let endDate = new Date().toISOString();

                if (dateRange !== 'custom') {
                    const end = new Date();
                    const start = new Date();
                    if (dateRange === '7days') start.setDate(end.getDate() - 7);
                    if (dateRange === '30days') start.setDate(end.getDate() - 30);
                    if (dateRange === '90days') start.setDate(end.getDate() - 90);
                    startDate = start.toISOString();
                } else if (customStartDate && customEndDate) {
                    startDate = new Date(customStartDate).toISOString();
                    endDate = new Date(customEndDate).toISOString();
                }

                const [statsData, quickStatsData, activityData, performersData, alertsData, revenueData] = await Promise.all([
                    adminService.getStats(startDate, endDate),
                    adminService.getQuickStats(),
                    adminService.getActivityFeed(20),
                    adminService.getTopPerformers(),
                    adminService.getAlerts(),
                    adminService.getRevenueBreakdown()
                ]);

                setStats(statsData);
                setQuickStats(quickStatsData.stats || []);
                setActivityFeed(activityData || []);
                setTopPerformers(performersData);
                setAlerts(alertsData || []);
                setRevenueBreakdown(revenueData);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dateRange, customStartDate, customEndDate]);

    const handleDismissAlert = (alertId) => {
        setAlerts(alerts.filter(alert => alert.id !== alertId));
    };

    if (loading) {
        return <div className="text-white">Loading dashboard...</div>;
    }

    const analyticsData = [
        {
            title: 'Total Users',
            value: stats?.total_users || 0,
            change: '+12.5%',
            icon: Users,
            data: generateTrendData(parseInt((stats?.total_users || '100').toString().replace(/,/g, '')), 0.15),
            chartType: 'area',
            color: '#60a5fa'
        },
        {
            title: 'Premium Users',
            value: stats?.premium_users || 0,
            change: '+8.2%',
            icon: Users,
            data: generateTrendData(parseInt((stats?.premium_users || '50').toString().replace(/,/g, '')), 0.2),
            chartType: 'line',
            color: '#fbbf24'
        },
        {
            title: 'Premium Revenue',
            value: `$${stats?.total_revenue || 0} `,
            change: '+15.3%',
            icon: DollarSign,
            data: generateTrendData(parseInt((stats?.total_revenue || '1000').toString().replace(/,/g, '')), 0.25),
            chartType: 'area',
            color: '#34d399'
        },
        {
            title: 'Total Product Purchases',
            value: '1,234',
            change: '+5.7%',
            icon: ShoppingBag,
            data: generateTrendData(1234, 0.18),
            chartType: 'bar',
            color: '#a78bfa'
        },
        {
            title: 'Total Wallet Amount',
            value: '$45,678',
            change: '+22.1%',
            icon: Wallet,
            data: generateTrendData(45678, 0.12),
            chartType: 'area',
            color: '#f472b6'
        },
        {
            title: 'Total Coins',
            value: '892,456',
            change: '+18.9%',
            icon: Coins,
            data: generateTrendData(892456, 0.15),
            chartType: 'line',
            color: '#fb923c'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header with Export Options and Date Filter */}
            <div className="flex flex-col gap-4">
                {/* Title and Description */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
                        <p className="text-gray-400">Welcome back, Admin. Here's your analytics summary.</p>
                    </div>
                </div>

                {/* Export Options Bar and Date Filter */}
                <div className="flex items-center justify-between gap-4 p-4 glass-card rounded-2xl relative">
                    {/* Left: Date Filter - Reordered */}
                    <div className="flex items-center gap-3">
                        {/* Dropdown First */}
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="90days">Last 90 Days</option>
                            <option value="custom">Custom Range</option>
                        </select>

                        {/* Custom Date Range Inputs */}
                        {dateRange === 'custom' && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer hover:bg-white/10 transition-all"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer hover:bg-white/10 transition-all"
                                />
                            </div>
                        )}
                    </div>

                    {/* Right: Export Options + Theme Toggle */}
                    <div className="flex items-center gap-2">
                        {/* Export PDF */}
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                            <Download className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm text-white font-medium">PDF</span>
                        </button>

                        {/* Export CSV */}
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                            <FileText className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm text-white font-medium">CSV</span>
                        </button>

                        {/* Email Report */}
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                            <Mail className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm text-white font-medium">Email</span>
                        </button>

                        {/* Scheduled Reports Dropdown - Fixed z-index */}
                        <div className="relative">
                            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all peer">
                                <Calendar className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-yellow-400 font-medium">Scheduled</span>
                                <ChevronDown className="w-4 h-4 text-yellow-400" />
                            </button>

                            {/* Dropdown Menu - Fixed with higher z-index and proper positioning */}
                            <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl border border-white/10 p-3 opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all z-[9999] shadow-2xl">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                            <span className="text-sm text-white">Weekly Summary</span>
                                        </div>
                                        <span className="text-xs text-green-400">Active</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                            <span className="text-sm text-white">Monthly Report</span>
                                        </div>
                                        <span className="text-xs text-green-400">Active</span>
                                    </div>
                                    <div className="border-t border-white/10 my-2" />
                                    <button className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-sm text-blue-400">
                                        + Configure Schedule
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Ticker */}
            <QuickStatsTicker stats={quickStats} />

            {/* Analytics Cards - 3 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyticsData.map((card, index) => (
                    <div key={index} className={`animate - fade -in stagger - ${index + 1} `}>
                        <AnalyticsCard {...card} />
                    </div>
                ))}
            </div>

            {/* Premium Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Feed */}
                <div className="lg:col-span-1 animate-fade-in stagger-1">
                    <ActivityFeed activities={activityFeed} />
                </div>

                {/* Top Performers */}
                <div className="lg:col-span-1 animate-fade-in stagger-2">
                    <TopPerformers data={topPerformers} />
                </div>

                {/* Revenue Breakdown */}
                <div className="lg:col-span-1 animate-fade-in stagger-3">
                    <RevenueBreakdown data={revenueBreakdown} />
                </div>
            </div>

            {/* New Features Row 1: Geographic, Funnel, Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="animate-fade-in stagger-1">
                    <GeographicMap />
                </div>
                <div className="animate-fade-in stagger-2">
                    <ConversionFunnel />
                </div>
                <div className="animate-fade-in stagger-3">
                    <ComparisonView />
                </div>
            </div>

            {/* User Engagement - Full Width */}
            <div className="animate-fade-in">
                <UserEngagement />
            </div>

            {/* Smart Alerts */}
            <div className="animate-fade-in">
                <SmartAlerts alerts={alerts} onDismiss={handleDismissAlert} />
            </div>
        </div>
    );
};

export default Dashboard;
