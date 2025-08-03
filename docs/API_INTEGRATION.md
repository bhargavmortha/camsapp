# CAMS Enterprise API Integration Guide

## Overview

This document provides comprehensive guidance for integrating your CAMS Enterprise application with your existing attendance management system API.

## Quick Setup

### 1. Configure API Connection

1. Open the app and navigate to the Dashboard
2. Tap the WiFi icon in the top-right corner
3. Enter your API base URL (e.g., `https://your-server.com/cams/api`)
4. Select authentication type if required
5. Test the connection
6. Save configuration

### 2. Module Configuration

1. Tap the Settings icon in the Dashboard header
2. Enable/disable modules based on your organization's needs
3. Save changes

## API Format Specification

### Base URL Structure
```
https://your-server.com/cams/api
```

### Attendance Endpoint
```
GET /attendance_daily3.php/attendance-daily
```

#### Required Parameters
- `action`: Operation type (`get`, `mark`)
- `field-name`: Comma-separated list of fields to retrieve
- `date-range`: Date range in format `DDMMYYYY-DDMMYYYY`
- `range`: Data scope (`user`, `department`, `all`)
- `Id`: User ID for user-specific data

#### Example Request
```
GET /attendance_daily3.php/attendance-daily?action=get&field-name=UserID,UserName,short_name,integration_reference,PROCESSDATE%20as%20[PROCESSDATE],PUNCH1_TIME,PUNCH2_TIME,PUNCH3_TIME,PUNCH4_TIME,PUNCH5_TIME,PUNCH6_TIME,PUNCH7_TIME,PUNCH8_TIME,PUNCH9_TIME,PUNCH10_TIME,PUNCH11_TIME,PUNCH12_TIME,SCHEDULESHIFT,WORKINGSHIFT,EARLYIN,EARLYIN_HHMM,LATEIN,LATEIN_HHMM,EARLYOUT,EARLYOUT_HHMM,OVERSTAY,OVERSTAY_HHMM,OVERTIME,OVERTIME_HHMM%20as%20[OVERTIME_HHMM],WORKTIME,WORKTIME_HHMM%20as[Working%20Time],FIRSTHALF,SECONDHALF,%20SHIFTSTART%20as%20[SHIFTSTART],SHIFTEND%20as%20[SHIFTEND],LUNCHSTART,LUNCHEND,OUTPUNCH,OUTPUNCH_DATE,OUTPUNCH_TIME,DAYSTATUS,NETWORKHRS,ADJUSTEDHRS&date-range=01062025-30062025&range=user&Id=61008
```

#### Expected Response Format
```json
{
  "success": true,
  "data": [
    {
      "UserID": "61008",
      "UserName": "John Doe",
      "short_name": "John",
      "integration_reference": "EMP001",
      "PROCESSDATE": "2024-12-20",
      "PUNCH1_TIME": "09:15:00",
      "PUNCH2_TIME": "18:30:00",
      "PUNCH3_TIME": null,
      "PUNCH4_TIME": null,
      "PUNCH5_TIME": null,
      "PUNCH6_TIME": null,
      "PUNCH7_TIME": null,
      "PUNCH8_TIME": null,
      "PUNCH9_TIME": null,
      "PUNCH10_TIME": null,
      "PUNCH11_TIME": null,
      "PUNCH12_TIME": null,
      "SCHEDULESHIFT": "General",
      "WORKINGSHIFT": "09:00-18:00",
      "EARLYIN": "0",
      "EARLYIN_HHMM": "00:00",
      "LATEIN": "1",
      "LATEIN_HHMM": "00:15",
      "EARLYOUT": "0",
      "EARLYOUT_HHMM": "00:00",
      "OVERSTAY": "0",
      "OVERSTAY_HHMM": "00:00",
      "OVERTIME": "0",
      "OVERTIME_HHMM": "00:30",
      "WORKTIME": "9.25",
      "Working Time": "09:15",
      "FIRSTHALF": "Present",
      "SECONDHALF": "Present",
      "SHIFTSTART": "09:00",
      "SHIFTEND": "18:00",
      "LUNCHSTART": "13:00",
      "LUNCHEND": "14:00",
      "OUTPUNCH": "1",
      "OUTPUNCH_DATE": "2024-12-20",
      "OUTPUNCH_TIME": "18:30:00",
      "DAYSTATUS": "Present",
      "NETWORKHRS": "9.25",
      "ADJUSTEDHRS": "9.00"
    }
  ]
}
```

### Leave Management Endpoint
```
GET /leaves.php/leaves
POST /leaves.php/leaves
```

#### Parameters for Leave Requests
- `action`: `get`, `apply`, `approve`, `reject`, `balance`
- `userId`: Employee ID
- `type`: Leave type for applications
- `startDate`: Leave start date
- `endDate`: Leave end date
- `reason`: Leave reason

### Reimbursement Endpoint
```
GET /reimbursements.php/reimbursements
POST /reimbursements.php/reimbursements
```

#### Parameters for Reimbursement Requests
- `action`: `get`, `submit`, `approve`, `reject`
- `userId`: Employee ID
- `category`: Expense category
- `amount`: Expense amount
- `description`: Expense description

### Employee Management Endpoint
```
GET /employees.php/employees
POST /employees.php/employees
PUT /employees.php/employees
DELETE /employees.php/employees
```

### Settings Endpoint
```
GET /settings.php/settings
POST /settings.php/settings
```

## Authentication

### Supported Authentication Types

1. **None**: No authentication required
2. **Bearer Token**: Include `Authorization: Bearer <token>` header
3. **API Key**: Include `X-API-Key: <key>` header

### Configuration
```typescript
const apiConfig = {
  baseUrl: 'https://your-server.com/cams/api',
  authentication: {
    type: 'bearer', // or 'api-key' or 'none'
    key: 'your-token-or-key'
  }
};
```

## Data Synchronization

### Real-time Sync
- Automatic sync every 5 minutes
- Manual refresh available in all screens
- Offline data caching for reliability

### Sync Process
1. Fetch latest attendance data
2. Update leave balances
3. Sync reimbursement status
4. Cache data locally
5. Update UI with fresh data

## Error Handling

### Common Error Scenarios
1. **Network Connectivity**: App works offline with cached data
2. **Authentication Failure**: Clear error messages with retry options
3. **Invalid Data**: Validation errors displayed inline
4. **Server Errors**: Graceful degradation with cached data

### Error Response Format
```json
{
  "success": false,
  "error": "Authentication failed",
  "code": "AUTH_ERROR"
}
```

## Customization

### Enterprise Settings
Configure your organization's specific requirements:

```typescript
interface EnterpriseSettings {
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
```

### Module Configuration
Enable/disable features based on your needs:

- **Dashboard**: Overview and real-time attendance
- **Attendance**: Detailed attendance tracking and history
- **Leaves**: Leave application and management
- **Reimbursements**: Expense claim management
- **Profile**: Employee profile and settings
- **Admin**: Administrative functions (role-based)

## Security Considerations

### Data Protection
- All API communications use HTTPS
- Sensitive data is encrypted in local storage
- Authentication tokens are securely stored
- Automatic token refresh when supported

### Access Control
- Role-based module access
- Permission-based feature visibility
- Secure API key management

## Testing Your Integration

### Connection Test
1. Use the built-in connection tester
2. Verify all endpoints respond correctly
3. Test authentication if configured
4. Validate data format compliance

### Data Validation
1. Check attendance data structure
2. Verify date formats
3. Test punch time calculations
4. Validate status mappings

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify base URL is correct
   - Check network connectivity
   - Validate SSL certificate
   - Test authentication credentials

2. **Data Not Loading**
   - Check API response format
   - Verify field names match expected format
   - Test with sample user ID
   - Review server logs

3. **Authentication Errors**
   - Verify token/key is valid
   - Check authentication type configuration
   - Test token expiration handling

### Debug Mode
Enable debug logging to troubleshoot issues:
```typescript
// Add to your API service
console.log('API Request:', url, options);
console.log('API Response:', response);
```

## Support

For technical support or integration assistance:
- Review this documentation
- Test with provided sample endpoints
- Check network and authentication configuration
- Verify data format compliance

## Sample Implementation

### Basic Setup
```typescript
import { enterpriseApi } from './services/enterpriseApi';

// Initialize API
await enterpriseApi.initialize('https://your-server.com/cams/api', {
  type: 'bearer',
  key: 'your-auth-token'
});

// Fetch attendance data
const response = await enterpriseApi.getAttendanceData(
  '61008', 
  '01062025', 
  '30062025'
);

if (response.success) {
  console.log('Attendance data:', response.data);
} else {
  console.error('Error:', response.error);
}
```

This integration guide ensures seamless connectivity between your CAMS Enterprise app and existing attendance management systems.