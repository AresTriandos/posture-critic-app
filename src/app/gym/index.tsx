import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';

type ExerciseType = 'squat' | 'deadlift' | 'bench' | 'row' | 'other';

interface Exercise {
  id: ExerciseType;
  name: string;
  emoji: string;
  description: string;
  targetMuscle: string;
}

const EXERCISES: Exercise[] = [
  {
    id: 'squat',
    name: 'Squat',
    emoji: '🦵',
    description: 'Lower body compound',
    targetMuscle: 'Legs',
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    emoji: '⬆️',
    description: 'Full body compound',
    targetMuscle: 'Posterior Chain',
  },
  {
    id: 'bench',
    name: 'Bench Press',
    emoji: '💪',
    description: 'Upper body pressing',
    targetMuscle: 'Chest',
  },
  {
    id: 'row',
    name: 'Row',
    emoji: '🤸',
    description: 'Upper body pulling',
    targetMuscle: 'Back',
  },
  {
    id: 'other',
    name: 'Other',
    emoji: '🎯',
    description: 'Custom exercise',
    targetMuscle: 'Any',
  },
];

export default function GymSelectScreen() {
  const router = useRouter();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);

  const handleStart = () => {
    if (selectedExercise) {
      router.push({
        pathname: '/gym/record',
        params: { exercise: selectedExercise },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Exercise</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Description */}
      <View style={styles.description}>
        <Text style={styles.descriptionText}>
          Choose the exercise you're performing to get posture-specific feedback
        </Text>
      </View>

      {/* Exercise Grid */}
      <FlatList
        data={EXERCISES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedExercise(item.id)}
            style={[
              styles.exerciseCard,
              selectedExercise === item.id && styles.exerciseCardSelected,
            ]}
          >
            <Text style={styles.exerciseEmoji}>{item.emoji}</Text>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseTarget}>{item.targetMuscle}</Text>
            <Text style={styles.exerciseDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
        numColumns={2}
        scrollEnabled={true}
        contentContainerStyle={styles.gridContent}
        style={styles.grid}
      />

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleStart}
          disabled={!selectedExercise}
          style={[
            styles.startButton,
            !selectedExercise && styles.startButtonDisabled,
          ]}
        >
          <Text style={styles.startButtonText}>
            {selectedExercise ? 'Start Recording' : 'Select an exercise'}
          </Text>
        </TouchableOpacity>
      </View>
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
  description: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  grid: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  exerciseCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minHeight: 140,
  },
  exerciseCardSelected: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  exerciseEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  exerciseTarget: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  exerciseDescription: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#CCC',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
