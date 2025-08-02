export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joiningDate: string;
  manager: string;
  location: string;
  role: 'employee' | 'admin' | 'hr';
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'holiday' | 'leave';
  workHours?: string;
  location?: string;
  notes?: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
  attachments?: string[];
}

export interface LeaveBalance {
  employeeId: string;
  annualLeave: number;
  sickLeave: number;
  personalLeave: number;
  maternityLeave?: number;
  paternityLeave?: number;
  carryForward?: number;
}

export interface Reimbursement {
  id: string;
  employeeId: string;
  category: string;
  amount: number;
  description: string;
  expenseDate: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  receipts: string[];
  comments?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdDate: string;
  expiryDate?: string;
  targetDepartments?: string[];
  isActive: boolean;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'religious' | 'company';
  isOptional: boolean;
}

export interface NotificationSettings {
  leaveApprovals: boolean;
  attendanceReminders: boolean;
  policyUpdates: boolean;
  announcements: boolean;
  reimbursementUpdates: boolean;
}

export interface AppSettings {
  allowedLeaveTypes: string[];
  reimbursementCategories: string[];
  workingHours: {
    startTime: string;
    endTime: string;
    breakDuration: number;
  };
  latePolicy: {
    graceMinutes: number;
    maxLatePerMonth: number;
  };
  geofencing: {
    enabled: boolean;
    radius: number;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  biometricSync: {
    enabled: boolean;
    syncInterval: number;
  };
}