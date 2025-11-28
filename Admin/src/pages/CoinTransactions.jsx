import React from 'react';
import { ArrowRightLeft, Search, User } from 'lucide-react';

const CoinTransactions = () => {
    const transactions = [
        { id: 1, user: 'Milton Raj', amount: 100, type: 'Credit', reason: 'Referral Bonus', date: '2024-03-15' },
        { id: 2, user: 'John Doe', amount: -200, type: 'Debit', reason: 'Theme Purchase', date: '2024-03-14' },
        { id: 3, user: 'Jane Smith', amount: 50, type: 'Credit', reason: 'Profile Completion', date: '2024-03-14' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Coin Transactions</h2>
                    <p className="text-gray-400">View and manage coin transfers</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" />
                    Transfer Coins
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by user..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                    />
                </div>
                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none">
                    <option>All Types</option>
                    <option>Credit</option>
                    <option>Debit</option>
                </select>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Reason</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <span className="text-sm font-medium text-white">{tx.user}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm font-bold ${tx.type === 'Credit' ? 'text-green-400' : 'text-red-400'}`}>
                                        {tx.type === 'Credit' ? '+' : ''}{tx.amount}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${tx.type === 'Credit'
                                            ? 'bg-green-500/20 text-green-400 border-green-500/20'
                                            : 'bg-red-500/20 text-red-400 border-red-500/20'
                                        }`}>
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {tx.reason}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400">
                                    {tx.date}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CoinTransactions;
