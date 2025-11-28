import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const CoinRules = () => {
    const rules = [
        { id: 1, action: 'Daily Login', coins: 10, type: 'Earn', status: 'Active' },
        { id: 2, action: 'Complete Profile', coins: 50, type: 'Earn', status: 'Active' },
        { id: 3, action: 'Refer a Friend', coins: 100, type: 'Earn', status: 'Active' },
        { id: 4, action: 'Premium Subscription', coins: 500, type: 'Earn', status: 'Active' },
        { id: 5, action: 'Unlock Theme', coins: -200, type: 'Spend', status: 'Active' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Coin Rules</h2>
                    <p className="text-gray-400">Manage how users earn and spend coins</p>
                </div>
                <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Rule
                </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Coins</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {rules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{rule.action}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm font-bold ${rule.type === 'Earn' ? 'text-green-400' : 'text-red-400'}`}>
                                        {rule.type === 'Earn' ? '+' : ''}{rule.coins}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${rule.type === 'Earn'
                                            ? 'bg-green-500/20 text-green-400 border-green-500/20'
                                            : 'bg-red-500/20 text-red-400 border-red-500/20'
                                        }`}>
                                        {rule.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20">
                                        {rule.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CoinRules;
