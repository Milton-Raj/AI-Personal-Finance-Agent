import React, { useState } from 'react';
import { Send, Calendar, Users, Clock } from 'lucide-react';

const Notifications = () => {
    const [target, setTarget] = useState('all');
    const [schedule, setSchedule] = useState('now');

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Push Notifications</h2>
                <p className="text-gray-400">Send updates and offers to your users</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Compose Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-6 rounded-2xl space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Target Audience</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['all', 'premium', 'free'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setTarget(type)}
                                        className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${target === type
                                                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {type} Users
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Notification Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Special Offer Inside! 🎉"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Message Body</label>
                            <textarea
                                rows={4}
                                placeholder="Write your message here..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Scheduling</label>
                            <div className="flex gap-4 mb-4">
                                <button
                                    onClick={() => setSchedule('now')}
                                    className={`flex-1 p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${schedule === 'now'
                                            ? 'bg-green-600/20 border-green-500 text-green-400'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <Send className="w-4 h-4" />
                                    Send Now
                                </button>
                                <button
                                    onClick={() => setSchedule('later')}
                                    className={`flex-1 p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${schedule === 'later'
                                            ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <Calendar className="w-4 h-4" />
                                    Schedule for Later
                                </button>
                            </div>

                            {schedule === 'later' && (
                                <div className="flex gap-4 animate-in fade-in slide-in-from-top-2">
                                    <input
                                        type="date"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                    />
                                    <input
                                        type="time"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                                    />
                                </div>
                            )}
                        </div>

                        <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl text-white font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2">
                            <Send className="w-5 h-5" />
                            {schedule === 'now' ? 'Send Notification' : 'Schedule Notification'}
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-1">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Preview</h3>
                    <div className="bg-black border border-gray-800 rounded-[2rem] p-4 aspect-[9/19] relative overflow-hidden shadow-2xl">
                        {/* Phone Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>

                        {/* Status Bar */}
                        <div className="flex justify-between items-center px-4 pt-2 mb-8 text-[10px] text-white font-medium">
                            <span>9:41</span>
                            <div className="flex gap-1">
                                <span>Signal</span>
                                <span>Wifi</span>
                                <span>Bat</span>
                            </div>
                        </div>

                        {/* Notification Card */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 mb-4 border border-white/10 animate-in slide-in-from-top-4 duration-700">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                                    <span className="text-white font-bold text-xs">SS</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h4 className="text-white text-sm font-semibold truncate">Smart Spend</h4>
                                        <span className="text-[10px] text-gray-400">now</span>
                                    </div>
                                    <p className="text-white text-xs font-medium mb-0.5">Special Offer Inside! 🎉</p>
                                    <p className="text-gray-400 text-xs line-clamp-2">Check out our latest premium features available at a discount...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
