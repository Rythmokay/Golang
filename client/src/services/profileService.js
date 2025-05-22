const API_URL = 'http://localhost:8081/api';

export const profileService = {
    // Get user profile
    getProfile: async (userId) => {
        try {
            console.log('Fetching profile for user ID:', userId);
            const token = localStorage.getItem('token');
            
            // Use a timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(`${API_URL}/profile?user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log('Profile fetch response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Profile fetch error:', response.status, errorText);
                throw new Error(`Failed to fetch profile: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Profile data received:', data);
            return data;
        } catch (error) {
            console.error('Profile fetch error:', error);
            throw error;
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const token = localStorage.getItem('token');
        try {
            console.log('Sending profile update request:', profileData);
            
            // Use a timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(`${API_URL}/profile/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Profile update failed:', response.status, errorText);
                throw new Error(`Failed to update profile: ${response.status}`);
            }
            
            return response.json();
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    },
};
