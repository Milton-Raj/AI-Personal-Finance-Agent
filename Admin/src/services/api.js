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
    }
};

export default api;
