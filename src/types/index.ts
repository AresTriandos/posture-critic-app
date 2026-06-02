/**
 * PostureCritic Type Definitions
 */

import { PostureAngles, PostureScore } from '../services/angle-calculator';

/**
 * Mode of operation
 */
export type PostureCriticMode = 'gym' | 'office' | 'correction';

/**
 * Exercise types (subset for v1)
 */
export type ExerciseType = 'squat' | 'deadlift' | 'bench' | 'row' | 'other';

/**
 * Posture session
 */
export interface PostureSession {
  id: string;
  type: PostureCriticMode;
  exercise?: ExerciseType;
  exerciseName?: string;
  
  startTime: Date;
  endTime: Date;
  duration: number; // seconds
  
  // Video/recording
  videoPath?: string;
  thumbnailPath?: string;
  
  // Metrics
  angles: PostureAngles[];
  scores: PostureScore[];
  
  // Analysis
  analysis?: PostureAnalysis;
  
  // Office mode specific
  slouchingMinutes?: number;
  breaksTaken?: number;
}

/**
 * Analysis result from Gemini
 */
export interface PostureAnalysis {
  exercise: string;
  score: number; // 0-100
  critique: string;
  keyCues: string[];
  
  // Posture-specific metrics
  postalIssues: string[];
  recommendations: string[];
  
  // For corrective exercise recommendations
  targetMuscles?: string[];
  recommendedExercises?: Exercise[];
  
  processingTime: number; // ms
}

/**
 * Exercise definition (from ExerciseDB)
 */
export interface Exercise {
  id: string;
  name: string;
  target: string;
  equipment: string;
  bodyPart: string;
  gifUrl: string;
  instructions: string[];
}

/**
 * Daily posture report
 */
export interface DailyReport {
  date: Date;
  mode: PostureCriticMode;
  
  // Session count
  totalSessions: number;
  totalDuration: number; // seconds
  
  // Metrics (office mode)
  totalSlounchingMinutes?: number;
  totalBreaksTaken?: number;
  
  // Scores
  avgScore: number;
  bestSession?: PostureSession;
  worstSession?: PostureSession;
  
  // Trends
  improvement: number; // percentage change from yesterday
  
  // Notes
  notes?: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
  mode: PostureCriticMode; // Default mode
  exerciseType?: ExerciseType; // Default exercise
  alertThreshold: number; // % deviation to trigger alert (office mode)
  alertIntervalSeconds: number; // How often to check posture
  recordingQuality: 'low' | 'medium' | 'high';
  enableNotifications: boolean;
}

/**
 * Cached exercise
 */
export interface CachedExercise extends Exercise {
  cachedAt: Date;
  expiresAt: Date;
}

/**
 * API Response types
 */
export interface AnalysisResponse {
  exercise: string;
  score: number;
  critique: string;
  keyCues: string[];
  processingTime: number;
}

/**
 * Error types
 */
export class PostureCriticError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}

export const ErrorCodes = {
  POSE_DETECTION_FAILED: 'POSE_DETECTION_FAILED',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  CAMERA_PERMISSION_DENIED: 'CAMERA_PERMISSION_DENIED',
  INVALID_VIDEO: 'INVALID_VIDEO',
  NETWORK_ERROR: 'NETWORK_ERROR',
  EXERCISE_NOT_FOUND: 'EXERCISE_NOT_FOUND',
} as const;
