import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Auth specific methods
  static async setAuthToken(token: string): Promise<void> {
    await this.setItem('auth_token', token);
  }

  static async getAuthToken(): Promise<string | null> {
    return await this.getItem<string>('auth_token');
  }

  static async removeAuthToken(): Promise<void> {
    await this.removeItem('auth_token');
  }

  // User data methods
  static async setUserData(userData: any): Promise<void> {
    await this.setItem('user_data', userData);
  }

  static async getUserData(): Promise<any | null> {
    return await this.getItem('user_data');
  }

  static async removeUserData(): Promise<void> {
    await this.removeItem('user_data');
  }
}