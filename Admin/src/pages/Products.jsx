import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ShoppingBag, Image as ImageIcon, X } from 'lucide-react';

const Products = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [products, setProducts] = useState([
        { id: 1, name: 'Premium Theme Pack', description: 'Unlock all premium themes', coins: 500, image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80' },
        { id: 2, name: 'Ad-Free Experience', description: 'Remove all ads for 1 month', coins: 300, image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500&q=80' },
        { id: 3, name: 'Export to CSV', description: 'Unlock data export feature', coins: 100, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80' },
    ]);

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        coins: '',
        image: ''
    });

    const handleAddProduct = (e) => {
        e.preventDefault();
        const product = {
            id: products.length + 1,
            ...newProduct,
            coins: parseInt(newProduct.coins)
        };
        setProducts([...products, product]);
        setNewProduct({ name: '', description: '', coins: '', image: '' });
        setShowAddForm(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Products</h2>
                    <p className="text-gray-400">Manage products available for coin redemption</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Add Product Modal/Form Overlay */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#16213e] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Add New Product</h3>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                                    placeholder="e.g. Premium Theme"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    required
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 resize-none"
                                    rows="3"
                                    placeholder="Product details..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Coin Cost</label>
                                <input
                                    type="number"
                                    required
                                    value={newProduct.coins}
                                    onChange={(e) => setNewProduct({ ...newProduct, coins: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                                    placeholder="e.g. 500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        required
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold mt-2 transition-colors"
                            >
                                Create Product
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="glass-card rounded-2xl overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent opacity-60" />
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                                <div className="w-4 h-4 rounded-full bg-yellow-400" />
                                <span className="text-yellow-400 font-bold text-sm">{product.coins}</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2">
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder Card */}
                <button
                    onClick={() => setShowAddForm(true)}
                    className="border-2 border-dashed border-white/10 rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all group"
                >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-medium">Add New Product</span>
                </button>
            </div>
        </div>
    );
};

export default Products;
