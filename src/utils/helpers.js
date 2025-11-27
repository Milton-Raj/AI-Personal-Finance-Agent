export const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return 'Today';
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return `${days} days ago`;
    } else {
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
};

export const getCategoryIcon = (category) => {
    const icons = {
        'Food & Dining': 'restaurant',
        'Transportation': 'car',
        'Shopping': 'cart',
        'Subscriptions': 'card',
        'Income': 'cash',
        'Entertainment': 'game-controller',
        'Health': 'fitness',
        'Bills': 'receipt',
    };
    return icons[category] || 'wallet';
};

export const getCategoryColor = (category) => {
    const colors = {
        'Food & Dining': '#FF6B6B',
        'Transportation': '#4ECDC4',
        'Shopping': '#FFD93D',
        'Subscriptions': '#6C5CE7',
        'Income': '#00E676',
        'Entertainment': '#A29BFE',
        'Health': '#FF3B30',
        'Bills': '#00D9FF',
    };
    return colors[category] || '#6E7191';
};
