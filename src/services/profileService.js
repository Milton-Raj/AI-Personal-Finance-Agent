import { API_URL } from '../config';

export const profileService = {
    getProfile: async () => {
        try {
            const response = await fetch(`${API_URL}/profile`);
            if (!response.ok) throw new Error('Failed to fetch profile');
            return await response.json();
        } catch (error) {
            console.error('getProfile error:', error);
            throw error;
        }
    },

    updateProfile: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) throw new Error('Failed to update profile');
            return await response.json();
        } catch (error) {
            console.error('updateProfile error:', error);
            throw error;
        }
    },

    uploadProfileImage: async (imageUri) => {
        // In a real app, you'd use FormData to upload the file.
        // For this mock backend, we're just sending the URI string.
        try {
            const response = await fetch(`${API_URL}/profile/image?image_url=${encodeURIComponent(imageUri)}`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to upload image');
            return await response.json();
        } catch (error) {
            console.error('uploadProfileImage error:', error);
            throw error;
        }
    },

    getPaymentMethods: async () => {
        try {
            const response = await fetch(`${API_URL}/payment-methods`);
            if (!response.ok) throw new Error('Failed to fetch payment methods');
            return await response.json();
        } catch (error) {
            console.error('getPaymentMethods error:', error);
            throw error;
        }
    },

    addPaymentMethod: async (paymentMethod) => {
        try {
            const response = await fetch(`${API_URL}/payment-methods`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentMethod),
            });
            if (!response.ok) throw new Error('Failed to add payment method');
            return await response.json();
        } catch (error) {
            console.error('addPaymentMethod error:', error);
            throw error;
        }
    },

    deletePaymentMethod: async (id) => {
        try {
            const response = await fetch(`${API_URL}/payment-methods/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete payment method');
            return await response.json();
        } catch (error) {
            console.error('deletePaymentMethod error:', error);
            throw error;
        }
    },

    upgradeMembership: async () => {
        try {
            const response = await fetch(`${API_URL}/profile/upgrade-membership`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to upgrade membership');
            return await response.json();
        } catch (error) {
            console.error('upgradeMembership error:', error);
            throw error;
        }
    }
};
