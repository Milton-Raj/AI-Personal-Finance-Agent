import React from 'react';
import { UserPlus, ShoppingCart, DollarSign, LogIn, Clock } from 'lucide-react';

const actionIcons = {
    signup: UserPlus,
    purchase: ShoppingCart,
    transaction: DollarSign,
    login: LogIn
};

const ActivityFeed = ({ activities }) => {
    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const activityTime = new Date(timestamp);
        const diffMs = now - activityTime;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    };

    return (
        <div className="glass-card p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Live Activity</h3>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-gray-400">Live</span>
                </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {activities && activities.length > 0 ? (
                    activities.map((activity, index) => {
                        const Icon = actionIcons[activity.action_type] || DollarSign;
                        return (
                            <div
                                key={activity.id || index}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer animate-in fade-in slide-in-from-top duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-white/10 shrink-0">
                                    <Icon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-medium">{activity.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3 text-gray-500" />
                                        <span className="text-xs text-gray-400">{getTimeAgo(activity.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-400 text-sm text-center py-8">No recent activity</p>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
