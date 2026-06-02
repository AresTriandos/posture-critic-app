/**
 * Angle Calculator Service
 * Calculates posture angles from MediaPipe landmarks
 */

import { Landmark, PoseLandmarks } from './pose-detection';

export interface PostureAngles {
  neckAngle: number;          // 0-90° (0 = perfect, 90 = extreme forward)
  spineAngle: number;         // 0-180° (90 = upright, <90 = slouching)
  shoulderLift: number;       // -90 to 90° (left shoulder angle - right shoulder angle)
  kneeAngle?: number;         // For gym mode (standing exercises)
  hipAngle?: number;          // For gym mode
  ankleAngle?: number;        // For gym mode
  timestamp: Date;
}

export interface PostureScore {
  neckScore: number;          // 0-100 (higher = better)
  spineScore: number;         // 0-100 (higher = better)
  shoulderScore: number;      // 0-100 (higher = better)
  overallScore: number;       // 0-100 (higher = better)
  issues: string[];           // List of detected issues
}

/**
 * Calculate angle between three points
 * @param p1 First point
 * @param p2 Vertex point (center)
 * @param p3 Third point
 * @returns Angle in degrees (0-180)
 */
function calculateAngle(p1: Landmark, p2: Landmark, p3: Landmark): number {
  const dx1 = p1.x - p2.x;
  const dy1 = p1.y - p2.y;
  const dx2 = p3.x - p2.x;
  const dy2 = p3.y - p2.y;

  const dotProduct = dx1 * dx2 + dy1 * dy2;
  const magnitude1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const magnitude2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  const cosAngle = dotProduct / (magnitude1 * magnitude2);
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
  
  return (angle * 180) / Math.PI;
}

/**
 * Calculate forward head posture angle
 * Measures angle between ear, shoulder, and hip (neck angle)
 * 0° = perfect (head over shoulders)
 * 90° = extreme forward (head far ahead of shoulders)
 */
function calculateNeckAngle(landmarks: PoseLandmarks): number {
  const ear = landmarks.rightEar;
  const shoulder = landmarks.rightShoulder;
  const hip = landmarks.rightHip;

  if (!ear || !shoulder || !hip) return 0;

  // Calculate the angle of the line from shoulder to ear relative to vertical
  const dx = ear.x - shoulder.x;
  const dy = ear.y - shoulder.y;

  // Convert to angle (0° = perfect posture, 90° = extreme forward)
  const angle = Math.atan2(dx, -dy) * (180 / Math.PI);
  
  // Normalize to 0-90 range
  return Math.max(0, Math.min(90, Math.abs(angle)));
}

/**
 * Calculate spine angle (curvature)
 * Measures angle between shoulders and hips
 * 90° = upright, <90° = slouching
 */
function calculateSpineAngle(landmarks: PoseLandmarks): number {
  const leftShoulder = landmarks.leftShoulder;
  const rightShoulder = landmarks.rightShoulder;
  const leftHip = landmarks.leftHip;
  const rightHip = landmarks.rightHip;

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return 0;

  // Get midpoint of shoulders and hips
  const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
  const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
  const hipMidX = (leftHip.x + rightHip.x) / 2;
  const hipMidY = (leftHip.y + rightHip.y) / 2;

  // Calculate spine angle (deviation from vertical)
  const dx = hipMidX - shoulderMidX;
  const dy = hipMidY - shoulderMidY;

  const angle = Math.atan2(dx, dy) * (180 / Math.PI);
  
  // 90° = upright spine
  return Math.max(0, Math.min(180, 90 + angle));
}

/**
 * Calculate shoulder imbalance
 * Negative = left shoulder higher, Positive = right shoulder higher
 */
function calculateShoulderLift(landmarks: PoseLandmarks): number {
  const leftShoulder = landmarks.leftShoulder;
  const rightShoulder = landmarks.rightShoulder;

  if (!leftShoulder || !rightShoulder) return 0;

  // Y position difference (0 = level, negative = left higher)
  const shoulderDiff = (rightShoulder.y - leftShoulder.y) * 100;
  
  return Math.max(-90, Math.min(90, shoulderDiff));
}

/**
 * Calculate knee angle (for squats, lunges, etc.)
 */
function calculateKneeAngle(landmarks: PoseLandmarks): number {
  const hip = landmarks.rightHip;
  const knee = landmarks.rightKnee;
  const ankle = landmarks.rightAnkle;

  if (!hip || !knee || !ankle) return 0;

  return calculateAngle(hip, knee, ankle);
}

/**
 * Calculate hip angle (for lunges, deadlifts, etc.)
 */
function calculateHipAngle(landmarks: PoseLandmarks): number {
  const shoulder = landmarks.rightShoulder;
  const hip = landmarks.rightHip;
  const knee = landmarks.rightKnee;

  if (!shoulder || !hip || !knee) return 0;

  return calculateAngle(shoulder, hip, knee);
}

/**
 * Main function to calculate all posture angles
 */
export function calculatePostureAngles(landmarks: PoseLandmarks): PostureAngles {
  return {
    neckAngle: calculateNeckAngle(landmarks),
    spineAngle: calculateSpineAngle(landmarks),
    shoulderLift: calculateShoulderLift(landmarks),
    kneeAngle: calculateKneeAngle(landmarks),
    hipAngle: calculateHipAngle(landmarks),
    timestamp: new Date(),
  };
}

/**
 * Convert angles to posture scores (0-100)
 * and identify issues
 */
export function calculatePostureScore(angles: PostureAngles): PostureScore {
  const issues: string[] = [];

  // Neck angle scoring (0° = 100, 45° = 50, 90° = 0)
  const neckScore = Math.max(0, 100 - angles.neckAngle * 1.1);
  if (angles.neckAngle > 30) {
    issues.push('Forward head posture detected');
  }

  // Spine angle scoring (90° = 100, 70° = 50, <50° = 0)
  const spineScore = Math.max(0, Math.min(100, (angles.spineAngle - 50) * 2));
  if (angles.spineAngle < 70) {
    issues.push('Slouching detected - straighten up!');
  }

  // Shoulder lift scoring (0° = 100, uneven = lower score)
  const shoulderScore = Math.max(0, 100 - Math.abs(angles.shoulderLift) * 2);
  if (Math.abs(angles.shoulderLift) > 15) {
    issues.push('Uneven shoulders detected');
  }

  // Overall score (average of component scores)
  const overallScore = Math.round((neckScore + spineScore + shoulderScore) / 3);

  return {
    neckScore: Math.round(neckScore),
    spineScore: Math.round(spineScore),
    shoulderScore: Math.round(shoulderScore),
    overallScore,
    issues,
  };
}

/**
 * Track posture over time and identify trends
 */
export function analyzePostureTrend(
  angles: PostureAngles[],
): {
  trend: 'improving' | 'declining' | 'stable';
  avgScore: number;
  worstScore: number;
  bestScore: number;
} {
  if (angles.length === 0) {
    return {
      trend: 'stable',
      avgScore: 0,
      worstScore: 0,
      bestScore: 0,
    };
  }

  const scores = angles.map((a) => calculatePostureScore(a).overallScore);
  const avgScore = Math.round(scores.reduce((a, b) => a + b) / scores.length);
  const worstScore = Math.min(...scores);
  const bestScore = Math.max(...scores);

  // Determine trend (comparing first half vs second half)
  const midpoint = Math.floor(scores.length / 2);
  const firstHalf = scores.slice(0, midpoint).reduce((a, b) => a + b) / midpoint;
  const secondHalf =
    scores.slice(midpoint).reduce((a, b) => a + b) / (scores.length - midpoint);

  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (secondHalf > firstHalf + 5) {
    trend = 'improving';
  } else if (secondHalf < firstHalf - 5) {
    trend = 'declining';
  }

  return {
    trend,
    avgScore,
    worstScore,
    bestScore,
  };
}

/**
 * Get posture recommendations based on detected issues
 */
export function getPostureRecommendations(issues: string[]): string[] {
  const recommendations: { [key: string]: string } = {
    'Forward head posture detected': 'Do neck stretches and chin tucks',
    'Slouching detected - straighten up!': 'Engage your core and pull shoulders back',
    'Uneven shoulders detected': 'Check your workspace ergonomics',
  };

  return issues
    .map((issue) => recommendations[issue])
    .filter((rec) => rec !== undefined);
}
