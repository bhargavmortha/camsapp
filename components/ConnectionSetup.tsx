import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { X, Wifi, Check, CircleAlert as AlertCircle, Settings } from 'lucide-react-native';
import { enterpriseApi } from '../services/enterpriseApi';
import { LoadingSpinner } from './LoadingSpinner';

interface ConnectionSetupProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConnectionSetup({ visible, onClose, onSuccess }: ConnectionSetupProps) {
  const [baseUrl, setBaseUrl] = useState('https://ctoadmin.itiltd.in/cams/api');
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'api-key'>('none');
  const [authKey, setAuthKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const testConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('testing');

    try {
      // Update API configuration
      enterpriseApi.updateConfig({
        baseUrl,
        authentication: authType !== 'none' ? {
          type: authType,
          key: authKey,
        } : undefined,
      });

      // Test the connection
      const response = await enterpriseApi.testConnection();
      
      if (response.success) {
        setConnectionStatus('success');
        // Initialize the API with the new configuration
        const initSuccess = await enterpriseApi.initialize(baseUrl, {
          type: authType,
          key: authKey,
        });
        
        if (initSuccess) {
          Alert.alert('Success', 'Connection established successfully!');
          onSuccess();
        } else {
          setConnectionStatus('error');
          Alert.alert('Error', 'Failed to initialize API configuration');
        }
      } else {
        setConnectionStatus('error');
        Alert.alert('Connection Failed', response.error || 'Unable to connect to the server');
      }
    } catch (error) {
      setConnectionStatus('error');
      Alert.alert('Error', error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <LoadingSpinner size={20} />;
      case 'success':
        return <Check size={20} color="#059669" />;
      case 'error':
        return <AlertCircle size={20} color="#DC2626" />;
      default:
        return <Wifi size={20} color="#6B7280" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return '#059669';
      case 'error':
        return '#DC2626';
      case 'testing':
        return '#D97706';
      default:
        return '#6B7280';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Settings size={24} color="#2563EB" />
              <Text style={styles.modalTitle}>API Connection Setup</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Server Configuration</Text>
              <Text style={styles.sectionDescription}>
                Configure your CAMS API server connection
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Base URL</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="https://your-server.com/cams/api"
                    value={baseUrl}
                    onChangeText={setBaseUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <Text style={styles.inputHint}>
                  Enter your CAMS API server base URL
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Authentication Type</Text>
                <View style={styles.authTypeContainer}>
                  {(['none', 'bearer', 'api-key'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.authTypeButton,
                        authType === type && styles.authTypeButtonActive,
                      ]}
                      onPress={() => setAuthType(type)}
                    >
                      <Text
                        style={[
                          styles.authTypeText,
                          authType === type && styles.authTypeTextActive,
                        ]}
                      >
                        {type === 'none' ? 'None' : type === 'bearer' ? 'Bearer Token' : 'API Key'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {authType !== 'none' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {authType === 'bearer' ? 'Bearer Token' : 'API Key'}
                  </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={`Enter your ${authType === 'bearer' ? 'bearer token' : 'API key'}`}
                      value={authKey}
                      onChangeText={setAuthKey}
                      secureTextEntry={true}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Connection Status</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusIcon}>
                  {getStatusIcon()}
                </View>
                <View style={styles.statusText}>
                  <Text style={[styles.statusTitle, { color: getStatusColor() }]}>
                    {connectionStatus === 'idle' && 'Ready to Connect'}
                    {connectionStatus === 'testing' && 'Testing Connection...'}
                    {connectionStatus === 'success' && 'Connected Successfully'}
                    {connectionStatus === 'error' && 'Connection Failed'}
                  </Text>
                  <Text style={styles.statusDescription}>
                    {connectionStatus === 'idle' && 'Click "Test Connection" to verify your settings'}
                    {connectionStatus === 'testing' && 'Verifying server connection and authentication'}
                    {connectionStatus === 'success' && 'Your CAMS server is connected and ready'}
                    {connectionStatus === 'error' && 'Please check your settings and try again'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>API Documentation</Text>
              <View style={styles.docContainer}>
                <Text style={styles.docTitle}>Expected API Format:</Text>
                <View style={styles.codeBlock}>
                  <Text style={styles.codeText}>
                    GET /attendance_daily3.php/attendance-daily{'\n'}
                    ?action=get{'\n'}
                    &field-name=UserID,UserName,PROCESSDATE...{'\n'}
                    &date-range=01062025-30062025{'\n'}
                    &range=user{'\n'}
                    &Id=61008
                  </Text>
                </View>
                <Text style={styles.docDescription}>
                  The API should return JSON data with attendance records including punch times, 
                  working hours, and status information.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={testConnection}
              disabled={isConnecting || !baseUrl}
            >
              <Text style={styles.testButtonText}>
                {isConnecting ? 'Testing...' : 'Test Connection'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.saveButton,
                connectionStatus !== 'success' && styles.saveButtonDisabled,
              ]}
              onPress={onClose}
              disabled={connectionStatus !== 'success'}
            >
              <Text style={styles.saveButtonText}>Save & Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '95%',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    maxHeight: 400,
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
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
  inputHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  authTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  authTypeButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  authTypeButtonActive: {
    backgroundColor: '#2563EB',
  },
  authTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  authTypeTextActive: {
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  statusIcon: {
    marginRight: 12,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statusDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  docContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  docTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 16,
  },
  docDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  testButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});