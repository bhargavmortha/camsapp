interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.example.com') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Attendance
  async markAttendance(type: 'check-in' | 'check-out', location?: string) {
    return this.request('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({ type, location }),
    });
  }

  async getAttendanceHistory(month?: string, year?: number) {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year.toString());
    
    return this.request(`/attendance/history?${params.toString()}`);
  }

  // Leaves
  async applyLeave(leaveData: any) {
    return this.request('/leaves/apply', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  }

  async getLeaveHistory() {
    return this.request('/leaves/history');
  }

  async getLeaveBalance() {
    return this.request('/leaves/balance');
  }

  // Reimbursements
  async submitReimbursement(reimbursementData: any) {
    return this.request('/reimbursements/submit', {
      method: 'POST',
      body: JSON.stringify(reimbursementData),
    });
  }

  async getReimbursementHistory() {
    return this.request('/reimbursements/history');
  }

  // Profile
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Admin
  async getEmployees() {
    return this.request('/admin/employees');
  }

  async addEmployee(employeeData: any) {
    return this.request('/admin/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(id: string, employeeData: any) {
    return this.request(`/admin/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(id: string) {
    return this.request(`/admin/employees/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();