import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import type { PoseLandmarks, Landmark } from '../services/pose-detection';

interface PoseOverlayProps {
  landmarks: PoseLandmarks | null;
  confidence: number;
  style?: any;
}

const { width, height } = Dimensions.get('window');

/**
 * Pose Overlay Component
 * Displays skeleton visualization of detected pose
 */
export function PoseOverlay({ landmarks, confidence, style }: PoseOverlayProps) {
  if (!landmarks) {
    return (
      <View style={[styles.overlay, style]}>
        <Text style={styles.message}>Detecting posture...</Text>
      </View>
    );
  }

  const getPointPosition = (landmark: Landmark | undefined) => {
    if (!landmark) return null;
    return {
      x: landmark.x * width,
      y: landmark.y * height,
    };
  };

  const drawLine = (
    start: Landmark | undefined,
    end: Landmark | undefined
  ): React.ReactNode => {
    const startPos = getPointPosition(start);
    const endPos = getPointPosition(end);

    if (!startPos || !endPos) return null;

    const lineWidth = Math.sqrt(
      Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
    );
    const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);

    return (
      <View
        key={`line-${start?.x}-${start?.y}`}
        style={[
          styles.line,
          {
            left: startPos.x,
            top: startPos.y,
            width: lineWidth,
            transform: [{ rotate: `${angle}rad` }],
            borderBottomColor: getLineColor(start?.visibility, end?.visibility),
          },
        ]}
      />
    );
  };

  const getLineColor = (
    startVis?: number,
    endVis?: number
  ): string => {
    const avgVis = ((startVis || 0) + (endVis || 0)) / 2;
    if (avgVis > 0.7) return '#4ECDC4'; // Cyan
    if (avgVis > 0.5) return '#FFE66D'; // Yellow
    return '#FF6B6B'; // Red
  };

  const drawPoint = (
    landmark: Landmark | undefined,
    key: string
  ): React.ReactNode => {
    const pos = getPointPosition(landmark);
    if (!pos) return null;

    const visibility = landmark?.visibility || 0;
    const isVisible = visibility > 0.5;
    const size = isVisible ? 8 : 6;
    const color = visibility > 0.7 ? '#4ECDC4' : visibility > 0.5 ? '#FFE66D' : '#FF6B6B';

    return (
      <View
        key={key}
        style={[
          styles.point,
          {
            left: pos.x - size / 2,
            top: pos.y - size / 2,
            width: size,
            height: size,
            backgroundColor: color,
            opacity: isVisible ? 1 : 0.3,
          },
        ]}
      />
    );
  };

  if (!landmarks) return null;

  return (
    <View style={[styles.overlay, style]}>
      {/* Draw skeleton lines */}
      {/* Head */}
      {drawLine(landmarks.leftEar, landmarks.rightEar)}
      {drawLine(landmarks.nose, landmarks.leftEye)}
      {drawLine(landmarks.nose, landmarks.rightEye)}

      {/* Shoulders to Hips */}
      {drawLine(landmarks.leftShoulder, landmarks.rightShoulder)}
      {drawLine(landmarks.leftShoulder, landmarks.leftHip)}
      {drawLine(landmarks.rightShoulder, landmarks.rightHip)}
      {drawLine(landmarks.leftHip, landmarks.rightHip)}

      {/* Left Side */}
      {drawLine(landmarks.leftShoulder, landmarks.leftElbow)}
      {drawLine(landmarks.leftElbow, landmarks.leftWrist)}
      {drawLine(landmarks.leftHip, landmarks.leftKnee)}
      {drawLine(landmarks.leftKnee, landmarks.leftAnkle)}

      {/* Right Side */}
      {drawLine(landmarks.rightShoulder, landmarks.rightElbow)}
      {drawLine(landmarks.rightElbow, landmarks.rightWrist)}
      {drawLine(landmarks.rightHip, landmarks.rightKnee)}
      {drawLine(landmarks.rightKnee, landmarks.rightAnkle)}

      {/* Draw points */}
      {/* Head */}
      {drawPoint(landmarks.nose, 'nose')}
      {drawPoint(landmarks.leftEye, 'leftEye')}
      {drawPoint(landmarks.rightEye, 'rightEye')}
      {drawPoint(landmarks.leftEar, 'leftEar')}
      {drawPoint(landmarks.rightEar, 'rightEar')}

      {/* Shoulders & Hips */}
      {drawPoint(landmarks.leftShoulder, 'leftShoulder')}
      {drawPoint(landmarks.rightShoulder, 'rightShoulder')}
      {drawPoint(landmarks.leftHip, 'leftHip')}
      {drawPoint(landmarks.rightHip, 'rightHip')}

      {/* Limbs */}
      {drawPoint(landmarks.leftElbow, 'leftElbow')}
      {drawPoint(landmarks.rightElbow, 'rightElbow')}
      {drawPoint(landmarks.leftWrist, 'leftWrist')}
      {drawPoint(landmarks.rightWrist, 'rightWrist')}
      {drawPoint(landmarks.leftKnee, 'leftKnee')}
      {drawPoint(landmarks.rightKnee, 'rightKnee')}
      {drawPoint(landmarks.leftAnkle, 'leftAnkle')}
      {drawPoint(landmarks.rightAnkle, 'rightAnkle')}

      {/* Confidence Indicator */}
      <View style={styles.confidenceContainer}>
        <View style={styles.confidenceBar}>
          <View
            style={[
              styles.confidenceIndicator,
              {
                width: `${confidence}%`,
                backgroundColor: confidence > 70 ? '#4CAF50' : confidence > 50 ? '#FFE66D' : '#FF6B6B',
              },
            ]}
          />
        </View>
        <Text style={styles.confidenceText}>{Math.round(confidence)}% Confidence</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#4ECDC4',
    transformOrigin: 'left center',
  },
  point: {
    position: 'absolute',
    borderRadius: 4,
  },
  confidenceContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    gap: 8,
  },
  confidenceBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceIndicator: {
    height: '100%',
    borderRadius: 2,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
