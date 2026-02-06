import { api } from '../lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  requires_password_reset?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  register: async (email: string, password: string, name: string, role: string = 'user'): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/vendor/register', {
      email,
      password,
      contactPerson: name,
      role,
      // Default placeholder fields for quick registration if needed
      businessName: `${name}'s Business`,
      vendorType: 'Other',
      businessAddress: 'Not provided',
      operatingAreas: [],
      bankName: 'Not provided',
      accountHolderName: name,
      accountNumber: '0000',
      bankBranch: 'Main',
      acceptTerms: true,
      acceptCommission: true,
      acceptCancellation: true,
      grantRights: true,
      confirmAccuracy: true,
      marketingPermission: true
    });

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  changePassword: async (password: string, currentPassword: string): Promise<any> => {
    const response = await api.post('/api/auth/change-password', {
      password,
      current_password: currentPassword
    });

    // Update local user data if needed
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.requires_password_reset = false;
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  },

  forgotPassword: async (email: string): Promise<any> => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  sendOtp: async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/api/auth/send-otp', { phoneNumber });
    return response.data;
  },

  verifyOtp: async (phoneNumber: string, otpCode: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/api/auth/verify-otp', { phoneNumber, otpCode });
    return response.data;
  }
};
