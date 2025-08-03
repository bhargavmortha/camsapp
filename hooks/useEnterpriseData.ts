import { useState, useEffect, useCallback } from 'react';
import { enterpriseApi, AttendanceData } from '../services/enterpriseApi';
import { EnterpriseSettings } from '../config/api';
import { StorageService } from '../utils/storage';

export function useEnterpriseData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const syncData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await enterpriseApi.syncData();
      if (response.success) {
        setLastSync(new Date());
        await StorageService.setItem('last_sync', new Date().toISOString());
      } else {
        setError(response.error || 'Sync failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load last sync time
    const loadLastSync = async () => {
      const lastSyncStr = await StorageService.getItem<string>('last_sync');
      if (lastSyncStr) {
        setLastSync(new Date(lastSyncStr));
      }
    };
    
    loadLastSync();
    
    // Auto-sync every 5 minutes
    const interval = setInterval(syncData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [syncData]);

  return {
    isLoading,
    error,
    lastSync,
    syncData,
  };
}

export function useAttendanceData(userId: string) {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async (startDate?: string, endDate?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Default to current month if no dates provided
      const today = new Date();
      const defaultStartDate = startDate || new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString().slice(0, 10).replace(/-/g, '');
      const defaultEndDate = endDate || new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString().slice(0, 10).replace(/-/g, '');

      const response = await enterpriseApi.getAttendanceData(
        userId,
        defaultStartDate,
        defaultEndDate
      );

      if (response.success && response.data) {
        setAttendanceData(response.data);
        // Cache the data
        await StorageService.setItem(`attendance_${userId}`, response.data);
      } else {
        setError(response.error || 'Failed to fetch attendance data');
        // Try to load cached data
        const cachedData = await StorageService.getItem<AttendanceData[]>(`attendance_${userId}`);
        if (cachedData) {
          setAttendanceData(cachedData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
      // Try to load cached data
      const cachedData = await StorageService.getItem<AttendanceData[]>(`attendance_${userId}`);
      if (cachedData) {
        setAttendanceData(cachedData);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAttendance();
    }
  }, [userId, fetchAttendance]);

  return {
    attendanceData,
    isLoading,
    error,
    refetch: fetchAttendance,
  };
}

export function useEnterpriseSettings() {
  const [settings, setSettings] = useState<EnterpriseSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to load from cache first
      const cachedSettings = await StorageService.getItem<EnterpriseSettings>('enterprise_settings');
      if (cachedSettings) {
        setSettings(cachedSettings);
      }

      // Fetch fresh settings
      const response = await enterpriseApi.getEnterpriseSettings();
      if (response.success && response.data) {
        setSettings(response.data);
        await StorageService.setItem('enterprise_settings', response.data);
      } else if (!cachedSettings) {
        setError(response.error || 'Failed to load settings');
      }
    } catch (err) {
      if (!settings) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      }
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const updateSettings = useCallback(async (newSettings: Partial<EnterpriseSettings>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await enterpriseApi.updateEnterpriseSettings(newSettings);
      if (response.success) {
        const updatedSettings = { ...settings, ...newSettings } as EnterpriseSettings;
        setSettings(updatedSettings);
        await StorageService.setItem('enterprise_settings', updatedSettings);
      } else {
        setError(response.error || 'Failed to update settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refetch: loadSettings,
  };
}