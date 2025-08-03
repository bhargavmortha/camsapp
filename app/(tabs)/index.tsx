import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Bell, 
  CircleCheck as CheckCircle, 
  Circle as XCircle, 
  CircleAlert as AlertCircle,
  Settings,
  Wifi
} from 'lucide-react-native';
import { RealTimeAttendance } from '../../components/RealTimeAttendance';
import { ConnectionSetup } from '../../components/ConnectionSetup';
import { ModuleManager } from '../../components/ModuleManager';
import { useEnterpriseSettings, useEnterpriseData } from '../../hooks/useEnterpriseData';
import { AppModuleConfig } from '../../config/api';
import { StorageService } from '../../utils/storage';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [showConnectionSetup, setShowConnectionSetup] = useState(false);
  const [showModuleManager, setShowModuleManager] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('61008'); // Default user ID
  const [enabledModules, setEnabledModules] = useState<AppModuleConfig[]>([]);

  const { settings, isLoading: settingsLoading } = useEnterpriseSettings();
  const { isLoading: syncLoading, error: syncError, lastSync } = useEnterpriseData();

  useEffect(() => {
    // Load current user ID
    const loadUserId = async () => {
      const userId = await StorageService.getItem<string>('current_user_id');
      if (userId) {
        setCurrentUserId(userId);
      }
    };
    loadUserId();
  }, []);

  useEffect(() => {
    if (settings?.modules) {
      setEnabledModules(settings.modules.filter(module => module.enabled));
    }
  }, []);

  const handleModulesUpdated = (modules: AppModuleConfig[]) => {
    setEnabledModules(modules.filter(module => module.enabled));
  };

  const handleConnectionSuccess = () => {
    setShowConnectionSetup(false);
    Alert.alert('Success', 'API connection configured successfully!');
  };

  if (settingsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading enterprise settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {settings?.companyName || 'CAMS Enterprise'}
          </Text>
          <Text style={styles.userName}>Dashboard</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowConnectionSetup(true)}
          >
            <Wifi size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowModuleManager(true)}
          >
            <Settings size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#6B7280" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Real-time Attendance Widget */}
        <RealTimeAttendance userId={currentUserId} />

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Calendar size={20} color="#059669" />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Days Present</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp size={20} color="#EA580C" />
            </View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Late Arrivals</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <CheckCircle size={20} color="#0D9488" />
            </View>
            <Text style={styles.statValue}>8.5</Text>
            <Text style={styles.statLabel}>Avg Hours</Text>
          </View>
        </View>

        {/* Leave Balance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leave Balance</Text>
          <View style={styles.leaveBalanceContainer}>
            <View style={styles.leaveItem}>
              <View style={styles.leaveCircle}>
                <Text style={styles.leaveCount}>15</Text>
              </View>
              <Text style={styles.leaveType}>Annual Leave</Text>
            </View>
            
            <View style={styles.leaveItem}>
              <View style={[styles.leaveCircle, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.leaveCount, { color: '#D97706' }]}>3</Text>
              </View>
              <Text style={styles.leaveType}>Sick Leave</Text>
            </View>
            
            <View style={styles.leaveItem}>
              <View style={[styles.leaveCircle, { backgroundColor: '#DBEAFE' }]}>
                <Text style={[styles.leaveCount, { color: '#2563EB' }]}>2</Text>
              </View>
              <Text style={styles.leaveType}>Personal</Text>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activities</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <CheckCircle size={20} color="#059669" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Leave Approved</Text>
                <Text style={styles.activityDescription}>
                  Annual leave for Dec 25-26 approved
                </Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <AlertCircle size={20} color="#EA580C" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Late Check-in</Text>
                <Text style={styles.activityDescription}>
                  Checked in at 9:15 AM yesterday
                </Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <CheckCircle size={20} color="#0D9488" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Reimbursement Processed</Text>
                <Text style={styles.activityDescription}>
                  Travel expense of $125 approved
                </Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Announcements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Announcements</Text>
          <View style={styles.announcementItem}>
            <Text style={styles.announcementTitle}>Holiday Notice</Text>
            <Text style={styles.announcementContent}>
              Office will be closed on December 25th and 26th for Christmas holidays.
            </Text>
            <Text style={styles.announcementDate}>Posted 2 days ago</Text>
          </View>
        </View>

        {/* Sync Error */}
        {syncError && (
          <View style={styles.errorCard}>
            <AlertCircle size={20} color="#DC2626" />
            <Text style={styles.errorText}>{syncError}</Text>
          </View>
        )}
      </ScrollView>

      {/* Connection Setup Modal */}
      <ConnectionSetup
        visible={showConnectionSetup}
        onClose={() => setShowConnectionSetup(false)}
        onSuccess={handleConnectionSuccess}
      />

      {/* Module Manager Modal */}
      <ModuleManager
        visible={showModuleManager}
        onClose={() => setShowModuleManager(false)}
        onModulesUpdated={handleModulesUpdated}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  leaveBalanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leaveItem: {
    alignItems: 'center',
  },
  leaveCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  leaveCount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  leaveType: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  activityDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  announcementItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    paddingLeft: 16,
  },
  announcementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  announcementContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  announcementDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  errorCard: {
    backgroundColor: '#FEE2E2',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    flex: 1,
  },
});