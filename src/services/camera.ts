import * as Camera from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VideoRecord {
  id: string;
  uri: string;
  timestamp: number;
  duration?: number;
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
 * Save video record to AsyncStorage
 */
export async function saveVideoRecord(record: VideoRecord) {
  try {
    const existing = await getVideoRecords();
    const updated = [record, ...existing];
    await AsyncStorage.setItem('video_records', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save video record:', error);
    return false;
  }
}

/**
 * Get all saved video records
 */
export async function getVideoRecords(): Promise<VideoRecord[]> {
  try {
    const data = await AsyncStorage.getItem('video_records');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get video records:', error);
    return [];
  }
}

/**
 * Delete a video record
 */
export async function deleteVideoRecord(id: string) {
  try {
    const existing = await getVideoRecords();
    const filtered = existing.filter((r) => r.id !== id);
    await AsyncStorage.setItem('video_records', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete video record:', error);
    return false;
  }
}

/**
 * Generate unique ID for video
 */
export function generateVideoId() {
  return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
