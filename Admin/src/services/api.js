import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },
    getTransactions: async () => {
        const response = await api.get('/admin/transactions');
        return response.data;
    },
    getRevenueChart: async () => {
        const response = await api.get('/admin/revenue-chart');
        return response.data;
    },
    // Premium Dashboard Features
    getActivityFeed: async (limit = 50) => {
        const response = await api.get(`/admin/activity-feed?limit=${limit}`);
        return response.data;
    },
    getTopPerformers: async () => {
        const response = await api.get('/admin/top-performers');
        return response.data;
    },
    getAlerts: async () => {
        const response = await api.get('/admin/alerts');
        return response.data;
    },
    dismissAlert: async (alertId) => {
        const response = await api.post(`/admin/alerts/${alertId}/dismiss`);
        return response.data;
    },
    getRevenueBreakdown: async () => {
        const response = await api.get('/admin/revenue-breakdown');
        return response.data;
    },
    getQuickStats: async () => {
        const response = await api.get('/admin/quick-stats');
        return response.data;
    },
    // Analytics Page
    getAnalyticsForecast: async () => {
        const response = await api.get('/admin/analytics/forecast');
        return response.data;
    },
    getCohortAnalysis: async () => {
        const response = await api.get('/admin/analytics/cohorts');
        return response.data;
    },
    getGoals: async () => {
        const response = await api.get('/admin/analytics/goals');
        return response.data;
    },
    createGoal: async (goalData) => {
        const response = await api.post('/admin/analytics/goals', goalData);
        return response.data;
    },
    // User CRUD
    createUser: async (userData) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },
    getUserDetail: async (userId) => {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },
    updateUser: async (userId, userData) => {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
    },
    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },
};

// Coins Service
export const coinsService = {
    getRules: async () => {
        const response = await api.get('/coins/rules');
        return response.data;
    },
    createRule: async (ruleData) => {
        const response = await api.post('/coins/rules', ruleData);
        return response.data;
    },
    updateRule: async (ruleId, ruleData) => {
        const response = await api.put(`/coins/rules/${ruleId}`, ruleData);
        return response.data;
    },
    deleteRule: async (ruleId) => {
        const response = await api.delete(`/coins/rules/${ruleId}`);
        return response.data;
    },
    getTransactions: async (userId = null) => {
        const url = userId ? `/coins/transactions?user_id=${userId}` : '/coins/transactions';
        const response = await api.get(url);
        return response.data;
    },
    createTransaction: async (transactionData) => {
        const response = await api.post('/coins/transactions', transactionData);
        return response.data;
    },
    getUserBalance: async (userId) => {
        const response = await api.get(`/coins/balance/${userId}`);
        return response.data;
    },
};

// Notifications Service
export const notificationsService = {
    getAll: async (userId = null) => {
        const url = userId ? `/notifications?user_id=${userId}` : '/notifications';
        const response = await api.get(url);
        return response.data;
    },
    getDetail: async (notificationId) => {
        const response = await api.get(`/notifications/${notificationId}`);
        return response.data;
    },
    create: async (notificationData) => {
        const response = await api.post('/notifications', notificationData);
        return response.data;
    },
    markAsRead: async (notificationId) => {
        const response = await api.put(`/notifications/${notificationId}/read`);
        return response.data;
    },
    delete: async (notificationId) => {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    },
};

export default api;
