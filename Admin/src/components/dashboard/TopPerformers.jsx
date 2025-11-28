import React from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

const TopPerformers = ({ data }) => {
    const getMedalIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-5 h-5 text-yellow-400" />;
            case 2:
                return <Medal className="w-5 h-5 text-gray-300" />;
            case 3:
                return <Award className="w-5 h-5 text-orange-400" />;
            default:
                return <span className="text-gray-400 font-bold">#{rank}</span>;
        }
    };

    return (
        <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Top Performers</h3>

            {/* Top Users */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Top Users</h4>
                <div className="space-y-3">
                    {data?.top_users && data.top_users.length > 0 ? (
                        data.top_users.slice(0, 3).map((user, index) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <div className="w-8 h-8 flex items-center justify-center">
                                    {getMedalIcon(index + 1)}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {user.full_name ? user.full_name.charAt(0) : 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{user.full_name || 'Unknown User'}</p>
                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                </div>
                                {user.is_premium_member && (
                                    <div className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/20 rounded-lg">
                                        <span className="text-xs text-yellow-400 font-semibold">PRO</span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">No user data available</p>
                    )}
                </div>
            </div>

            {/* Top Products */}
            <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Top Products</h4>
                <div className="space-y-2">
                    {data?.top_products && data.top_products.length > 0 ? (
                        data.top_products.map((product, index) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400 font-bold text-sm">#{index + 1}</span>
                                    <div>
                                        <p className="text-sm font-medium text-white">{product.name}</p>
                                        <p className="text-xs text-gray-400">{product.sales} sales</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-green-400">${product.revenue.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 text-xs text-green-400">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>+12%</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">No product data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopPerformers;
