import React, { useEffect, useState } from 'react';
import { coinsService } from '../services/api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const CoinRules = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedRule, setSelectedRule] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        action_type: '',
        coins_awarded: ''
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const data = await coinsService.getRules();
            setRules(data);
        } catch (error) {
            console.error('Failed to fetch rules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setModalMode('create');
        setFormData({ name: '', description: '', action_type: '', coins_awarded: '' });
        setShowModal(true);
    };

    const handleEdit = (rule) => {
        setModalMode('edit');
        setSelectedRule(rule);
        setFormData({
            name: rule.name,
            description: rule.description,
            action_type: rule.action_type,
            coins_awarded: rule.coins_awarded
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                await coinsService.createRule(formData);
            } else {
                await coinsService.updateRule(selectedRule.id, formData);
            }
            setShowModal(false);
            fetchRules();
        } catch (error) {
            console.error('Failed to save rule:', error);
            alert('Failed to save rule');
        }
    };

    const handleDelete = async (ruleId) => {
        if (window.confirm('Are you sure you want to delete this rule?')) {
            try {
                await coinsService.deleteRule(ruleId);
                fetchRules();
            } catch (error) {
                console.error('Failed to delete rule:', error);
            }
        }
    };

    if (loading) return <div className="text-white">Loading rules...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Coin Rules</h2>
                    <p className="text-gray-400">Manage how users earn and spend coins</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Rule
                </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Rule Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Action Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Coins</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {rules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{rule.name}</div>
                                    <div className="text-xs text-gray-400">{rule.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20">
                                        {rule.action_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm font-bold ${rule.coins_awarded > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {rule.coins_awarded > 0 ? '+' : ''}{rule.coins_awarded}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${rule.is_active
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/20'
                                        }`}>
                                        {rule.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(rule)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(rule.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="glass-card rounded-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">
                                {modalMode === 'create' ? 'Create Coin Rule' : 'Edit Coin Rule'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Rule Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                    placeholder="e.g., Daily Login"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                    rows="2"
                                    placeholder="Describe when this rule applies"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Action Type</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.action_type}
                                    onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                    placeholder="e.g., login, signup, transaction"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Coins Awarded</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.coins_awarded}
                                    onChange={(e) => setFormData({ ...formData, coins_awarded: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                    placeholder="Positive for earn, negative for spend"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors"
                                >
                                    {modalMode === 'create' ? 'Create' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoinRules;
