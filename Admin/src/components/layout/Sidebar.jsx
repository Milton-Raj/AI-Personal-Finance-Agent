import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    PieChart,
    LogOut,
    Shield,
    Bell,
    DollarSign,
    ShoppingBag,
    ChevronDown,
    ChevronRight,
    Coins
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const [isCoinsOpen, setIsCoinsOpen] = useState(false);
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: CreditCard, label: 'Transactions', path: '/transactions' },
        { icon: ShoppingBag, label: 'Products', path: '/products' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const coinItems = [
        { icon: Shield, label: 'Coin Rules', path: '/coins/rules' },
        { icon: DollarSign, label: 'Coin Transactions', path: '/coins/transactions' },
    ];

    const isCoinRoute = location.pathname.startsWith('/coins');

    // Auto-open dropdown if on a coin route
    React.useEffect(() => {
        if (isCoinRoute) {
            setIsCoinsOpen(true);
        }
    }, [isCoinRoute]);

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass-panel flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight">Smart Spend</h1>
                    <p className="text-xs text-blue-300 font-medium">Admin Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            isActive
                                ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-white/10 shadow-lg shadow-blue-500/10"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={clsx(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-blue-400" : "text-gray-500 group-hover:text-white"
                                )} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Coins System Dropdown */}
                <div className="space-y-1">
                    <button
                        onClick={() => setIsCoinsOpen(!isCoinsOpen)}
                        className={clsx(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            isCoinRoute
                                ? "text-white bg-white/5"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Coins className={clsx(
                            "w-5 h-5 transition-colors",
                            isCoinRoute ? "text-yellow-400" : "text-gray-500 group-hover:text-white"
                        )} />
                        <span className="font-medium flex-1 text-left">Coins System</span>
                        {isCoinsOpen ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                    </button>

                    {isCoinsOpen && (
                        <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                            {coinItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => clsx(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-sm",
                                        isActive
                                            ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon className={clsx(
                                                "w-4 h-4 transition-colors",
                                                isActive ? "text-yellow-400" : "text-gray-500 group-hover:text-white"
                                            )} />
                                            <span className="font-medium">{item.label}</span>
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center">
                        <span className="font-bold text-sm">AD</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Admin User</p>
                        <p className="text-xs text-gray-400 truncate">admin@smartspend.com</p>
                    </div>
                    <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
