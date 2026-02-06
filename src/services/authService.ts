import { api } from '../lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
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
  }
};