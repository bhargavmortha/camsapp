import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Clock, Activity, Zap, AlertTriangle } from 'lucide-react-native';
import { usePunchData } from '../hooks/usePunchData';
import { LoadingSpinner } from './LoadingSpinner';

interface RealTimePunchWidgetProps {
  userId: string;
}

export function RealTimePunchWidget({ userId }: RealTimePunchWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { todaysPunch, isLoading, error, refetch } = usePunchData(userId);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const getLastPunchInfo = () => {
    if (!todaysPunch) return null;

    const punches = [
      todaysPunch.PUNCH1_TIME,
      todaysPunch.PUNCH2_TIME,
      todaysPunch.PUNCH3_TIME,
      todaysPunch.PUNCH4_TIME,
      todaysPunch.PUNCH5_TIME,
      todaysPunch.PUNCH6_TIME,
      todaysPunch.PUNCH7_TIME,
      todaysPunch.PUNCH8_TIME,
      todaysPunch.PUNCH9_TIME,
      todaysPunch.PUNCH10_TIME,
      todaysPunch.PUNCH11_TIME,
      todaysPunch.PUNCH12_TIME,
    ].filter(time => time && time !== '00:00:00' && time.trim() !== '');

    if (punches.length === 0) return null;

    const lastPunch = punches[punches.length - 1];
    const isLastPunchIn = punches.length % 2 === 1;

    return {
      time: lastPunch,
      type: isLastPunchIn ? 'in' : 'out',
      count: punches.length,
    };
  };

  const lastPunchInfo = getLastPunchInfo();
  const workingHours = todaysPunch?.['Working Time'] || '0h 0m';
  const isLate = todaysPunch?.LateIn === '1' || parseInt(todaysPunch?.LateIn || '0') > 0;

  return (
    <View style={styles.container}>
      {/* Real-time Clock */}
      <View style={styles.clockSection}>
        <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
        <Text style={styles.currentDate}>
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          })}
        </Text>
      </View>

      {/* Status Indicators */}
      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <Activity size={16} color={todaysPunch ? '#059669' : '#9CA3AF'} />
          <Text style={[
            styles.statusText,
            { color: todaysPunch ? '#059669' : '#9CA3AF' }
          ]}>
            {todaysPunch ? 'Active' : 'No Data'}
          </Text>
        </View>

        {isLate && (
          <View style={styles.statusItem}>
            <AlertTriangle size={16} color="#D97706" />
            <Text style={[styles.statusText, { color: '#D97706' }]}>
              Late In
            </Text>
          </View>
        )}

        <View style={styles.statusItem}>
          <Zap size={16} color="#2563EB" />
          <Text style={[styles.statusText, { color: '#2563EB' }]}>
            Live Sync
          </Text>
        </View>
      </View>

      {/* Today's Summary */}
      {todaysPunch && (
        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Working Hours</Text>
              <Text style={styles.summaryValue}>{workingHours}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Text style={[
                styles.summaryValue,
                { color: todaysPunch.DAYSTATUS === 'Present' ? '#059669' : '#DC2626' }
              ]}>
                {todaysPunch.DAYSTATUS}
              </Text>
            </View>
          </View>

          {lastPunchInfo && (
            <View style={styles.lastPunchInfo}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.lastPunchText}>
                Last {lastPunchInfo.type}: {lastPunchInfo.time} ({lastPunchInfo.count} punches)
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refetch}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner size={16} color="#FFFFFF" />
          ) : (
            <Activity size={16} color="#FFFFFF" />
          )}
          <Text style={styles.refreshButtonText}>
            {isLoading ? 'Syncing...' : 'Refresh Data'}
          </Text>
        </TouchableOpacity>
      </View>

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
  clockSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentTime: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  currentDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  summarySection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 4,
  },
  lastPunchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  lastPunchText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  actionsSection: {
    gap: 12,
  },
  refreshButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  refreshButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    textAlign: 'center',
  },
});