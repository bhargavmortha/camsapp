import { StorageService } from '../utils/storage';

export interface PunchData {
  UserID: string;
  UserName: string;
  short_name: string;
  integration_reference: string;
  PROCESSDATE: string;
  PUNCH1_TIME: string;
  PUNCH2_TIME: string;
  PUNCH3_TIME: string;
  PUNCH4_TIME: string;
  PUNCH5_TIME: string;
  PUNCH6_TIME: string;
  PUNCH7_TIME: string;
  PUNCH8_TIME: string;
  PUNCH9_TIME: string;
  PUNCH10_TIME: string;
  PUNCH11_TIME: string;
  PUNCH12_TIME: string;
  SCHEDULESHIFT: string;
  WorkingShift: string;
  EARLYIN: string;
  EARLYIN_HHMM: string;
  LateIn: string;
  LATEIN_HHMM: string;
  EarlyOut: string;
  EARLYOUT_HHMM: string;
  OVERSTAY: string;
  OVERSTAY_HHMM: string;
  Overtime: string;
  OVERTIME_HHMM: string;
  WorkTime: string;
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
}

export interface EmployeeCredentials {
  employeeId: string;
  password: string;
}

export interface EmployeeSession {
  userId: string;
  employeeName: string;
  loginTime: string;
}

export class CAMSApiService {
  private baseUrl = 'https://ctoadmin.itiltd.in/cams/api';
  private currentSession: EmployeeSession | null = null;

  // Parse pipe-delimited response data
  private parseApiResponse(responseText: string): PunchData[] {
    const lines = responseText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split('|');
    const dataLines = lines.slice(1);

    return dataLines.map(line => {
      const values = line.split('|');
      const record: any = {};
      
      headers.forEach((header, index) => {
        record[header.trim()] = values[index] || '';
      });
      
      return record as PunchData;
    });
  }

  // Employee authentication
  async authenticateEmployee(credentials: EmployeeCredentials): Promise<ApiResponse<EmployeeSession>> {
    try {
      // For demo purposes, we'll simulate authentication
      // In a real implementation, this would call an authentication endpoint
      const mockUsers = [
        { id: '61008', name: 'MORTHA BHARGAV', password: 'demo123' },
        { id: '61009', name: 'JOHN DOE', password: 'demo123' },
        { id: '61010', name: 'JANE SMITH', password: 'demo123' },
      ];

      const user = mockUsers.find(u => 
        u.id === credentials.employeeId && u.password === credentials.password
      );

      if (!user) {
        return {
          success: false,
          error: 'Invalid employee ID or password'
        };
      }

      const session: EmployeeSession = {
        userId: user.id,
        employeeName: user.name,
        loginTime: new Date().toISOString(),
      };

      this.currentSession = session;
      await StorageService.setItem('employee_session', session);

      return {
        success: true,
        data: session,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  // Get current session
  async getCurrentSession(): Promise<EmployeeSession | null> {
    if (this.currentSession) {
      return this.currentSession;
    }

    const storedSession = await StorageService.getItem<EmployeeSession>('employee_session');
    if (storedSession) {
      this.currentSession = storedSession;
      return storedSession;
    }

    return null;
  }

  // Logout
  async logout(): Promise<void> {
    this.currentSession = null;
    await StorageService.removeItem('employee_session');
  }

  // Fetch attendance data for specific employee
  async getEmployeeAttendanceData(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<PunchData[]>> {
    try {
      const url = new URL(`${this.baseUrl}/attendance_daily3.php/attendance-daily`);
      
      const params = {
        action: 'get',
        'field-name': [
          'UserID', 'UserName', 'short_name', 'integration_reference',
          'PROCESSDATE as [PROCESSDATE]',
          'PUNCH1_TIME', 'PUNCH2_TIME', 'PUNCH3_TIME', 'PUNCH4_TIME',
          'PUNCH5_TIME', 'PUNCH6_TIME', 'PUNCH7_TIME', 'PUNCH8_TIME',
          'PUNCH9_TIME', 'PUNCH10_TIME', 'PUNCH11_TIME', 'PUNCH12_TIME',
          'SCHEDULESHIFT', 'WORKINGSHIFT as [WorkingShift]',
          'EARLYIN', 'EARLYIN_HHMM', 'LATEIN as [LateIn]', 'LATEIN_HHMM',
          'EARLYOUT as [EarlyOut]', 'EARLYOUT_HHMM', 'OVERSTAY', 'OVERSTAY_HHMM',
          'OVERTIME as [Overtime]', 'OVERTIME_HHMM', 'WORKTIME as [WorkTime]',
          'WORKTIME_HHMM as [Working Time]', 'FIRSTHALF', 'SECONDHALF',
          'SHIFTSTART', 'SHIFTEND', 'LUNCHSTART', 'LUNCHEND',
          'OUTPUNCH', 'OUTPUNCH_DATE', 'OUTPUNCH_TIME',
          'DAYSTATUS', 'NETWORKHRS', 'ADJUSTEDHRS'
        ].join(','),
        'date-range': `${startDate}-${endDate}`,
        range: 'user',
        Id: userId,
      };

      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      const data = this.parseApiResponse(responseText);

      // Cache the data
      await StorageService.setItem(`punch_data_${userId}`, data);

      return {
        success: true,
        data,
      };
    } catch (error) {
      // Try to load cached data on error
      const cachedData = await StorageService.getItem<PunchData[]>(`punch_data_${userId}`);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attendance data',
        data: cachedData || [],
      };
    }
  }

  // Get today's punch data
  async getTodaysPunchData(userId: string): Promise<ApiResponse<PunchData | null>> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    const response = await this.getEmployeeAttendanceData(userId, dateStr, dateStr);
    
    if (response.success && response.data && response.data.length > 0) {
      return {
        success: true,
        data: response.data[0],
      };
    }

    return {
      success: response.success,
      error: response.error,
      data: null,
    };
  }

  // Get punch history for current month
  async getCurrentMonthPunchData(userId: string): Promise<ApiResponse<PunchData[]>> {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString().slice(0, 10).replace(/-/g, '');
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString().slice(0, 10).replace(/-/g, '');

    return this.getEmployeeAttendanceData(userId, startDate, endDate);
  }

  // Test API connection
  async testConnection(): Promise<ApiResponse<string>> {
    try {
      const url = new URL(`${this.baseUrl}/attendance_daily3.php/attendance-daily`);
      url.searchParams.append('action', 'get');
      url.searchParams.append('field-name', 'UserID');
      url.searchParams.append('date-range', '01012025-01012025');
      url.searchParams.append('range', 'user');
      url.searchParams.append('Id', '61008');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });

      if (response.ok) {
        return {
          success: true,
          data: 'Connection successful',
        };
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
      };
    }
  }
}

export const camsApi = new CAMSApiService();