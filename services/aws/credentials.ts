import * as SecureStore from 'expo-secure-store'
import { AWSCredentials } from '@/types/aws';
import { Platform } from 'react-native';

const CREDENTIAL_KEY = "aws_credentials_secure"

export class CredentialsService {
  static async saveCredentials(credentials: AWSCredentials): Promise<boolean> {
    try {
      if(Platform.OS === 'web') {
        localStorage.setItem(CREDENTIAL_KEY, JSON.stringify(credentials));
        return true;
      } else {
        await SecureStore.setItemAsync(
          CREDENTIAL_KEY,
          JSON.stringify(credentials),
          {
            requireAuthentication: true,
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
          }
        );
        return true;
      }
    } catch (err) {
      console.error("Failed to save credentials: ", err);
      throw new Error("Failed to save credentials");
    }
  }

  static async getCredentials(): Promise<AWSCredentials | null> {
    try {
      let credentialsJson;
      if(Platform.OS === 'web') {
        credentialsJson = localStorage.getItem(CREDENTIAL_KEY);
      } else {
        credentialsJson = await SecureStore.getItemAsync(CREDENTIAL_KEY);
      }

      if(!credentialsJson) return null;

      return JSON.parse(credentialsJson) as AWSCredentials;
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      return null;
    }
  }

  static async clearCredentials(): Promise<boolean> {
    try {
      if(Platform.OS === 'web') {
        localStorage.removeItem(CREDENTIAL_KEY);
      } else {
        await SecureStore.deleteItemAsync(CREDENTIAL_KEY)
      }

      return true;
    } catch (err) {
      console.error("error occurred while deleting credentials: ", err);
      return false;
    }
  }

  static async hasCredentials(): Promise<boolean> {
    const credentials = await this.getCredentials();
    return credentials !== null;
  }
}