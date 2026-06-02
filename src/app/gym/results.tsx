import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { analysisService, type AnalysisResult } from '../../services/analysis';

export default function GymResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const exercise = (params.exercise as string) || 'Exercise';
  const videoUri = (params.video as string) || null;

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Call Lambda to analyze posture
  useEffect(() => {
    const runAnalysis = async () => {
      if (!videoUri) {
        setError('No video provided for analysis');
        setLoading(false);
        return;
      }

      try {
        console.log('Analyzing video:', videoUri);
        const result = await analysisService.analyzePosture(videoUri, exercise);
        setAnalysis(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
        console.error('Analysis error:', errorMessage);
        setError(errorMessage);
        Alert.alert('Analysis Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [videoUri, exercise]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    return '#FF6B6B';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{exercise}</Text>
        <Text style={styles.headerSubtitle}>Form Analysis</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Analyzing your posture...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.errorButton}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          {/* Score Card */}
          {analysis && (
            <>
              <View style={[styles.scoreCard, { borderColor: getScoreColor(analysis.score) }]}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreValue}>{analysis.score}</Text>
                  <Text style={styles.scoreMax}>/100</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text style={[styles.scoreLabel, { color: getScoreColor(analysis.score) }]}>
                    {getScoreLabel(analysis.score)}
                  </Text>
                  <Text style={styles.scoreSubtitle}>Posture Quality</Text>
                </View>
              </View>

              {/* AI Feedback */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alignment Feedback</Text>
                <View style={styles.critiqueBox}>
                  <Text style={styles.critiqueText}>{analysis.alignmentFeedback}</Text>
                </View>
              </View>

              {/* Key Improvement Cues */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Improvements</Text>
                {analysis.keyCues.map((cue, index) => (
                  <View key={index} style={styles.cueItem}>
                    <Text style={styles.cueNumber}>{index + 1}</Text>
                    <Text style={styles.cueText}>{cue}</Text>
                  </View>
                ))}
              </View>

              {/* Processing Time */}
              <View style={styles.section}>
                <Text style={styles.processingTime}>
                  ⏱️ Analysis completed in {(analysis.processingTime / 1000).toFixed(1)}s
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* Action Buttons */}
      {!loading && (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => router.push('/gym')}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Try Another Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/history')}
            style={[styles.actionButton, styles.actionButtonSecondary]}
          >
            <Text style={[styles.actionButtonText, styles.actionButtonSecondaryText]}>
              View History
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  scoreCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 3,
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  scoreMax: {
    fontSize: 14,
    color: '#999',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },

  critiqueBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  critiqueText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  cueItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'flex-start',
    gap: 12,
  },
  cueNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
    minWidth: 24,
  },
  cueText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  issueItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'flex-start',
    gap: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
  },
  issueIcon: {
    fontSize: 18,
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButtonSecondaryText: {
    color: '#FF6B6B',
  },
  processingTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
