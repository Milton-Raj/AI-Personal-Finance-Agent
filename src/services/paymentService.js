import { API_URL } from '../config';

export const paymentService = {
    initiatePayment: async () => {
        try {
            const response = await fetch(`${API_URL}/payment/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to initiate payment');
            return await response.json();
        } catch (error) {
            console.error('initiatePayment error:', error);
            throw error;
        }
    },

    verifyPayment: async (paymentData) => {
        try {
            const response = await fetch(`${API_URL}/payment/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });
            if (!response.ok) throw new Error('Failed to verify payment');
            return await response.json();
        } catch (error) {
            console.error('verifyPayment error:', error);
            throw error;
        }
    },

    getPremiumStatus: async () => {
        try {
            const response = await fetch(`${API_URL}/profile/premium-status`);
            if (!response.ok) throw new Error('Failed to get premium status');
            return await response.json();
        } catch (error) {
            console.error('getPremiumStatus error:', error);
            throw error;
        }
    },
};
