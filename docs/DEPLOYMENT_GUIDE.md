# CAMS Enterprise Deployment Guide

## Overview

This guide covers deploying your CAMS Enterprise application for production use across web, iOS, and Android platforms.

## Prerequisites

- Expo CLI installed globally
- EAS CLI for managed builds
- Valid Apple Developer account (for iOS)
- Google Play Console account (for Android)
- Web hosting service (for web deployment)

## Environment Configuration

### 1. Environment Variables

Create environment files for different deployment stages:

#### `.env.production`
```
EXPO_PUBLIC_API_BASE_URL=https://your-production-api.com/cams/api
EXPO_PUBLIC_APP_NAME=CAMS Enterprise
EXPO_PUBLIC_COMPANY_NAME=Your Company Name
EXPO_PUBLIC_ENABLE_DEBUG=false
```

#### `.env.staging`
```
EXPO_PUBLIC_API_BASE_URL=https://your-staging-api.com/cams/api
EXPO_PUBLIC_APP_NAME=CAMS Enterprise (Staging)
EXPO_PUBLIC_COMPANY_NAME=Your Company Name
EXPO_PUBLIC_ENABLE_DEBUG=true
```

### 2. App Configuration

Update `app.json` for production:

```json
{
  "expo": {
    "name": "CAMS Enterprise",
    "slug": "cams-enterprise",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2563EB"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.cams-enterprise",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#2563EB"
      },
      "package": "com.yourcompany.camsenterprise",
      "versionCode": 1
    },
    "web": {
      "bundler": "metro",
      "output": "single",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-camera",
      "expo-location"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

## Platform-Specific Deployment

### Web Deployment

#### 1. Build for Web
```bash
npx expo export --platform web
```

#### 2. Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Mobile App Deployment

#### 1. Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

#### 2. Configure EAS Build
Create `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### 3. Build for iOS
```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

#### 4. Build for Android
```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

#### 5. Submit to App Stores

##### iOS App Store
```bash
eas submit --platform ios
```

##### Google Play Store
```bash
eas submit --platform android
```

## Enterprise Distribution

### iOS Enterprise Distribution

For internal enterprise distribution without App Store:

1. **Apple Developer Enterprise Program**
   - Enroll in Apple Developer Enterprise Program
   - Configure enterprise certificates
   - Build with enterprise profile

2. **Configuration**
```json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.cams-enterprise",
    "enterpriseProvisioning": "enterprise-profile-name"
  }
}
```

### Android Enterprise Distribution

1. **Google Play Console - Private Apps**
   - Upload to Google Play Console
   - Mark as private/internal app
   - Distribute to organization

2. **Direct APK Distribution**
   - Build signed APK
   - Distribute through internal channels
   - Configure device management policies

## Security Configuration

### 1. API Security
```typescript
// Production API configuration
const productionConfig = {
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  authentication: {
    type: 'bearer',
    key: process.env.EXPO_PUBLIC_API_TOKEN,
  },
  timeout: 30000,
  retryAttempts: 3,
};
```

### 2. Data Encryption
```typescript
// Enable encryption for sensitive data
const storageConfig = {
  encryptionKey: process.env.EXPO_PUBLIC_ENCRYPTION_KEY,
  enableEncryption: true,
};
```

### 3. Network Security
- Enforce HTTPS for all API communications
- Implement certificate pinning
- Configure network security policies

## Performance Optimization

### 1. Bundle Optimization
```json
{
  "expo": {
    "optimization": {
      "minify": true,
      "treeshaking": true
    }
  }
}
```

### 2. Image Optimization
- Use WebP format for images
- Implement lazy loading
- Optimize asset sizes

### 3. Caching Strategy
```typescript
// Configure caching policies
const cacheConfig = {
  attendanceData: '1h',
  leaveBalance: '24h',
  userProfile: '7d',
};
```

## Monitoring and Analytics

### 1. Error Tracking
```bash
# Install Sentry for error tracking
npx expo install @sentry/react-native
```

### 2. Performance Monitoring
```typescript
// Configure performance monitoring
import { Performance } from '@react-native-async-storage/async-storage';

Performance.mark('app-start');
Performance.measure('app-load-time', 'app-start');
```

### 3. Usage Analytics
```typescript
// Track user interactions
import { Analytics } from 'expo-analytics';

Analytics.track('attendance_marked', {
  userId: currentUser.id,
  timestamp: new Date().toISOString(),
});
```

## Maintenance and Updates

### 1. Over-the-Air Updates
```bash
# Install EAS Update
npx expo install expo-updates

# Configure updates
eas update --branch production --message "Bug fixes and improvements"
```

### 2. Version Management
```json
{
  "expo": {
    "version": "1.0.0",
    "runtimeVersion": "1.0.0",
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    }
  }
}
```

### 3. Rollback Strategy
```bash
# Rollback to previous version
eas update --branch production --republish
```

## Testing Before Deployment

### 1. Unit Tests
```bash
npm run test
```

### 2. Integration Tests
```bash
# Test API connectivity
npm run test:integration
```

### 3. E2E Tests
```bash
# Install Detox for E2E testing
npm install -g detox-cli
detox test
```

## Deployment Checklist

### Pre-Deployment
- [ ] Update version numbers
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Test offline functionality
- [ ] Validate data synchronization
- [ ] Check performance metrics
- [ ] Review security configurations

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify user authentication
- [ ] Test critical user flows
- [ ] Monitor API response times
- [ ] Validate data accuracy

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check dependency versions
   - Verify platform-specific configurations
   - Review build logs

2. **API Connection Issues**
   - Verify production API URLs
   - Check authentication configuration
   - Test network connectivity

3. **Performance Issues**
   - Optimize bundle size
   - Implement code splitting
   - Review memory usage

### Support Resources

- Expo Documentation: https://docs.expo.dev
- EAS Build Documentation: https://docs.expo.dev/build/introduction/
- React Native Performance: https://reactnative.dev/docs/performance

## Scaling Considerations

### 1. Load Balancing
- Configure API load balancers
- Implement CDN for static assets
- Use database read replicas

### 2. Caching Strategy
- Implement Redis for session management
- Use CDN for API responses
- Configure client-side caching

### 3. Database Optimization
- Index frequently queried fields
- Implement database partitioning
- Use connection pooling

This deployment guide ensures your CAMS Enterprise application is production-ready and scalable for enterprise use.