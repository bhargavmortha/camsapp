import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Plus, Calendar, Clock, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, FileText, X } from 'lucide-react-native';

interface Leave {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export default function LeavesScreen() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [leaves] = useState<Leave[]>([
    {
      id: '1',
      type: 'Annual Leave',
      startDate: '2024-12-25',
      endDate: '2024-12-26',
      days: 2,
      reason: 'Christmas holidays',
      status: 'approved',
      appliedDate: '2024-12-15',
    },
    {
      id: '2',
      type: 'Sick Leave',
      startDate: '2024-12-20',
      endDate: '2024-12-20',
      days: 1,
      reason: 'Doctor appointment',
      status: 'pending',
      appliedDate: '2024-12-18',
    },
    {
      id: '3',
      type: 'Personal Leave',
      startDate: '2024-12-10',
      endDate: '2024-12-12',
      days: 3,
      reason: 'Family function',
      status: 'rejected',
      appliedDate: '2024-12-05',
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} color="#059669" />;
      case 'rejected':
        return <XCircle size={20} color="#DC2626" />;
      case 'pending':
        return <AlertCircle size={20} color="#D97706" />;
      default:
        return <Clock size={20} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#059669';
      case 'rejected':
        return '#DC2626';
      case 'pending':
        return '#D97706';
      default:
        return '#6B7280';
    }
  };

  const handleApplyLeave = () => {
    // Here you would typically validate and submit the leave application
    setShowApplyModal(false);
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leave Management</Text>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => setShowApplyModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Leave Balance Cards */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceValue}>15</Text>
          <Text style={styles.balanceLabel}>Annual Leave</Text>
          <Text style={styles.balanceSubtext}>Days Available</Text>
        </View>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceValue}>3</Text>
          <Text style={styles.balanceLabel}>Sick Leave</Text>
          <Text style={styles.balanceSubtext}>Days Available</Text>
        </View>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceValue}>2</Text>
          <Text style={styles.balanceLabel}>Personal</Text>
          <Text style={styles.balanceSubtext}>Days Available</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recent Applications */}
        <Text style={styles.sectionTitle}>Recent Applications</Text>
        
        {leaves.map((leave) => (
          <View key={leave.id} style={styles.leaveCard}>
            <View style={styles.leaveHeader}>
              <View style={styles.leaveInfo}>
                <Text style={styles.leaveType}>{leave.type}</Text>
                <Text style={styles.leaveDates}>
                  {leave.startDate} to {leave.endDate}
                </Text>
              </View>
              <View style={styles.leaveStatus}>
                {getStatusIcon(leave.status)}
                <Text style={[styles.statusText, { color: getStatusColor(leave.status) }]}>
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </Text>
              </View>
            </View>
            
            <View style={styles.leaveDetails}>
              <View style={styles.leaveDetailItem}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.leaveDetailText}>{leave.days} days</Text>
              </View>
              <View style={styles.leaveDetailItem}>
                <FileText size={16} color="#6B7280" />
                <Text style={styles.leaveDetailText}>{leave.reason}</Text>
              </View>
            </View>
            
            <Text style={styles.appliedDate}>
              Applied on {leave.appliedDate}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Apply Leave Modal */}
      <Modal
        visible={showApplyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowApplyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Apply for Leave</Text>
              <TouchableOpacity 
                onPress={() => setShowApplyModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Leave Type</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Select leave type"
                    value={leaveType}
                    onChangeText={setLeaveType}
                  />
                </View>
              </View>

              <View style={styles.dateRow}>
                <View style={styles.dateInputGroup}>
                  <Text style={styles.inputLabel}>Start Date</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="DD/MM/YYYY"
                      value={startDate}
                      onChangeText={setStartDate}
                    />
                  </View>
                </View>

                <View style={styles.dateInputGroup}>
                  <Text style={styles.inputLabel}>End Date</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="DD/MM/YYYY"
                      value={endDate}
                      onChangeText={setEndDate}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reason</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter reason for leave"
                    value={reason}
                    onChangeText={setReason}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.attachButton}>
                <FileText size={20} color="#2563EB" />
                <Text style={styles.attachButtonText}>Attach Supporting Documents</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowApplyModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleApplyLeave}
              >
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  applyButton: {
    backgroundColor: '#2563EB',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  leaveCard: {
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
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leaveInfo: {
    flex: 1,
  },
  leaveType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  leaveDates: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  leaveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  leaveDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  leaveDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leaveDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  appliedDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateInputGroup: {
    flex: 1,
  },
  textAreaContainer: {
    height: 100,
    paddingVertical: 12,
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    marginBottom: 24,
  },
  attachButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});