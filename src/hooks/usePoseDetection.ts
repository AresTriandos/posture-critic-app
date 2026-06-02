import { useEffect, useState, useCallback } from 'react';
import { poseDetectionService } from '../services/pose-detection';
import {
  calculatePostureAngles,
  calculatePostureScore,
  PostureAngles,
  PostureScore,
} from '../services/angle-calculator';
import type { PoseLandmarks } from '../services/pose-detection';

interface PoseDetectionState {
  landmarks: PoseLandmarks | null;
  angles: PostureAngles | null;
  score: PostureScore | null;
  confidence: number;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for real-time pose detection
 * Manages MediaPipe pose detection and angle calculation
 */
export function usePoseDetection(isActive: boolean = false) {
  const [state, setState] = useState<PoseDetectionState>({
    landmarks: null,
    angles: null,
    score: null,
    confidence: 0,
    loading: true,
    error: null,
  });

  // Initialize MediaPipe on mount
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        if (!poseDetectionService.isInitialized()) {
          await poseDetectionService.initialize();
        }
        
        if (mounted) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: null,
          }));
        }
      } catch (error) {
        if (mounted) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to initialize pose detection',
          }));
        }
      }
    };

    if (isActive) {
      initialize();
    }

    return () => {
      mounted = false;
    };
  }, [isActive]);

  /**
   * Detect pose from an image source
   */
  const detectPose = useCallback(async (imageSource: any) => {
    if (!poseDetectionService.isInitialized()) {
      setState((prev) => ({
        ...prev,
        error: 'Pose detection not ready',
      }));
      return;
    }

    try {
      const landmarks = await poseDetectionService.detectPose(imageSource);

      if (landmarks) {
        // Validate pose
        if (!poseDetectionService.isValidPose(landmarks)) {
          setState((prev) => ({
            ...prev,
            error: 'Cannot detect clear pose. Please ensure full body is visible.',
          }));
          return;
        }

        // Calculate angles
        const angles = calculatePostureAngles(landmarks);
        const score = calculatePostureScore(angles);
        const confidence = poseDetectionService.getConfidenceScore(landmarks);

        setState({
          landmarks,
          angles,
          score,
          confidence,
          loading: false,
          error: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          error: 'No pose detected',
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Pose detection failed',
      }));
    }
  }, []);

  /**
   * Reset pose detection state
   */
  const reset = useCallback(() => {
    setState({
      landmarks: null,
      angles: null,
      score: null,
      confidence: 0,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (!isActive) {
        poseDetectionService.cleanup();
      }
    };
  }, [isActive]);

  return {
    ...state,
    detectPose,
    reset,
    isReady: poseDetectionService.isInitialized(),
  };
}
