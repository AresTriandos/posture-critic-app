/**
 * Storage Service
 * Handles session persistence using Expo SecureStore
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PostureSession } from '../types';

const SESSIONS_KEY = 'posture_critic_sessions';
const PREFERENCES_KEY = 'posture_critic_preferences';

/**
 * Save a session
 */
export async function saveSession(session: PostureSession): Promise<void> {
  try {
    const sessions = await getAllSessions();
    const updated = [...sessions, session];
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save session:', error);
    throw error;
  }
}

/**
 * Get all sessions
 */
export async function getAllSessions(): Promise<PostureSession[]> {
  try {
    const data = await AsyncStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get sessions:', error);
    return [];
  }
}

/**
 * Get sessions by type
 */
export async function getSessionsByType(
  type: 'gym' | 'office' | 'correction'
): Promise<PostureSession[]> {
  try {
    const sessions = await getAllSessions();
    return sessions.filter((s) => s.type === type);
  } catch (error) {
    console.error('Failed to filter sessions:', error);
    return [];
  }
}

/**
 * Get a specific session by ID
 */
export async function getSessionById(id: string): Promise<PostureSession | null> {
  try {
    const sessions = await getAllSessions();
    return sessions.find((s) => s.id === id) || null;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

/**
 * Update a session
 */
export async function updateSession(session: PostureSession): Promise<void> {
  try {
    const sessions = await getAllSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (index !== -1) {
      sessions[index] = session;
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
  } catch (error) {
    console.error('Failed to update session:', error);
    throw error;
  }
}

/**
 * Delete a session
 */
export async function deleteSession(id: string): Promise<void> {
  try {
    const sessions = await getAllSessions();
    const filtered = sessions.filter((s) => s.id !== id);
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete session:', error);
    throw error;
  }
}

/**
 * Clear all sessions
 */
export async function clearAllSessions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSIONS_KEY);
  } catch (error) {
    console.error('Failed to clear sessions:', error);
    throw error;
  }
}

/**
 * Get session statistics
 */
export async function getSessionStats() {
  try {
    const sessions = await getAllSessions();
    const gymSessions = sessions.filter((s) => s.type === 'gym');
    const officeSessions = sessions.filter((s) => s.type === 'office');

    return {
      totalSessions: sessions.length,
      gymSessions: gymSessions.length,
      officeSessions: officeSessions.length,
      avgScore: gymSessions.length > 0
        ? gymSessions.reduce((sum, s) => {
            const score = s.analysis?.score || 0;
            return sum + score;
          }, 0) / gymSessions.length
        : 0,
      lastSession: sessions[sessions.length - 1] || null,
    };
  } catch (error) {
    console.error('Failed to get stats:', error);
    return {
      totalSessions: 0,
      gymSessions: 0,
      officeSessions: 0,
      avgScore: 0,
      lastSession: null,
    };
  }
}

/**
 * Export sessions as JSON
 */
export async function exportSessions(): Promise<string> {
  try {
    const sessions = await getAllSessions();
    return JSON.stringify(sessions, null, 2);
  } catch (error) {
    console.error('Failed to export sessions:', error);
    throw error;
  }
}

/**
 * Import sessions from JSON
 */
export async function importSessions(jsonData: string): Promise<void> {
  try {
    const sessions = JSON.parse(jsonData) as PostureSession[];
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to import sessions:', error);
    throw error;
  }
}

/**
 * Get sessions since a certain date
 */
export async function getSessionsSince(date: Date): Promise<PostureSession[]> {
  try {
    const sessions = await getAllSessions();
    return sessions.filter((s) => new Date(s.startTime) >= date);
  } catch (error) {
    console.error('Failed to get sessions since date:', error);
    return [];
  }
}

/**
 * Get average score for a session type
 */
export async function getAverageScore(type: 'gym' | 'office'): Promise<number> {
  try {
    const sessions = await getSessionsByType(type);
    if (sessions.length === 0) return 0;

    const total = sessions.reduce((sum, s) => {
      return sum + (s.analysis?.score || s.scores[s.scores.length - 1]?.overallScore || 0);
    }, 0);

    return total / sessions.length;
  } catch (error) {
    console.error('Failed to get average score:', error);
    return 0;
  }
}
