import { ApiConfig, EnterpriseSettings } from '../config/api';
import { StorageService } from '../utils/storage';

export interface AttendanceData {
  UserID: string;
  UserName: string;
  short_name: string;
  integration_reference: string;
  PROCESSDATE: string;
  PUNCH1_TIME?: string;
  PUNCH2_TIME?: string;
  PUNCH3_TIME?: string;
  PUNCH4_TIME?: string;
  PUNCH5_TIME?: string;
  PUNCH6_TIME?: string;
  PUNCH7_TIME?: string;
  PUNCH8_TIME?: string;
  PUNCH9_TIME?: string;
  PUNCH10_TIME?: string;
  PUNCH11_TIME?: string;
  PUNCH12_TIME?: string;
  SCHEDULESHIFT: string;
  WORKINGSHIFT: string;
  EARLYIN: string;
  EARLYIN_HHMM: string;
  LATEIN: string;
  LATEIN_HHMM: string;
  EARLYOUT: string;
  EARLYOUT_HHMM: string;
  OVERSTAY: string;
  OVERSTAY_HHMM: string;
  OVERTIME: string;
  OVERTIME_HHMM: string;
  WORKTIME: string;
  'Working Time': string;
  FIRSTHALF: string;
  SECONDHALF: string;
  SHIFTSTART: string;
  SHIFTEND: string;
  LUNCHSTART: string;
  LUNCHEND: string;
  OUTPUNCH: string;
  OUTPUNCH_DATE: string;
  OUTPUNCH_TIME: string;
  DAYSTATUS: string;
  NETWORKHRS: string;
  ADJUSTEDHRS: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class EnterpriseApiService {
  private config: ApiConfig;
  private settings: EnterpriseSettings | null = null;

  constructor(config?: ApiConfig) {
    this.config = config || this.getStoredConfig();
  }

  private getStoredConfig(): ApiConfig {
    // This would typically load from storage
    return {
      baseUrl: 'https://ctoadmin.itiltd.in/cams/api',
      endpoints: {
        attendance: '/attendance_daily3.php/attendance-daily',
        leaves: '/leaves.php/leaves',
        reimbursements: '/reimbursements.php/reimbursements',
        employees: '/employees.php/employees',
        settings: '/settings.php/settings',
      },
    };
  }

  async initialize(baseUrl: string, authConfig?: any): Promise<boolean> {
    try {
      this.config.baseUrl = baseUrl;
      
      // Store configuration
      await StorageService.setItem('api_config', this.config);
      
      // Test connection and load settings
      const settingsResponse = await this.getEnterpriseSettings();
      if (settingsResponse.success) {
        this.settings = settingsResponse.data!;
        await StorageService.setItem('enterprise_settings', this.settings);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to initialize API:', error);
      return false;
    }
  }

  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    const baseEndpoint = this.config.endpoints[endpoint as keyof typeof this.config.endpoints] || endpoint;
    const url = new URL(baseEndpoint, this.config.baseUrl);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
    
    return url.toString();
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers as Record<string, string>,
      };

      // Add authentication if configured
      if (this.config.authentication) {
        switch (this.config.authentication.type) {
          case 'bearer':
            headers['Authorization'] = `Bearer ${this.config.authentication.key}`;
            break;
          case 'api-key':
            headers['X-API-Key'] = this.config.authentication.key!;
            break;
        }
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Attendance API Methods
  async getAttendanceData(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<AttendanceData[]>> {
    const params = {
      action: 'get',
      'field-name': [
        'UserID', 'UserName', 'short_name', 'integration_reference',
        'PROCESSDATE as [PROCESSDATE]',
        'PUNCH1_TIME', 'PUNCH2_TIME', 'PUNCH3_TIME', 'PUNCH4_TIME',
        'PUNCH5_TIME', 'PUNCH6_TIME', 'PUNCH7_TIME', 'PUNCH8_TIME',
        'PUNCH9_TIME', 'PUNCH10_TIME', 'PUNCH11_TIME', 'PUNCH12_TIME',
        'SCHEDULESHIFT', 'WORKINGSHIFT',
        'EARLYIN', 'EARLYIN_HHMM', 'LATEIN', 'LATEIN_HHMM',
        'EARLYOUT', 'EARLYOUT_HHMM', 'OVERSTAY', 'OVERSTAY_HHMM',
        'OVERTIME', 'OVERTIME_HHMM as [OVERTIME_HHMM]',
        'WORKTIME', 'WORKTIME_HHMM as[Working Time]',
        'FIRSTHALF', 'SECONDHALF',
        'SHIFTSTART as [SHIFTSTART]', 'SHIFTEND as [SHIFTEND]',
        'LUNCHSTART', 'LUNCHEND',
        'OUTPUNCH', 'OUTPUNCH_DATE', 'OUTPUNCH_TIME',
        'DAYSTATUS', 'NETWORKHRS', 'ADJUSTEDHRS'
      ].join(','),
      'date-range': `${startDate}-${endDate}`,
      range: 'user',
      Id: userId,
    };

    const url = this.buildUrl('attendance', params);
    return this.request<AttendanceData[]>(url);
  }

  async markAttendance(
    userId: string,
    type: 'check-in' | 'check-out',
    location?: { latitude: number; longitude: number }
  ): Promise<ApiResponse<any>> {
    const params = {
      action: 'mark',
      userId,
      type,
      timestamp: new Date().toISOString(),
      ...(location && { latitude: location.latitude, longitude: location.longitude }),
    };

    const url = this.buildUrl('attendance', params);
    return this.request(url, { method: 'POST' });
  }

  // Leave Management
  async getLeaveHistory(userId: string): Promise<ApiResponse<any[]>> {
    const params = {
      action: 'get',
      userId,
      type: 'history',
    };

    const url = this.buildUrl('leaves', params);
    return this.request<any[]>(url);
  }

  async applyLeave(leaveData: any): Promise<ApiResponse<any>> {
    const params = {
      action: 'apply',
      ...leaveData,
    };

    const url = this.buildUrl('leaves', params);
    return this.request(url, { method: 'POST' });
  }

  async getLeaveBalance(userId: string): Promise<ApiResponse<any>> {
    const params = {
      action: 'balance',
      userId,
    };

    const url = this.buildUrl('leaves', params);
    return this.request(url);
  }

  // Reimbursements
  async getReimbursements(userId: string): Promise<ApiResponse<any[]>> {
    const params = {
      action: 'get',
      userId,
    };

    const url = this.buildUrl('reimbursements', params);
    return this.request<any[]>(url);
  }

  async submitReimbursement(reimbursementData: any): Promise<ApiResponse<any>> {
    const params = {
      action: 'submit',
      ...reimbursementData,
    };

    const url = this.buildUrl('reimbursements', params);
    return this.request(url, { method: 'POST' });
  }

  // Enterprise Settings
  async getEnterpriseSettings(): Promise<ApiResponse<EnterpriseSettings>> {
    const params = {
      action: 'get',
      type: 'enterprise',
    };

    const url = this.buildUrl('settings', params);
    return this.request<EnterpriseSettings>(url);
  }

  async updateEnterpriseSettings(settings: Partial<EnterpriseSettings>): Promise<ApiResponse<any>> {
    const params = {
      action: 'update',
      type: 'enterprise',
      ...settings,
    };

    const url = this.buildUrl('settings', params);
    return this.request(url, { method: 'POST' });
  }

  // Employee Management
  async getEmployees(): Promise<ApiResponse<any[]>> {
    const params = {
      action: 'get',
      type: 'all',
    };

    const url = this.buildUrl('employees', params);
    return this.request<any[]>(url);
  }

  async addEmployee(employeeData: any): Promise<ApiResponse<any>> {
    const params = {
      action: 'add',
      ...employeeData,
    };

    const url = this.buildUrl('employees', params);
    return this.request(url, { method: 'POST' });
  }

  // Real-time sync
  async syncData(): Promise<ApiResponse<any>> {
    try {
      const userId = await StorageService.getItem<string>('current_user_id');
      if (!userId) {
        return { success: false, error: 'User not authenticated' };
      }

      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const formatDate = (date: Date) => {
        return date.toISOString().slice(0, 10).replace(/-/g, '');
      };

      // Sync attendance data
      const attendanceResponse = await this.getAttendanceData(
        userId,
        formatDate(startDate),
        formatDate(endDate)
      );

      if (attendanceResponse.success) {
        await StorageService.setItem('attendance_data', attendanceResponse.data);
      }

      // Sync other data...
      const [leavesResponse, reimbursementsResponse] = await Promise.all([
        this.getLeaveHistory(userId),
        this.getReimbursements(userId),
      ]);

      if (leavesResponse.success) {
        await StorageService.setItem('leaves_data', leavesResponse.data);
      }

      if (reimbursementsResponse.success) {
        await StorageService.setItem('reimbursements_data', reimbursementsResponse.data);
      }

      return { success: true, data: 'Sync completed successfully' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      };
    }
  }

  // Configuration methods
  async testConnection(): Promise<ApiResponse<any>> {
    try {
      const url = this.buildUrl('settings', { action: 'ping' });
      const response = await fetch(url, { method: 'GET' });
      
      if (response.ok) {
        return { success: true, data: 'Connection successful' };
      } else {
        return { success: false, error: 'Connection failed' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
      };
    }
  }

  updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    StorageService.setItem('api_config', this.config);
  }

  getConfig(): ApiConfig {
    return this.config;
  }
}

export const enterpriseApi = new EnterpriseApiService();