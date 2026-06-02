import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { PostureAngles, PostureScore } from '../services/angle-calculator';

interface AngleDisplayProps {
  angles: PostureAngles | null;
  score: PostureScore | null;
  style?: any;
}

/**
 * Angle Display Component
 * Shows real-time posture angles and scores
 */
export function AngleDisplay({ angles, score, style }: AngleDisplayProps) {
  const getAngleStatus = (angle: number, type: string): string => {
    switch (type) {
      case 'neck':
        return angle < 20 ? 'Perfect' : angle < 40 ? 'Good' : 'Forward';
      case 'spine':
        return angle > 85 ? 'Perfect' : angle > 70 ? 'Good' : 'Slouching';
      case 'shoulder':
        return Math.abs(angle) < 15 ? 'Level' : Math.abs(angle) < 30 ? 'Uneven' : 'Very Uneven';
      default:
        return 'Unknown';
    }
  };

  const getColorForAngle = (angle: number, type: string): string => {
    switch (type) {
      case 'neck':
        return angle < 20 ? '#4CAF50' : angle < 40 ? '#FFE66D' : '#FF6B6B';
      case 'spine':
        return angle > 85 ? '#4CAF50' : angle > 70 ? '#FFE66D' : '#FF6B6B';
      case 'shoulder':
        return Math.abs(angle) < 15 ? '#4CAF50' : Math.abs(angle) < 30 ? '#FFE66D' : '#FF6B6B';
      default:
        return '#999';
    }
  };

  if (!angles || !score) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.loadingText}>Calculating angles...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Overall Score */}
      <View style={styles.scoreSection}>
        <Text style={styles.scoreLabel}>Form Score</Text>
        <View
          style={[
            styles.scoreBadge,
            {
              backgroundColor:
                score.overallScore > 80
                  ? '#4CAF50'
                  : score.overallScore > 60
                    ? '#FFE66D'
                    : '#FF6B6B',
            },
          ]}
        >
          <Text style={styles.scoreValue}>{score.overallScore}</Text>
        </View>
      </View>

      {/* Angle Metrics */}
      <View style={styles.metricsContainer}>
        {/* Neck Angle */}
        <View style={styles.metricBox}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Neck</Text>
            <Text
              style={[
                styles.metricStatus,
                { color: getColorForAngle(angles.neckAngle, 'neck') },
              ]}
            >
              {getAngleStatus(angles.neckAngle, 'neck')}
            </Text>
          </View>
          <View style={styles.angleBar}>
            <View
              style={[
                styles.angleIndicator,
                {
                  width: `${(angles.neckAngle / 90) * 100}%`,
                  backgroundColor: getColorForAngle(angles.neckAngle, 'neck'),
                },
              ]}
            />
          </View>
          <Text style={styles.angleValue}>{angles.neckAngle.toFixed(1)}°</Text>
        </View>

        {/* Spine Angle */}
        <View style={styles.metricBox}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Spine</Text>
            <Text
              style={[
                styles.metricStatus,
                { color: getColorForAngle(angles.spineAngle, 'spine') },
              ]}
            >
              {getAngleStatus(angles.spineAngle, 'spine')}
            </Text>
          </View>
          <View style={styles.angleBar}>
            <View
              style={[
                styles.angleIndicator,
                {
                  width: `${(angles.spineAngle / 180) * 100}%`,
                  backgroundColor: getColorForAngle(angles.spineAngle, 'spine'),
                },
              ]}
            />
          </View>
          <Text style={styles.angleValue}>{angles.spineAngle.toFixed(1)}°</Text>
        </View>

        {/* Shoulder Lift */}
        <View style={styles.metricBox}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Shoulders</Text>
            <Text
              style={[
                styles.metricStatus,
                { color: getColorForAngle(angles.shoulderLift, 'shoulder') },
              ]}
            >
              {getAngleStatus(angles.shoulderLift, 'shoulder')}
            </Text>
          </View>
          <View style={styles.angleBar}>
            <View
              style={[
                styles.angleIndicator,
                {
                  width: `${(Math.abs(angles.shoulderLift) / 90) * 100}%`,
                  backgroundColor: getColorForAngle(angles.shoulderLift, 'shoulder'),
                },
              ]}
            />
          </View>
          <Text style={styles.angleValue}>{angles.shoulderLift.toFixed(1)}°</Text>
        </View>
      </View>

      {/* Issues */}
      {score.issues.length > 0 && (
        <View style={styles.issuesSection}>
          {score.issues.map((issue, index) => (
            <View key={index} style={styles.issueTag}>
              <Text style={styles.issueText}>{issue}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: 12,
    gap: 12,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scoreBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  metricsContainer: {
    gap: 10,
  },
  metricBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  metricStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  angleBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  angleIndicator: {
    height: '100%',
    borderRadius: 3,
  },
  angleValue: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'right',
  },
  issuesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  issueTag: {
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  issueText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
});
