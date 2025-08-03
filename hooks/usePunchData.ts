import { useState, useEffect, useCallback } from 'react';
import { camsApi, PunchData, EmployeeSession } from '../services/camsApi';

export function usePunchData(userId?: string) {
  const [punchData, setPunchData] = useState<PunchData[]>([]);
  const [todaysPunch, setTodaysPunch] = useState<PunchData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const fetchPunchData = useCallback(async (employeeId?: string) => {
    if (!employeeId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch current month data
      const monthResponse = await camsApi.getCurrentMonthPunchData(employeeId);
      
      if (monthResponse.success && monthResponse.data) {
        setPunchData(monthResponse.data);
        
        // Get today's data
        const today = new Date().toISOString().slice(0, 10);
        const todayRecord = monthResponse.data.find(record => {
          const recordDate = record.PROCESSDATE.split('/').reverse().join('-');
          return recordDate === today;
        });
        
        setTodaysPunch(todayRecord || null);
        setLastSync(new Date());
      } else {
        setError(monthResponse.error || 'Failed to fetch punch data');
        // Use cached data if available
        if (monthResponse.data) {
          setPunchData(monthResponse.data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch punch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    const session = await camsApi.getCurrentSession();
    if (session) {
      await fetchPunchData(session.userId);
    }
  }, [fetchPunchData]);

  useEffect(() => {
    if (userId) {
      fetchPunchData(userId);
    }
  }, [userId, fetchPunchData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(refreshData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    punchData,
    todaysPunch,
    isLoading,
    error,
    lastSync,
    refetch: refreshData,
  };
}

export function useEmployeeAuth() {
  const [session, setSession] = useState<EmployeeSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (employeeId: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await camsApi.authenticateEmployee({ employeeId, password });
      
      if (response.success && response.data) {
        setSession(response.data);
        return true;
      } else {
        setError(response.error || 'Login failed');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await camsApi.logout();
    setSession(null);
  }, []);

  const checkSession = useCallback(async () => {
    const storedSession = await camsApi.getCurrentSession();
    setSession(storedSession);
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    session,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!session,
  };
}