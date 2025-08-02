import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Bell, Shield, Download, CreditCard as Edit, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const profileData = {
    name: 'John Doe',
    employeeId: 'EMP001',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    position: 'Senior Software Developer',
    joiningDate: '2022-01-15',
    manager: 'Sarah Wilson',
    location: 'New York Office',
  };

  const menuItems = [
    {
      icon: Download,
      title: 'Download Pay Slip',
      subtitle: 'December 2024',
      action: () => {},
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      action: () => {},
      hasSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled,
    },
    {
      icon: MapPin,
      title: 'Location Services',
      subtitle: 'Allow location for attendance',
      action: () => {},
      hasSwitch: true,
      switchValue: locationEnabled,
      onSwitchChange: setLocationEnabled,
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Manage your data and privacy',
      action: () => {},
    },
    {
      icon: LogOut,
      title: 'Sign Out',
      subtitle: 'Log out of your account',
      action: () => {},
      isDestructive: true,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Edit size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={40} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.employeeId}>ID: {profileData.employeeId}</Text>
            <Text style={styles.position}>{profileData.position}</Text>
          </View>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Mail size={20} color="#6B7280" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profileData.email}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Phone size={20} color="#6B7280" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profileData.phone}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <MapPin size={20} color="#6B7280" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{profileData.location}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Work Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Briefcase size={20} color="#6B7280" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{profileData.department}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Calendar size={20} color="#6B7280" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Joining Date</Text>
              <Text style={styles.infoValue}>{profileData.joiningDate}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <User size={20} color="#6B7280" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Reporting Manager</Text>
              <Text style={styles.infoValue}>{profileData.manager}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Settings Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings & Actions</Text>
        
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.menuItem,
                item.isDestructive && styles.destructiveMenuItem,
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={item.action}
            >
              <View style={styles.menuItemLeft}>
                <View style={[
                  styles.menuIconContainer,
                  item.isDestructive && styles.destructiveIconContainer
                ]}>
                  <item.icon 
                    size={20} 
                    color={item.isDestructive ? '#DC2626' : '#6B7280'} 
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[
                    styles.menuTitle,
                    item.isDestructive && styles.destructiveMenuTitle
                  ]}>
                    {item.title}
                  </Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              
              {item.hasSwitch ? (
                <Switch
                  value={item.switchValue}
                  onValueChange={item.onSwitchChange}
                  trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                  thumbColor={item.switchValue ? '#2563EB' : '#F3F4F6'}
                />
              ) : (
                <ChevronRight size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          ))}
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
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  editButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#2563EB',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  employeeId: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  position: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginHorizontal: 24,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  destructiveMenuItem: {
    borderBottomColor: '#FEE2E2',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  destructiveIconContainer: {
    backgroundColor: '#FEE2E2',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  destructiveMenuTitle: {
    color: '#DC2626',
  },
  menuSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
});