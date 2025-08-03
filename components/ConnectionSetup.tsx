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
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'api-key' | 'basic'>('none');
  const [authKey, setAuthKey] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const testConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('testing');

    try {
      // Configure authentication
      const authConfig =
        authType === 'basic'
          ? { type: 'basic', username, password }
          : authType !== 'none'
          ? { type: authType, key: authKey }
          : undefined;

      enterpriseApi.updateConfig({
        baseUrl,
        authentication: authConfig,
      });

      const response = await enterpriseApi.testConnection();

      if (response.success) {
        setConnectionStatus('success');
        const initSuccess = await enterpriseApi.initialize(baseUrl, authConfig);
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
      case 'testing': return <LoadingSpinner size={20} />;
      case 'success': return <Check size={20} color="#059669" />;
      case 'error': return <AlertCircle size={20} color="#DC2626" />;
      default: return <Wifi size={20} color="#6B7280" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success': return '#059669';
      case 'error': return '#DC2626';
      case 'testing': return '#D97706';
      default: return '#6B7280';
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
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
              <Text style={styles.sectionDescription}>Configure your CAMS API server connection</Text>

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
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Authentication Type</Text>
                <View style={styles.authTypeContainer}>
                  {(['none', 'bearer', 'api-key', 'basic'] as const).map((type) => (
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
                        {type === 'none'
                          ? 'None'
                          : type === 'bearer'
                          ? 'Bearer Token'
                          : type === 'api-key'
                          ? 'API Key'
                          : 'Basic Auth'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {authType === 'basic' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                      />
                    </View>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                      />
                    </View>
                  </View>
                </>
              )}

              {(authType === 'bearer' || authType === 'api-key') && (
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
                <View style={styles.statusIcon}>{getStatusIcon()}</View>
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
