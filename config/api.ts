export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    attendance: string;
    leaves: string;
    reimbursements: string;
    employees: string;
    settings: string;
  };
  authentication?: {
    type: 'bearer' | 'basic' | 'api-key';
    key?: string;
  };
}

export interface AppModuleConfig {
  id: string;
  name: string;
  enabled: boolean;
  icon: string;
  route: string;
  permissions: string[];
}

export interface EnterpriseSettings {
  companyName: string;
  logo?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  modules: AppModuleConfig[];
  features: {
    geofencing: boolean;
    biometricSync: boolean;
    realTimeSync: boolean;
    offlineMode: boolean;
  };
  workingHours: {
    startTime: string;
    endTime: string;
    breakDuration: number;
  };
  policies: {
    lateGraceMinutes: number;
    maxLatePerMonth: number;
    autoCheckOut: boolean;
  };
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'https://ctoadmin.itiltd.in/cams/api',
  endpoints: {
    attendance: '/attendance_daily3.php/attendance-daily',
    leaves: '/leaves.php/leaves',
    reimbursements: '/reimbursements.php/reimbursements',
    employees: '/employees.php/employees',
    settings: '/settings.php/settings',
  },
};

export const DEFAULT_MODULES: AppModuleConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    enabled: true,
    icon: 'home',
    route: '/(tabs)/index',
    permissions: ['read:dashboard'],
  },
  {
    id: 'attendance',
    name: 'Attendance',
    enabled: true,
    icon: 'clock',
    route: '/(tabs)/attendance',
    permissions: ['read:attendance', 'write:attendance'],
  },
  {
    id: 'leaves',
    name: 'Leaves',
    enabled: true,
    icon: 'calendar',
    route: '/(tabs)/leaves',
    permissions: ['read:leaves', 'write:leaves'],
  },
  {
    id: 'reimbursements',
    name: 'Reimbursements',
    enabled: true,
    icon: 'receipt',
    route: '/(tabs)/reimbursements',
    permissions: ['read:reimbursements', 'write:reimbursements'],
  },
  {
    id: 'profile',
    name: 'Profile',
    enabled: true,
    icon: 'user',
    route: '/(tabs)/profile',
    permissions: ['read:profile', 'write:profile'],
  },
  {
    id: 'admin',
    name: 'Admin',
    enabled: false,
    icon: 'settings',
    route: '/(tabs)/admin',
    permissions: ['admin:all'],
  },
];