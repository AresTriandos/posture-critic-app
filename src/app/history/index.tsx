import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAllSessions, deleteSession, getSessionStats } from '../../services/storage';
import type { PostureSession } from '../../types';

export default function HistoryScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<PostureSession[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load sessions when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [])
  );

  const loadSessions = async () => {
    try {
      setLoading(true);
      const loadedSessions = await getAllSessions();
      const loadedStats = await getSessionStats();
      setSessions(loadedSessions.reverse()); // Most recent first
      setStats(loadedStats);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      Alert.alert('Error', 'Failed to load session history');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  const handleDeleteSession = (id: string) => {
    Alert.alert(
      'Delete Session?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSession(id);
              await loadSessions();
              Alert.alert('Deleted', 'Session removed');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete session');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number | undefined) => {
    if (!score) return '#999';
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    return '#FF6B6B';
  };

  const renderSessionItem = ({ item }: { item: PostureSession }) => {
    const score = item.analysis?.score || item.scores[item.scores.length - 1]?.overallScore || 0;
    const exerciseName = item.exerciseName || 'Unknown';

    return (
      <TouchableOpacity
        style={styles.sessionCard}
        onPress={() => {
          // Could navigate to session detail screen
          Alert.alert(
            exerciseName,
            `Score: ${score}\n` +
            `Time: ${item.duration}s\n` +
            `Date: ${formatDate(item.startTime)}`
          );
        }}
      >
        <View style={styles.sessionLeft}>
          <Text style={styles.sessionExercise}>{exerciseName}</Text>
          <Text style={styles.sessionDate}>{formatDate(item.startTime)}</Text>
          <Text style={styles.sessionType}>
            {item.type === 'gym' ? '🏋️ Gym' : item.type === 'office' ? '💼 Office' : '🧘 Correction'}
          </Text>
        </View>

        <View style={styles.sessionRight}>
          <View
            style={[
              styles.scoreCircle,
              { borderColor: getScoreColor(score) },
            ]}
          >
            <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>
              {score}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleDeleteSession(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Session History</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Sessions Yet</Text>
          <Text style={styles.emptyText}>
            Start your first session to see it here
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/gym')}
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>Start Recording</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Statistics */}
          {stats && (
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Sessions</Text>
                <Text style={styles.statValue}>{stats.totalSessions}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Gym Sessions</Text>
                <Text style={styles.statValue}>{stats.gymSessions}</Text>
              </View>
              {stats.avgScore > 0 && (
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Avg Score</Text>
                  <Text style={styles.statValue}>
                    {Math.round(stats.avgScore)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Sessions List */}
          <FlatList
            data={sessions}
            renderItem={renderSessionItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#FF6B6B"
              />
            }
          />
        </>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionLeft: {
    flex: 1,
  },
  sessionExercise: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 12,
    color: '#666',
  },
  sessionRight: {
    alignItems: 'center',
    gap: 8,
  },
  scoreCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});
