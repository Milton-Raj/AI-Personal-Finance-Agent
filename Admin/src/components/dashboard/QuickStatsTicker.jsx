import React, { useState, useEffect } from 'react';
import { Users, Star, Activity, DollarSign, Zap, TrendingUp } from 'lucide-react';

const iconMap = {
    users: Users,
    star: Star,
    activity: Activity,
    dollar: DollarSign,
    zap: Zap,
    'trending-up': TrendingUp
};

const QuickStatsTicker = ({ stats }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % stats.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [stats.length]);

    if (!stats || stats.length === 0) return null;

    const currentStat = stats[currentIndex];
    const Icon = iconMap[currentStat.icon] || Activity;

    return (
        <div className="glass-card px-6 py-4 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between animate-in fade-in slide-in-from-right duration-500">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                        <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-medium">{currentStat.label}</p>
                        <p className="text-2xl font-bold text-white">{currentStat.value}</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    {stats.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-blue-400' : 'w-1 bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickStatsTicker;
