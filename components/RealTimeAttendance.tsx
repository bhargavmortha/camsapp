import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Clock, MapPin, Wifi, WifiOff, RefreshCw } from 'lucide-react-native';
import { useAttendanceData, useEnterpriseData } from '../hooks/useEnterpriseData';
import { enterpriseApi, AttendanceData } from '../services/enterpriseApi';
import { LoadingSpinner } from './LoadingSpinner';

interface RealTimeAttendanceProps {
  userId: string;
}

export function RealTimeAttendance({ userId }: RealTimeAttendanceProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [lastPunch, setLastPunch] = useState<AttendanceData | null>(null);
  const [isMarking, setIsMarking] = useState(false);

  const { attendanceData, isLoading, error, refetch } = useAttendanceData(userId);
  const { isLoading: isSyncing, lastSync, syncData } = useEnterpriseData();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Get today's attendance record
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const todayRecord = attendanceData.find(record => 
      record.PROCESSDATE.replace(/-/g, '') === today
    );
    setLastPunch(todayRecord || null);
  }, [attendanceData]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const getLastPunchTime = () => {
    if (!lastPunch) return null;
    
    // Find the last non-empty punch time
    const punchTimes = [
      lastPunch.PUNCH12_TIME,
      lastPunch.PUNCH11_TIME,
      lastPunch.PUNCH10_TIME,
      lastPunch.PUNCH9_TIME,
      lastPunch.PUNCH8_TIME,
      lastPunch.PUNCH7_TIME,
      lastPunch.PUNCH6_TIME,
      lastPunch.PUNCH5_TIME,
      lastPunch.PUNCH4_TIME,
      lastPunch.PUNCH3_TIME,
      lastPunch.PUNCH2_TIME,
      lastPunch.PUNCH1_TIME,
    ].filter(time => time && time.trim() !== '');

    return punchTimes[0] || null;
  };

  const getNextPunchType = () => {
    if (!lastPunch) return 'check-in';
    
    const punchTimes = [
      lastPunch.PUNCH1_TIME,
      lastPunch.PUNCH2_TIME,
      lastPunch.PUNCH3_TIME,
      lastPunch.PUNCH4_TIME,
      lastPunch.PUNCH5_TIME,
      lastPunch.PUNCH6_TIME,
      lastPunch.PUNCH7_TIME,
      lastPunch.PUNCH8_TIME,
      lastPunch.PUNCH9_TIME,
      lastPunch.PUNCH10_TIME,
      lastPunch.PUNCH11_TIME,
      lastPunch.PUNCH12_TIME,
    ].filter(time => time && time.trim() !== '');

    return punchTimes.length % 2 === 0 ? 'check-in' : 'check-out';
  };

  const handleMarkAttendance = async () => {
    setIsMarking(true);
    
    try {
      const punchType = getNextPunchType();
      const response = await enterpriseApi.markAttendance(userId, punchType);
      
      if (response.success) {
        Alert.alert(
          'Success', 
          `${punchType === 'check-in' ? 'Checked in' : 'Checked out'} successfully!`
        );
        // Refresh data
        await refetch();
        await syncData();
      } else {
        Alert.alert('Error', response.error || 'Failed to mark attendance');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to mark attendance. Please try again.');
    } finally {
      setIsMarking(false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([refetch(), syncData()]);
  };

  const lastPunchTime = getLastPunchTime();
  const nextPunchType = getNextPunchType();

  return (
    <View style={styles.container}>
      {/* Real-time Clock */}
      <View style={styles.clockContainer}>
        <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
        <Text style={styles.currentDate}>
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>

      {/* Connection Status */}
      <View style={styles.statusBar}>
        <View style={styles.connectionStatus}>
          {isOnline ? (
            <Wifi size={16} color="#059669" />
          ) : (
            <WifiOff size={16} color="#DC2626" />
          )}
          <Text style={[
            styles.statusText,
            { color: isOnline ? '#059669' : '#DC2626' }
          ]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <LoadingSpinner size={16} />
          ) : (
            <RefreshCw size={16} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>

      {/* Last Sync Info */}
      {lastSync && (
        <View style={styles.syncInfo}>
          <Text style={styles.syncText}>
            Last synced: {lastSync.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      )}

      {/* Attendance Action */}
      <View style={styles.attendanceContainer}>
        {lastPunchTime && (
          <View style={styles.lastPunchInfo}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.lastPunchText}>
              Last {lastPunch?.PUNCH1_TIME && !lastPunch?.PUNCH2_TIME ? 'Check-in' : 'Check-out'}: {lastPunchTime}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.punchButton,
            nextPunchType === 'check-out' && styles.checkOutButton,
            (isMarking || isLoading) && styles.punchButtonDisabled,
          ]}
          onPress={handleMarkAttendance}
          disabled={isMarking || isLoading}
        >
          {isMarking ? (
            <LoadingSpinner size={20} color="#FFFFFF" />
          ) : (
            <Text style={styles.punchButtonText}>
              {nextPunchType === 'check-in' ? 'Check In' : 'Check Out'}
            </Text>
          )}
        </TouchableOpacity>

        {lastPunch && (
          <View style={styles.workingHours}>
            <Text style={styles.workingHoursLabel}>Working Hours Today</Text>
            <Text style={styles.workingHoursValue}>
              {lastPunch['Working Time'] || lastPunch.WORKTIME_HHMM || '0h 0m'}
            </Text>
          </View>
        )}
      </View>

      {/* Today's Summary */}
      {lastPunch && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Shift</Text>
              <Text style={styles.summaryValue}>
                {lastPunch.SHIFTSTART} - {lastPunch.SHIFTEND}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Text style={[
                styles.summaryValue,
                { color: lastPunch.DAYSTATUS === 'Present' ? '#059669' : '#DC2626' }
              ]}>
                {lastPunch.DAYSTATUS}
              </Text>
            </View>
            
            {lastPunch.OVERTIME_HHMM && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Overtime</Text>
                <Text style={[styles.summaryValue, { color: '#D97706' }]}>
                  {lastPunch.OVERTIME_HHMM}
                </Text>
              </View>
            )}
            
            {lastPunch.LATEIN_HHMM && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Late In</Text>
                <Text style={[styles.summaryValue, { color: '#DC2626' }]}>
                  {lastPunch.LATEIN_HHMM}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentTime: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  currentDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  refreshButton: {
    padding: 4,
  },
  syncInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  syncText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  attendanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lastPunchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  lastPunchText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  punchButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkOutButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  punchButtonDisabled: {
    opacity: 0.7,
  },
  punchButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  workingHours: {
    alignItems: 'center',
    marginTop: 16,
  },
  workingHoursLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  workingHoursValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#059669',
    marginTop: 4,
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    textAlign: 'center',
  },
});