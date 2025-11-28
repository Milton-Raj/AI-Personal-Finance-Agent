import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { adminService } from '../../services/api';

const alertTypeConfig = {
    success: {
        icon: CheckCircle,
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        textColor: 'text-green-400',
        iconColor: 'text-green-400'
    },
    warning: {
        icon: AlertCircle,
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        textColor: 'text-yellow-400',
        iconColor: 'text-yellow-400'
    },
    info: {
        icon: Info,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        textColor: 'text-blue-400',
        iconColor: 'text-blue-400'
    }
};

const SmartAlerts = ({ alerts, onDismiss }) => {
    const handleDismiss = async (alertId) => {
        try {
            await adminService.dismissAlert(alertId);
            if (onDismiss) onDismiss(alertId);
        } catch (error) {
            console.error('Failed to dismiss alert:', error);
        }
    };

    return (
        <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Smart Alerts & Insights</h3>

            <div className="space-y-3">
                {alerts && alerts.length > 0 ? (
                    alerts.map((alert) => {
                        const config = alertTypeConfig[alert.type] || alertTypeConfig.info;
                        const Icon = config.icon;

                        return (
                            <div
                                key={alert.id}
                                className={`p-4 rounded-xl border ${config.bgColor} ${config.borderColor} animate-in fade-in slide-in-from-left duration-300`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center border ${config.borderColor} shrink-0`}>
                                        <Icon className={`w-5 h-5 ${config.iconColor}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className={`text-sm font-bold ${config.textColor}`}>{alert.title}</h4>
                                            <button
                                                onClick={() => handleDismiss(alert.id)}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-300">{alert.message}</p>
                                        {alert.severity && (
                                            <div className="mt-2">
                                                <span className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                                                    {alert.severity.toUpperCase()} PRIORITY
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">All clear! No alerts at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartAlerts;
