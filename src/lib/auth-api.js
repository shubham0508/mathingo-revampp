import { API_BASE_URL } from '@/config/constant';

const handleApiResponse = async (
  response,
  defaultErrorMessage = 'Request failed',
) => {
  if (!response.ok) {
    let errorMessage = defaultErrorMessage;
    try {
      const error = await response.json();
      errorMessage = error.message || error.detail || error.error[0] || errorMessage;
    } catch (parseError) {
      console.warn('Failed to parse error response:', parseError);
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

const authApi = {
  login: async (data) => {
    try {
      const formData = new URLSearchParams({
        username: data.username,
        password: data.password,
        grant_type: 'password',
      });

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      return await handleApiResponse(response, 'Login failed');
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  signup: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await handleApiResponse(response, 'Signup failed');
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },

  logout: async (accessToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return await handleApiResponse(response, 'Logout failed');
    } catch (error) {
      console.error('Logout API error:', error);
      throw error;
    }
  },

  googleOAuth: async (idToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/google_user_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: idToken, // Note: This might need to be id_token depending on your backend
        }),
      });

      return await handleApiResponse(response, 'Google OAuth failed');
    } catch (error) {
      console.error('Google OAuth API error:', error);
      throw error;
    }
  },

  profile: async (accessToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return await handleApiResponse(response, 'Failed to fetch profile');
    } catch (error) {
      console.error('Profile API error:', error);
      throw error;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const formData = new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });

      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      return await handleApiResponse(response, 'Token refresh failed');
    } catch (error) {
      console.error('Refresh token API error:', error);
      throw error;
    }
  },

  sendEmail: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await handleApiResponse(response, 'Failed to send email');
    } catch (error) {
      console.error('Send email API error:', error);
      throw error;
    }
  },

  verifyOTP: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await handleApiResponse(response, 'OTP verification failed');
    } catch (error) {
      console.error('Verify OTP API error:', error);
      throw error;
    }
  },

  createUser: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await handleApiResponse(response, 'User creation failed');
    } catch (error) {
      console.error('Create user API error:', error);
      throw error;
    }
  },

  forgotPassword: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await handleApiResponse(response, 'Password reset request failed');
    } catch (error) {
      console.error('Forgot password API error:', error);
      throw error;
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return await handleApiResponse(response, 'Password reset failed');
    } catch (error) {
      console.error('Reset password API error:', error);
      throw error;
    }
  },

  guestUserLogin: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleApiResponse(response, 'Guest login failed');
    } catch (error) {
      console.error('Guest login API error:', error);
      throw error;
    }
  },
};

export default authApi;
