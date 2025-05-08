import { API_BASE_URL } from '@/config/constant';

const authApi = {
  fetchGuestToken: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Guest login failed');
      }

      return response.json();
    } catch (error) {
      console.error('Failed to fetch guest token:', error);
      throw error;
    }
  },
};

export default authApi;
