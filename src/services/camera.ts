import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PhotoRecord {
  id: string;
  uri: string;
  timestamp: number;
  analysis?: string;
}

/**
 * Request camera permissions
 */
export async function requestCameraPermission() {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to request camera permission:', error);
    return false;
  }
}

/**
 * Check if camera permissions are granted
 */
export async function checkCameraPermission() {
  try {
    const { status } = await Camera.getCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to check camera permission:', error);
    return false;
  }
}

/**
 * Save photo record to AsyncStorage
 */
export async function savePhotoRecord(record: PhotoRecord) {
  try {
    const existing = await getPhotoRecords();
    const updated = [record, ...existing];
    await AsyncStorage.setItem('photo_records', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save photo record:', error);
    return false;
  }
}

/**
 * Get all saved photo records
 */
export async function getPhotoRecords(): Promise<PhotoRecord[]> {
  try {
    const data = await AsyncStorage.getItem('photo_records');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get photo records:', error);
    return [];
  }
}

/**
 * Delete a photo record
 */
export async function deletePhotoRecord(id: string) {
  try {
    const existing = await getPhotoRecords();
    const filtered = existing.filter((r) => r.id !== id);
    await AsyncStorage.setItem('photo_records', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete photo record:', error);
    return false;
  }
}

/**
 * Generate unique ID for photo
 */
export function generatePhotoId() {
  return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
