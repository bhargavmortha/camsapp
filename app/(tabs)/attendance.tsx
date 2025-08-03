import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { MapPin, Clock, Calendar, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, Coffee } from 'lucide-react-native';
import { useAttendanceData } from '../../hooks/useEnterpriseData';
import { AttendanceData } from '../../services/enterpriseApi';
import { StorageService } from '../../utils/storage';

const { width } = Dimensions.get('window');

export default function AttendanceScreen() {
  const [selectedMonth, setSelectedMonth] = useState('December 2024');
  const [viewType, setViewType] = useState<'calendar' | 'list'>('calendar');
  const [currentUserId, setCurrentUserId] = useState('61008');

  const { attendanceData, isLoading, error, refetch } = useAttendanceData(currentUserId);

  React.useEffect(() => {
    const loadUserId = async () => {
      const userId = await StorageService.getItem<string>('current_user_id');
      if (userId) {
        setCurrentUserId(userId);
      }
    };
    loadUserId();
  }, []);

  const convertToDisplayFormat = (record: AttendanceData) => {
    const getStatus = () => {
      if (record.DAYSTATUS === 'Present') return 'present';
      if (record.DAYSTATUS === 'Absent') return 'absent';
      if (record.LATEIN && record.LATEIN !== '0') return 'late';
      if (record.DAYSTATUS === 'Holiday') return 'holiday';
      if (record.DAYSTATUS === 'Leave') return 'leave';
      return 'present';
    };

    return {
      date: record.PROCESSDATE,
      checkIn: record.PUNCH1_TIME || '-',
      checkOut: record.PUNCH2_TIME || record.OUTPUNCH_TIME || '-',
      status: getStatus(),
      workHours: record['Working Time'] || record.WORKTIME_HHMM || '-',
      location: 'Office - Block A', // This could be derived from integration_reference
      overtime: record.OVERTIME_HHMM,
      lateIn: record.LATEIN_HHMM,
      earlyOut: record.EARLYOUT_HHMM,
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle size={16} color="#059669" />;
      case 'late':
        return <AlertCircle size={16} color="#D97706" />;
      case 'absent':
        return <XCircle size={16} color="#DC2626" />;
      case 'holiday':
        return <Coffee size={16} color="#7C3AED" />;
      case 'leave':
        return <Calendar size={16} color="#0D9488" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#059669';
      case 'late':
        return '#D97706';
      case 'absent':
        return '#DC2626';
      case 'holiday':
        return '#7C3AED';
      case 'leave':
        return '#0D9488';
      default:
        return '#6B7280';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'present':
        return '#DCFCE7';
      case 'late':
        return '#FEF3C7';
      case 'absent':
        return '#FEE2E2';
      case 'holiday':
        return '#F3E8FF';
      case 'leave':
        return '#F0FDFA';
      default:
        return '#F3F4F6';
    }
  };

  const getAttendanceSummary = () => {
    const summary = attendanceData.reduce(
      (acc, record) => {
        const status = convertToDisplayFormat(record).status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      present: summary.present || 0,
      late: summary.late || 0,
      absent: summary.absent || 0,
      leave: summary.leave || 0,
    };
  };

  const summary = getAttendanceSummary();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewType === 'calendar' && styles.toggleButtonActive]}
            onPress={() => setViewType('calendar')}
          >
            <Text style={[styles.toggleText, viewType === 'calendar' && styles.toggleTextActive]}>
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewType === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewType('list')}
          >
            <Text style={[styles.toggleText, viewType === 'list' && styles.toggleTextActive]}>
              List
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <TouchableOpacity style={styles.monthButton}>
          <Text style={styles.monthText}>{selectedMonth}</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{summary.present}</Text>
          <Text style={styles.summaryLabel}>Present</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#D97706' }]}>{summary.late}</Text>
          <Text style={styles.summaryLabel}>Late</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#DC2626' }]}>{summary.absent}</Text>
          <Text style={styles.summaryLabel}>Absent</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#0D9488' }]}>{summary.leave}</Text>
          <Text style={styles.summaryLabel}>Leave</Text>
        </View>
      </View>

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
        {viewType === 'list' ? (
          <View style={styles.listView}>
            {attendanceData.map((record, index) => {
              const displayRecord = convertToDisplayFormat(record);
              
              return (
              <View key={record.UserID + record.PROCESSDATE} style={styles.attendanceCard}>
                <View style={styles.attendanceHeader}>
                  <View style={styles.dateSection}>
                    <Text style={styles.attendanceDate}>
                      {new Date(displayRecord.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBg(displayRecord.status) }]}>
                      {getStatusIcon(displayRecord.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(displayRecord.status) }]}>
                        {displayRecord.status.charAt(0).toUpperCase() + displayRecord.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                {displayRecord.status !== 'leave' && displayRecord.status !== 'absent' && displayRecord.status !== 'holiday' && (
                  <View style={styles.timeDetails}>
                    <View style={styles.timeItem}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.timeLabel}>In:</Text>
                      <Text style={styles.timeValue}>{displayRecord.checkIn}</Text>
                    </View>
                    
                    <View style={styles.timeItem}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.timeLabel}>Out:</Text>
                      <Text style={styles.timeValue}>{displayRecord.checkOut}</Text>
                    </View>
                    
                    <View style={styles.timeItem}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.timeLabel}>Hours:</Text>
                      <Text style={styles.timeValue}>{displayRecord.workHours}</Text>
                    </View>

                    {displayRecord.overtime && (
                      <View style={styles.timeItem}>
                        <Clock size={16} color="#D97706" />
                        <Text style={styles.timeLabel}>OT:</Text>
                        <Text style={[styles.timeValue, { color: '#D97706' }]}>{displayRecord.overtime}</Text>
                      </View>
                    )}
                  </View>
                )}

                {displayRecord.location !== '-' && (
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.locationText}>{displayRecord.location}</Text>
                  </View>
                )}
              </View>
            );
            })}

            {attendanceData.length === 0 && !isLoading && (
              <View style={styles.emptyState}>
                <Clock size={48} color="#9CA3AF" />
                <Text style={styles.emptyStateText}>No attendance data found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Pull down to refresh or check your connection
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.calendarView}>
            <Text style={styles.calendarNote}>
              Calendar view will show a visual month calendar with color-coded attendance status
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
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
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#1F2937',
  },
  monthSelector: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  monthButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  summaryCard: {
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
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listView: {
    paddingBottom: 24,
  },
  attendanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  attendanceHeader: {
    marginBottom: 16,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  timeDetails: {
    gap: 12,
    marginBottom: 12,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    width: 40,
  },
  timeValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  calendarView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  calendarNote: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    textAlign: 'center',
  },
});