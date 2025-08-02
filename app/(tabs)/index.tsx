import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Clock, Calendar, MapPin, TrendingUp, Bell, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAttendance = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.userName}>John Doe</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#6B7280" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Current Time & Date */}
      <View style={styles.timeCard}>
        <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
        <Text style={styles.currentDate}>{formatDate(currentTime)}</Text>
      </View>

      {/* Quick Attendance */}
      <View style={styles.attendanceCard}>
        <View style={styles.attendanceHeader}>
          <View style={styles.attendanceInfo}>
            <Clock size={24} color="#2563EB" />
            <View style={styles.attendanceText}>
              <Text style={styles.attendanceTitle}>Today's Attendance</Text>
              <Text style={styles.attendanceStatus}>
                {isCheckedIn ? 'Checked In' : 'Not Checked In'}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.punchButton, isCheckedIn && styles.punchButtonCheckedIn]}
            onPress={handleAttendance}
          >
            <Text style={styles.punchButtonText}>
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {isCheckedIn && (
          <View style={styles.punchDetails}>
            <View style={styles.punchItem}>
              <Text style={styles.punchLabel}>Check In</Text>
              <Text style={styles.punchTime}>09:15 AM</Text>
            </View>
            <View style={styles.punchDivider} />
            <View style={styles.punchItem}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.punchLocation}>Office - Block A</Text>
            </View>
          </View>
        )}
      </View>

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
    </ScrollView>
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
  timeCard: {
    backgroundColor: '#2563EB',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  currentTime: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  currentDate: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#BFDBFE',
    marginTop: 8,
  },
  attendanceCard: {
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
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attendanceText: {
    marginLeft: 12,
  },
  attendanceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  attendanceStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  punchButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  punchButtonCheckedIn: {
    backgroundColor: '#EF4444',
  },
  punchButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  punchDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  punchItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  punchLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 8,
  },
  punchTime: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  punchDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  punchLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
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
});