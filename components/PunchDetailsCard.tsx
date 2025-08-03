import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { 
  Clock, 
  Calendar, 
  Timer, 
  AlertCircle, 
  CheckCircle, 
  Coffee,
  ArrowRight,
  ArrowLeft,
  Pause
} from 'lucide-react-native';
import { PunchData } from '../services/camsApi';

interface PunchDetailsCardProps {
  punchData: PunchData;
  isToday?: boolean;
}

export function PunchDetailsCard({ punchData, isToday = false }: PunchDetailsCardProps) {
  const getAllPunches = () => {
    const punches = [
      { time: punchData.PUNCH1_TIME, type: 'in' },
      { time: punchData.PUNCH2_TIME, type: 'out' },
      { time: punchData.PUNCH3_TIME, type: 'in' },
      { time: punchData.PUNCH4_TIME, type: 'out' },
      { time: punchData.PUNCH5_TIME, type: 'in' },
      { time: punchData.PUNCH6_TIME, type: 'out' },
      { time: punchData.PUNCH7_TIME, type: 'in' },
      { time: punchData.PUNCH8_TIME, type: 'out' },
      { time: punchData.PUNCH9_TIME, type: 'in' },
      { time: punchData.PUNCH10_TIME, type: 'out' },
      { time: punchData.PUNCH11_TIME, type: 'in' },
      { time: punchData.PUNCH12_TIME, type: 'out' },
    ].filter(punch => punch.time && punch.time !== '00:00:00' && punch.time.trim() !== '');

    return punches;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return '#059669';
      case 'absent':
        return '#DC2626';
      case 'wo':
      case 'weekly off':
        return '#7C3AED';
      case 'holiday':
        return '#0D9488';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return <CheckCircle size={16} color="#059669" />;
      case 'absent':
        return <AlertCircle size={16} color="#DC2626" />;
      case 'wo':
      case 'weekly off':
        return <Coffee size={16} color="#7C3AED" />;
      case 'holiday':
        return <Calendar size={16} color="#0D9488" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr || timeStr === '00:00:00' || timeStr.trim() === '') return '-';
    
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      
      if (hour === 0 && minute === 0) return '-';
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    } catch {
      return timeStr;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const [day, month, year] = dateStr.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const punches = getAllPunches();
  const hasLateIn = punchData.LateIn === '1' || parseInt(punchData.LateIn || '0') > 0;
  const hasEarlyOut = punchData.EarlyOut === '1' || parseInt(punchData.EarlyOut || '0') > 0;
  const hasOvertime = punchData.Overtime === '1' || parseInt(punchData.Overtime || '0') > 0;

  return (
    <View style={[styles.container, isToday && styles.todayContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.dateSection}>
          <Text style={styles.date}>{formatDate(punchData.PROCESSDATE)}</Text>
          {isToday && <Text style={styles.todayBadge}>Today</Text>}
        </View>
        
        <View style={styles.statusSection}>
          {getStatusIcon(punchData.DAYSTATUS)}
          <Text style={[styles.status, { color: getStatusColor(punchData.DAYSTATUS) }]}>
            {punchData.DAYSTATUS}
          </Text>
        </View>
      </View>

      {/* Punch Timeline */}
      {punches.length > 0 && (
        <View style={styles.punchTimeline}>
          <Text style={styles.sectionTitle}>Punch Timeline</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timelineScroll}>
            <View style={styles.timeline}>
              {punches.map((punch, index) => (
                <View key={index} style={styles.punchItem}>
                  <View style={[
                    styles.punchIcon,
                    { backgroundColor: punch.type === 'in' ? '#DCFCE7' : '#FEE2E2' }
                  ]}>
                    {punch.type === 'in' ? (
                      <ArrowRight size={16} color="#059669" />
                    ) : (
                      <ArrowLeft size={16} color="#DC2626" />
                    )}
                  </View>
                  <Text style={styles.punchTime}>{formatTime(punch.time)}</Text>
                  <Text style={styles.punchType}>
                    {punch.type === 'in' ? 'In' : 'Out'}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Work Summary */}
      <View style={styles.workSummary}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Timer size={16} color="#2563EB" />
            <Text style={styles.summaryLabel}>Working Hours</Text>
            <Text style={styles.summaryValue}>
              {punchData['Working Time'] || '0h 0m'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Clock size={16} color="#059669" />
            <Text style={styles.summaryLabel}>Shift</Text>
            <Text style={styles.summaryValue}>
              {formatTime(punchData.SHIFTSTART)} - {formatTime(punchData.SHIFTEND)}
            </Text>
          </View>
        </View>

        {/* Alerts and Notifications */}
        {(hasLateIn || hasEarlyOut || hasOvertime) && (
          <View style={styles.alertsSection}>
            {hasLateIn && (
              <View style={styles.alertItem}>
                <AlertCircle size={14} color="#D97706" />
                <Text style={styles.alertText}>
                  Late In: {punchData.LATEIN_HHMM || '0h 0m'}
                </Text>
              </View>
            )}
            
            {hasEarlyOut && (
              <View style={styles.alertItem}>
                <AlertCircle size={14} color="#DC2626" />
                <Text style={styles.alertText}>
                  Early Out: {punchData.EARLYOUT_HHMM || '0h 0m'}
                </Text>
              </View>
            )}
            
            {hasOvertime && (
              <View style={styles.alertItem}>
                <CheckCircle size={14} color="#059669" />
                <Text style={styles.alertText}>
                  Overtime: {punchData.OVERTIME_HHMM || '0h 0m'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Lunch Break Info */}
        {punchData.LUNCHSTART && punchData.LUNCHEND && (
          <View style={styles.lunchInfo}>
            <Pause size={14} color="#6B7280" />
            <Text style={styles.lunchText}>
              Lunch: {formatTime(punchData.LUNCHSTART)} - {formatTime(punchData.LUNCHEND)}
            </Text>
          </View>
        )}
      </View>

      {/* Additional Details */}
      <View style={styles.additionalDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Schedule:</Text>
          <Text style={styles.detailValue}>{punchData.SCHEDULESHIFT}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Network Hours:</Text>
          <Text style={styles.detailValue}>{punchData.NETWORKHRS}h</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Adjusted Hours:</Text>
          <Text style={styles.detailValue}>{punchData.ADJUSTEDHRS}h</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  todayContainer: {
    borderWidth: 2,
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  todayBadge: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  status: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  punchTimeline: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  timelineScroll: {
    marginHorizontal: -4,
  },
  timeline: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    gap: 16,
  },
  punchItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  punchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  punchTime: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  punchType: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  workSummary: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 2,
    textAlign: 'center',
  },
  alertsSection: {
    gap: 8,
    marginBottom: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  alertText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
  },
  lunchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lunchText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  additionalDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
});