import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Filter,
  Download,
  RefreshCw,
  LogOut,
  User,
  BarChart3
} from 'lucide-react-native';
import { EmployeeLogin } from '../../components/EmployeeLogin';
import { PunchDetailsCard } from '../../components/PunchDetailsCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useEmployeeAuth, usePunchData } from '../../hooks/usePunchData';
import { PunchData } from '../../services/camsApi';

export default function PunchDetailsScreen() {
  const { session, isLoading: authLoading, error: authError, login, logout, isAuthenticated } = useEmployeeAuth();
  const { punchData, todaysPunch, isLoading, error, lastSync, refetch } = usePunchData(session?.userId);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showFilters, setShowFilters] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const getMonthlyStats = () => {
    const presentDays = punchData.filter(record => record.DAYSTATUS.toLowerCase() === 'present').length;
    const totalWorkingDays = punchData.filter(record => 
      !['WO', 'Holiday'].includes(record.DAYSTATUS)
    ).length;
    
    const totalWorkingHours = punchData.reduce((total, record) => {
      const hours = parseFloat(record.NETWORKHRS || '0');
      return total + hours;
    }, 0);

    const averageHours = totalWorkingDays > 0 ? totalWorkingHours / totalWorkingDays : 0;
    
    const lateCount = punchData.filter(record => 
      record.LateIn === '1' || parseInt(record.LateIn || '0') > 0
    ).length;

    return {
      presentDays,
      totalWorkingDays,
      attendanceRate: totalWorkingDays > 0 ? (presentDays / totalWorkingDays) * 100 : 0,
      averageHours: averageHours.toFixed(1),
      lateCount,
      totalHours: totalWorkingHours.toFixed(1),
    };
  };

  const stats = getMonthlyStats();

  if (!isAuthenticated) {
    return (
      <EmployeeLogin
        onLogin={login}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{session?.employeeName}</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={refetch}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size={20} />
            ) : (
              <RefreshCw size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Monthly Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <BarChart3 size={20} color="#059669" />
          <Text style={styles.statValue}>{stats.attendanceRate.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
        
        <View style={styles.statCard}>
          <Clock size={20} color="#2563EB" />
          <Text style={styles.statValue}>{stats.averageHours}h</Text>
          <Text style={styles.statLabel}>Avg Daily</Text>
        </View>
        
        <View style={styles.statCard}>
          <TrendingUp size={20} color="#D97706" />
          <Text style={styles.statValue}>{stats.lateCount}</Text>
          <Text style={styles.statLabel}>Late Days</Text>
        </View>
        
        <View style={styles.statCard}>
          <Calendar size={20} color="#0D9488" />
          <Text style={styles.statValue}>{stats.totalHours}h</Text>
          <Text style={styles.statLabel}>Total Hours</Text>
        </View>
      </View>

      {/* Last Sync Info */}
      {lastSync && (
        <View style={styles.syncInfo}>
          <Text style={styles.syncText}>
            Last updated: {lastSync.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      )}

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#2563EB"
          />
        }
      >
        {/* Today's Punch Details */}
        {todaysPunch && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Activity</Text>
            <PunchDetailsCard punchData={todaysPunch} isToday={true} />
          </View>
        )}

        {/* Punch History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Punch History</Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Download size={16} color="#2563EB" />
              <Text style={styles.downloadText}>Export</Text>
            </TouchableOpacity>
          </View>
          
          {punchData.length > 0 ? (
            punchData
              .filter(record => !todaysPunch || record.PROCESSDATE !== todaysPunch.PROCESSDATE)
              .sort((a, b) => {
                // Sort by date descending
                const dateA = new Date(a.PROCESSDATE.split('/').reverse().join('-'));
                const dateB = new Date(b.PROCESSDATE.split('/').reverse().join('-'));
                return dateB.getTime() - dateA.getTime();
              })
              .map((record, index) => (
                <PunchDetailsCard 
                  key={`${record.UserID}-${record.PROCESSDATE}`} 
                  punchData={record} 
                />
              ))
          ) : (
            <View style={styles.emptyState}>
              <Clock size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateText}>No punch data found</Text>
              <Text style={styles.emptyStateSubtext}>
                Pull down to refresh or check your connection
              </Text>
            </View>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  userInfo: {
    gap: 4,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  syncInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  syncText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  downloadText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});