import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
} from 'react-native';
import { Settings, X, Chrome as Home, Clock, Calendar, Receipt, User, Shield, Eye, EyeOff } from 'lucide-react-native';
import { AppModuleConfig } from '../config/api';
import { useEnterpriseSettings } from '../hooks/useEnterpriseData';

interface ModuleManagerProps {
  visible: boolean;
  onClose: () => void;
  onModulesUpdated: (modules: AppModuleConfig[]) => void;
}

const MODULE_ICONS = {
  home: Home,
  clock: Clock,
  calendar: Calendar,
  receipt: Receipt,
  user: User,
  settings: Shield,
};

export function ModuleManager({ visible, onClose, onModulesUpdated }: ModuleManagerProps) {
  const { settings, updateSettings } = useEnterpriseSettings();
  const [localModules, setLocalModules] = useState<AppModuleConfig[]>(
    settings?.modules || []
  );

  const toggleModule = (moduleId: string) => {
    const updatedModules = localModules.map(module =>
      module.id === moduleId
        ? { ...module, enabled: !module.enabled }
        : module
    );
    setLocalModules(updatedModules);
  };

  const saveModules = async () => {
    if (settings) {
      await updateSettings({
        ...settings,
        modules: localModules,
      });
      onModulesUpdated(localModules);
    }
    onClose();
  };

  const getModuleIcon = (iconName: string) => {
    const IconComponent = MODULE_ICONS[iconName as keyof typeof MODULE_ICONS] || Settings;
    return IconComponent;
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
              <Text style={styles.modalTitle}>Module Manager</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                Enable or disable modules based on your organization's needs. 
                Only enabled modules will appear in the navigation.
              </Text>

              <View style={styles.modulesList}>
                {localModules.map((module) => {
                  const IconComponent = getModuleIcon(module.icon);
                  
                  return (
                    <View key={module.id} style={styles.moduleItem}>
                      <View style={styles.moduleInfo}>
                        <View style={[
                          styles.moduleIconContainer,
                          { backgroundColor: module.enabled ? '#EFF6FF' : '#F3F4F6' }
                        ]}>
                          <IconComponent 
                            size={20} 
                            color={module.enabled ? '#2563EB' : '#9CA3AF'} 
                          />
                        </View>
                        <View style={styles.moduleText}>
                          <Text style={[
                            styles.moduleName,
                            { color: module.enabled ? '#1F2937' : '#9CA3AF' }
                          ]}>
                            {module.name}
                          </Text>
                          <Text style={styles.modulePermissions}>
                            {module.permissions.join(', ')}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.moduleControls}>
                        <TouchableOpacity
                          style={styles.visibilityButton}
                          onPress={() => {}}
                        >
                          {module.enabled ? (
                            <Eye size={16} color="#6B7280" />
                          ) : (
                            <EyeOff size={16} color="#9CA3AF" />
                          )}
                        </TouchableOpacity>
                        
                        <Switch
                          value={module.enabled}
                          onValueChange={() => toggleModule(module.id)}
                          trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                          thumbColor={module.enabled ? '#2563EB' : '#F3F4F6'}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Module Permissions</Text>
              <View style={styles.permissionsInfo}>
                <Text style={styles.permissionItem}>
                  <Text style={styles.permissionType}>read:</Text> View data
                </Text>
                <Text style={styles.permissionItem}>
                  <Text style={styles.permissionType}>write:</Text> Create/Edit data
                </Text>
                <Text style={styles.permissionItem}>
                  <Text style={styles.permissionType}>admin:</Text> Administrative access
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveModules}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    maxHeight: 500,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  modulesList: {
    gap: 16,
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  moduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleText: {
    flex: 1,
  },
  moduleName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modulePermissions: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  moduleControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visibilityButton: {
    padding: 4,
  },
  permissionsInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  permissionItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  permissionType: {
    fontFamily: 'Inter-SemiBold',
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
  saveButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});