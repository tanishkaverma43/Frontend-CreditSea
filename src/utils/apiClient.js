const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://backend-credit-sea.vercel.app/api' : 'http://localhost:5000/api');

class ApiClient {
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    console.log('Making API request to:', url, 'with config:', config);

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('API response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async getAllUsers() {
    return this.request('/auth/users');
  }

  async deleteUser(userId) {
    return this.request(`/auth/users/${userId}`, {
      method: 'DELETE'
    });
  }

  async submitLoanApplication(applicationData) {
    return this.request('/loans', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  }

  async getLoanApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/loans?${queryString}` : '/loans';
    return this.request(endpoint);
  }

  async getLoanApplicationById(id) {
    return this.request(`/loans/${id}`);
  }

  async verifyLoanApplication(id, action, rejectionReason = '') {
    return this.request(`/loans/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ action, rejectionReason })
    });
  }

  async approveLoanApplication(id, action, rejectionReason = '') {
    return this.request(`/loans/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ action, rejectionReason })
    });
  }

  async getDashboardStats() {
    return this.request('/loans/dashboard/stats');
  }

  async getUserLoanApplications() {
    return this.request('/loans/user');
  }
}

export const apiClient = new ApiClient();
