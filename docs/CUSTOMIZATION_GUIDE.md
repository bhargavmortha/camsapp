# CAMS Enterprise Customization Guide

## Overview

This guide explains how to customize the CAMS Enterprise application to match your organization's branding, workflow, and specific requirements.

## Theme Customization

### 1. Color Scheme

Update the color system in `constants/Colors.ts`:

```typescript
export const Colors = {
  // Your brand primary colors
  primary: {
    50: '#F0F9FF',   // Very light blue
    100: '#E0F2FE',  // Light blue
    200: '#BAE6FD',  // Lighter blue
    300: '#7DD3FC',  // Light blue
    400: '#38BDF8',  // Medium blue
    500: '#0EA5E9',  // Your primary blue
    600: '#0284C7',  // Darker blue
    700: '#0369A1',  // Dark blue
    800: '#075985',  // Very dark blue
    900: '#0C4A6E',  // Darkest blue
  },
  
  // Custom brand colors
  brand: {
    primary: '#YOUR_PRIMARY_COLOR',
    secondary: '#YOUR_SECONDARY_COLOR',
    accent: '#YOUR_ACCENT_COLOR',
  },
};
```

### 2. Typography

Customize fonts by updating the font loading in `app/_layout.tsx`:

```typescript
import { 
  YourCustomFont_400Regular,
  YourCustomFont_500Medium,
  YourCustomFont_600SemiBold,
  YourCustomFont_700Bold 
} from '@expo-google-fonts/your-custom-font';

const [fontsLoaded] = useFonts({
  'CustomFont-Regular': YourCustomFont_400Regular,
  'CustomFont-Medium': YourCustomFont_500Medium,
  'CustomFont-SemiBold': YourCustomFont_600SemiBold,
  'CustomFont-Bold': YourCustomFont_700Bold,
});
```

### 3. Logo and Branding

Replace default branding elements:

1. **App Icon**: Replace `assets/images/icon.png`
2. **Splash Screen**: Replace `assets/images/splash.png`
3. **Company Logo**: Add your logo to `assets/images/logo.png`

Update the authentication screen to use your logo:

```typescript
// In app/auth/index.tsx
<Image 
  source={require('../../assets/images/logo.png')}
  style={styles.logo}
  resizeMode="contain"
/>
```

## Module Configuration

### 1. Enable/Disable Modules

Configure which modules are available in your organization:

```typescript
// In config/api.ts
export const YOUR_COMPANY_MODULES: AppModuleConfig[] = [
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
    name: 'Time Tracking',
    enabled: true,
    icon: 'clock',
    route: '/(tabs)/attendance',
    permissions: ['read:attendance', 'write:attendance'],
  },
  {
    id: 'leaves',
    name: 'Time Off',
    enabled: true,
    icon: 'calendar',
    route: '/(tabs)/leaves',
    permissions: ['read:leaves', 'write:leaves'],
  },
  // Add custom modules
  {
    id: 'projects',
    name: 'Projects',
    enabled: true,
    icon: 'briefcase',
    route: '/(tabs)/projects',
    permissions: ['read:projects', 'write:projects'],
  },
];
```

### 2. Custom Module Creation

Create a new module by adding a new tab screen:

```typescript
// app/(tabs)/projects.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProjectsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projects</Text>
      {/* Your custom module content */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
});
```

## Workflow Customization

### 1. Attendance Policies

Configure attendance policies in your enterprise settings:

```typescript
interface AttendancePolicies {
  workingHours: {
    startTime: '09:00';
    endTime: '18:00';
    breakDuration: 60; // minutes
  };
  latePolicy: {
    graceMinutes: 15;
    maxLatePerMonth: 3;
    autoMarkAbsent: false;
  };
  overtimePolicy: {
    enabled: true;
    autoCalculate: true;
    requireApproval: false;
  };
}
```

### 2. Leave Types

Customize available leave types:

```typescript
const LEAVE_TYPES = [
  {
    id: 'annual',
    name: 'Annual Leave',
    maxDays: 25,
    carryForward: true,
    requiresApproval: true,
  },
  {
    id: 'sick',
    name: 'Sick Leave',
    maxDays: 10,
    carryForward: false,
    requiresApproval: false,
  },
  {
    id: 'maternity',
    name: 'Maternity Leave',
    maxDays: 180,
    carryForward: false,
    requiresApproval: true,
  },
  // Add your custom leave types
];
```

### 3. Approval Workflows

Configure approval hierarchies:

```typescript
interface ApprovalWorkflow {
  leaveApproval: {
    levels: [
      { role: 'manager', required: true },
      { role: 'hr', required: true, condition: 'days > 5' },
    ];
  };
  reimbursementApproval: {
    levels: [
      { role: 'manager', required: true, condition: 'amount > 100' },
      { role: 'finance', required: true, condition: 'amount > 500' },
    ];
  };
}
```

## UI/UX Customization

### 1. Dashboard Layout

Customize the dashboard layout:

```typescript
// Create custom dashboard widgets
const DASHBOARD_WIDGETS = [
  {
    id: 'attendance-summary',
    component: AttendanceSummaryWidget,
    size: 'large',
    position: { row: 1, col: 1 },
  },
  {
    id: 'leave-balance',
    component: LeaveBalanceWidget,
    size: 'medium',
    position: { row: 2, col: 1 },
  },
  {
    id: 'quick-actions',
    component: QuickActionsWidget,
    size: 'small',
    position: { row: 2, col: 2 },
  },
];
```

### 2. Custom Components

Create reusable custom components:

```typescript
// components/CustomCard.tsx
interface CustomCardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
}

export function CustomCard({ title, children, variant = 'default' }: CustomCardProps) {
  return (
    <View style={[styles.card, styles[variant]]}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}
```

### 3. Navigation Customization

Customize tab bar appearance:

```typescript
// In app/(tabs)/_layout.tsx
<Tabs
  screenOptions={{
    headerShown: false,
    tabBarStyle: {
      backgroundColor: '#YOUR_BRAND_COLOR',
      borderTopWidth: 0,
      height: 84,
      paddingBottom: 8,
      paddingTop: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    tabBarLabelStyle: {
      fontFamily: 'YourCustomFont-Medium',
      fontSize: 12,
      marginTop: 4,
    },
    tabBarActiveTintColor: '#YOUR_ACTIVE_COLOR',
    tabBarInactiveTintColor: '#YOUR_INACTIVE_COLOR',
  }}
>
```

## Data Field Customization

### 1. Custom Attendance Fields

Add custom fields to attendance tracking:

```typescript
interface CustomAttendanceData extends AttendanceData {
  // Add your custom fields
  projectCode?: string;
  taskCategory?: string;
  clientLocation?: string;
  workFromHome?: boolean;
  customField1?: string;
  customField2?: string;
}
```

### 2. Custom Leave Fields

Extend leave application with custom fields:

```typescript
interface CustomLeaveApplication {
  // Standard fields
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  
  // Custom fields
  emergencyContact?: string;
  coveringEmployee?: string;
  projectHandover?: string;
  clientNotification?: boolean;
}
```

## Integration Customization

### 1. Custom API Endpoints

Add support for additional API endpoints:

```typescript
// In services/enterpriseApi.ts
export class CustomEnterpriseApiService extends EnterpriseApiService {
  // Add custom methods
  async getProjectData(userId: string): Promise<ApiResponse<any[]>> {
    const params = {
      action: 'get',
      userId,
      type: 'projects',
    };

    const url = this.buildUrl('projects', params);
    return this.request<any[]>(url);
  }

  async submitTimesheet(timesheetData: any): Promise<ApiResponse<any>> {
    const params = {
      action: 'submit',
      ...timesheetData,
    };

    const url = this.buildUrl('timesheets', params);
    return this.request(url, { method: 'POST' });
  }
}
```

### 2. Third-party Integrations

#### Slack Integration
```typescript
// services/slackIntegration.ts
export class SlackIntegration {
  async sendAttendanceNotification(userId: string, action: string) {
    const webhook = process.env.EXPO_PUBLIC_SLACK_WEBHOOK;
    
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${userId} has ${action} at ${new Date().toLocaleTimeString()}`,
      }),
    });
  }
}
```

#### Microsoft Teams Integration
```typescript
// services/teamsIntegration.ts
export class TeamsIntegration {
  async sendLeaveNotification(leaveData: any) {
    const webhook = process.env.EXPO_PUBLIC_TEAMS_WEBHOOK;
    
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Leave Application',
        text: `${leaveData.employeeName} has applied for ${leaveData.type}`,
      }),
    });
  }
}
```

## Localization

### 1. Multi-language Support

Add internationalization:

```bash
npm install react-native-localize i18n-js
```

```typescript
// localization/index.ts
import { I18n } from 'i18n-js';
import * as Localization from 'react-native-localize';

const translations = {
  en: {
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    leaves: 'Leaves',
    profile: 'Profile',
  },
  es: {
    dashboard: 'Tablero',
    attendance: 'Asistencia',
    leaves: 'Permisos',
    profile: 'Perfil',
  },
  // Add more languages
};

const i18n = new I18n(translations);
i18n.locale = Localization.getLocales()[0].languageCode;
i18n.enableFallback = true;

export default i18n;
```

### 2. Date and Time Formats

Configure regional date/time formats:

```typescript
// utils/dateFormatter.ts
export const formatDate = (date: Date, locale: string = 'en-US') => {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date: Date, locale: string = 'en-US') => {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
```

## Role-Based Customization

### 1. User Roles

Define user roles and permissions:

```typescript
interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  moduleAccess: string[];
}

const USER_ROLES: UserRole[] = [
  {
    id: 'employee',
    name: 'Employee',
    permissions: ['read:own-data', 'write:own-attendance'],
    moduleAccess: ['dashboard', 'attendance', 'leaves', 'profile'],
  },
  {
    id: 'manager',
    name: 'Manager',
    permissions: ['read:team-data', 'approve:leaves', 'approve:reimbursements'],
    moduleAccess: ['dashboard', 'attendance', 'leaves', 'reimbursements', 'profile', 'team'],
  },
  {
    id: 'hr',
    name: 'HR',
    permissions: ['read:all-data', 'write:policies', 'manage:employees'],
    moduleAccess: ['dashboard', 'attendance', 'leaves', 'reimbursements', 'profile', 'admin'],
  },
  {
    id: 'admin',
    name: 'Administrator',
    permissions: ['admin:all'],
    moduleAccess: ['*'],
  },
];
```

### 2. Conditional UI

Show/hide features based on user role:

```typescript
// hooks/usePermissions.ts
export function usePermissions() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const hasPermission = (permission: string): boolean => {
    return userRole?.permissions.includes(permission) || 
           userRole?.permissions.includes('admin:all') || false;
  };

  const hasModuleAccess = (moduleId: string): boolean => {
    return userRole?.moduleAccess.includes(moduleId) || 
           userRole?.moduleAccess.includes('*') || false;
  };

  return { userRole, hasPermission, hasModuleAccess };
}
```

## Custom Business Logic

### 1. Attendance Rules

Implement custom attendance calculation logic:

```typescript
// utils/attendanceCalculator.ts
export class AttendanceCalculator {
  static calculateWorkingHours(
    checkIn: string,
    checkOut: string,
    breakDuration: number = 60
  ): number {
    const checkInTime = new Date(`2000-01-01 ${checkIn}`);
    const checkOutTime = new Date(`2000-01-01 ${checkOut}`);
    
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHours - (breakDuration / 60));
  }

  static calculateOvertime(
    workingHours: number,
    standardHours: number = 8
  ): number {
    return Math.max(0, workingHours - standardHours);
  }

  static isLate(
    checkInTime: string,
    shiftStart: string,
    graceMinutes: number = 15
  ): boolean {
    const checkIn = new Date(`2000-01-01 ${checkInTime}`);
    const shiftStartTime = new Date(`2000-01-01 ${shiftStart}`);
    
    const diffMs = checkIn.getTime() - shiftStartTime.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    
    return diffMinutes > graceMinutes;
  }
}
```

### 2. Leave Balance Calculation

Implement custom leave balance logic:

```typescript
// utils/leaveCalculator.ts
export class LeaveCalculator {
  static calculateAccruedLeaves(
    joiningDate: Date,
    leavePolicy: any
  ): number {
    const monthsWorked = this.getMonthsWorked(joiningDate);
    const annualEntitlement = leavePolicy.annualDays;
    
    return Math.floor((monthsWorked / 12) * annualEntitlement);
  }

  static getAvailableBalance(
    accruedLeaves: number,
    usedLeaves: number,
    carryForward: number = 0
  ): number {
    return accruedLeaves + carryForward - usedLeaves;
  }

  private static getMonthsWorked(joiningDate: Date): number {
    const now = new Date();
    const diffTime = now.getTime() - joiningDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
  }
}
```

## Notification Customization

### 1. Push Notifications

Configure custom push notifications:

```typescript
// services/notificationService.ts
export class NotificationService {
  static async scheduleAttendanceReminder() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Attendance Reminder',
        body: 'Don\'t forget to mark your attendance!',
        data: { type: 'attendance_reminder' },
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  }

  static async sendLeaveApprovalNotification(leaveData: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Leave Application Update',
        body: `Your ${leaveData.type} application has been ${leaveData.status}`,
        data: { type: 'leave_update', leaveId: leaveData.id },
      },
      trigger: null, // Send immediately
    });
  }
}
```

### 2. Email Notifications

Integrate email notifications:

```typescript
// services/emailService.ts
export class EmailService {
  static async sendAttendanceReport(
    email: string,
    reportData: any
  ) {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Monthly Attendance Report',
        template: 'attendance-report',
        data: reportData,
      }),
    });

    return response.json();
  }
}
```

## Reporting Customization

### 1. Custom Reports

Create custom report generators:

```typescript
// utils/reportGenerator.ts
export class ReportGenerator {
  static generateAttendanceReport(
    attendanceData: AttendanceData[],
    format: 'pdf' | 'excel' | 'csv'
  ) {
    switch (format) {
      case 'pdf':
        return this.generatePDFReport(attendanceData);
      case 'excel':
        return this.generateExcelReport(attendanceData);
      case 'csv':
        return this.generateCSVReport(attendanceData);
    }
  }

  private static generateCSVReport(data: AttendanceData[]): string {
    const headers = ['Date', 'Check In', 'Check Out', 'Working Hours', 'Status'];
    const rows = data.map(record => [
      record.PROCESSDATE,
      record.PUNCH1_TIME,
      record.PUNCH2_TIME,
      record['Working Time'],
      record.DAYSTATUS,
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}
```

### 2. Analytics Dashboard

Add custom analytics:

```typescript
// components/AnalyticsDashboard.tsx
export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    averageWorkingHours: 0,
    attendanceRate: 0,
    overtimeHours: 0,
    leaveUtilization: 0,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Avg Working Hours"
          value={`${analytics.averageWorkingHours}h`}
          trend="+2.5%"
          color="#059669"
        />
        <MetricCard
          title="Attendance Rate"
          value={`${analytics.attendanceRate}%`}
          trend="+1.2%"
          color="#2563EB"
        />
      </View>
    </View>
  );
}
```

## Security Customization

### 1. Biometric Authentication

Add biometric authentication:

```typescript
// services/biometricAuth.ts
import * as LocalAuthentication from 'expo-local-authentication';

export class BiometricAuthService {
  static async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  static async authenticate(): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access CAMS',
      fallbackLabel: 'Use PIN',
    });

    return result.success;
  }
}
```

### 2. Geofencing

Implement location-based attendance:

```typescript
// services/geofencingService.ts
import * as Location from 'expo-location';

export class GeofencingService {
  static async isWithinOfficeRadius(
    officeLocation: { latitude: number; longitude: number },
    radius: number = 100
  ): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return false;

    const currentLocation = await Location.getCurrentPositionAsync({});
    const distance = this.calculateDistance(
      currentLocation.coords,
      officeLocation
    );

    return distance <= radius;
  }

  private static calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ): number {
    // Haversine formula implementation
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
```

## Deployment Customization

### 1. Environment-Specific Builds

Configure different builds for different environments:

```json
// eas.json
{
  "build": {
    "development": {
      "env": {
        "EXPO_PUBLIC_API_BASE_URL": "https://dev-api.yourcompany.com"
      }
    },
    "staging": {
      "env": {
        "EXPO_PUBLIC_API_BASE_URL": "https://staging-api.yourcompany.com"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_BASE_URL": "https://api.yourcompany.com"
      }
    }
  }
}
```

### 2. Custom Build Scripts

Add custom build scripts:

```json
// package.json
{
  "scripts": {
    "build:dev": "EXPO_PUBLIC_ENV=development expo export",
    "build:staging": "EXPO_PUBLIC_ENV=staging expo export",
    "build:prod": "EXPO_PUBLIC_ENV=production expo export",
    "deploy:staging": "npm run build:staging && netlify deploy",
    "deploy:prod": "npm run build:prod && netlify deploy --prod"
  }
}
```

This customization guide provides the foundation for adapting the CAMS Enterprise application to your organization's specific needs and requirements.