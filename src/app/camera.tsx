import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      setRecordingTime(0);
      try {
        const video = await cameraRef.current.recordAsync();
        console.log('Video recorded:', video);
        // Handle video analysis here
      } catch (error) {
        console.error('Recording failed:', error);
      }
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(false);
      await cameraRef.current.stopRecording();
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="front">
        <View style={styles.overlay}>
          {isRecording && (
            <View style={styles.timer}>
              <Text style={styles.timerText}>{recordingTime}s</Text>
            </View>
          )}
          
          <View style={styles.controls}>
            {!isRecording ? (
              <TouchableOpacity 
                style={[styles.button, styles.recordButton]}
                onPress={startRecording}
              >
                <Text style={styles.buttonText}>● Record</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.button, styles.stopButton]}
                onPress={stopRecording}
              >
                <Text style={styles.buttonText}>⊢ Stop</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  timer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  timerText: {
    color: '#ff0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controls: {
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 50,
  },
  recordButton: {
    backgroundColor: '#FF0000',
  },
  stopButton: {
    backgroundColor: '#FFA500',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
