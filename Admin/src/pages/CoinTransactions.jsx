import React, { useEffect, useState } from 'react';
import { coinsService } from '../services/api';
import { Coins, TrendingUp, TrendingDown, Filter } from 'lucide-react';

const CoinTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterUserId, setFilterUserId] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async (userId = null) => {
        try {
            const data = await coinsService.getTransactions(userId);
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        const userId = filterUserId ? parseInt(filterUserId) : null;
        fetchTransactions(userId);
    };

    const handleClearFilter = () => {
        setFilterUserId('');
        fetchTransactions(null);
    };

    if (loading) return <div className="text-white">Loading transactions...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Coin Transactions</h2>
                    <p className="text-gray-400">Track all coin movements across users</p>
                </div>
            </div>

            {/* Filter */}
            <div className="glass-card rounded-2xl p-4 mb-6">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Filter by User ID</label>
                        <input
                            type="number"
                            value={filterUserId}
                            onChange={(e) => setFilterUserId(e.target.value)}
                            placeholder="Enter user ID"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        />
                    </div>
                    <button
                        onClick={handleFilter}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        Apply Filter
                    </button>
                    {filterUserId && (
                        <button
                            onClick={handleClearFilter}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    #{tx.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                                            {tx.user_id}
                                        </div>
                                        <span className="ml-2 text-sm text-white">User #{tx.user_id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`flex items-center text-sm font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {tx.amount > 0 ? (
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 mr-1" />
                                        )}
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${tx.amount > 0
                                            ? 'bg-green-500/20 text-green-400 border-green-500/20'
                                            : 'bg-red-500/20 text-red-400 border-red-500/20'
                                        }`}>
                                        {tx.transaction_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-300 max-w-xs truncate">
                                        {tx.description}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {new Date(tx.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        No transactions found
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoinTransactions;
