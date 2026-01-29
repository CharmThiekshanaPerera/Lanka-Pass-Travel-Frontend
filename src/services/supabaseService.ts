import { api } from '../lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'vendor' | 'admin' | 'user' | 'manager';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', data.email);
    formData.append('password', data.password);

    const response = await api.post('/api/auth/login', formData);
    const { access_token, user } = response.data;

    if (access_token) {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', data);
    const { access_token, user } = response.data;

    if (access_token) {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return { success: true, user: response.data };
    } catch (error) {
      return { success: false, error: 'Invalid token' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh_token');
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  // Get auth headers
  getAuthHeaders: () => {
    const token = localStorage.getItem('access_token');
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};

// User management service
export const userService = {
  // Get all users (admin only)
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (id: string, data: Partial<User>) => {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id: string) => {
    await api.delete(`/api/users/${id}`);
  },
};

// Vendor specific services
export const vendorService = {
  // Get vendor dashboard data
  getDashboardData: async () => {
    const response = await api.get('/api/vendor/dashboard');
    return response.data;
  },

  // Get vendor profile
  getVendorProfile: async () => {
    const response = await api.get('/api/vendor/profile');
    return response.data;
  },

  // Update vendor profile
  updateVendorProfile: async (data: any) => {
    const response = await api.put('/api/vendor/profile', data);
    return response.data;
  },
};

// Admin specific services
export const adminService = {
  // Get admin dashboard data
  getDashboardData: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  // Get all vendors
  getVendors: async () => {
    const response = await api.get('/api/admin/vendors');
    return response.data;
  },

  // Approve/Reject vendor
  updateVendorStatus: async (vendorId: string, status: string) => {
    const response = await api.patch(`/api/admin/vendors/${vendorId}`, { status });
    return response.data;
  },
};