/**
 * Posture Analysis Service
 * Communicates with AWS Lambda for AI-powered analysis
 */

export interface AnalysisResult {
  postureName: string;
  score: number;
  alignmentFeedback: string;
  keyCues: string[];
  processingTime: number;
}

const LAMBDA_ENDPOINT = 'https://sawzjrswjhnwn7wzvqulcj7lqi0myqtf.lambda-url.us-east-1.on.aws/';

export class AnalysisService {
  /**
   * Convert video file to base64
   */
  private async videoToBase64(videoUri: string): Promise<string> {
    try {
      // Read the video file
      const response = await fetch(videoUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          // Extract just the base64 part (remove data:video/mp4;base64, prefix)
          const base64Data = base64.split(',')[1] || base64;
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting video to base64:', error);
      throw new Error('Failed to process video file');
    }
  }

  /**
   * Analyze posture from video file
   * Sends video to Lambda for AI analysis
   */
  async analyzePosture(
    videoUri: string,
    exerciseName?: string,
    focusArea?: string
  ): Promise<AnalysisResult> {
    try {
      console.log('Starting posture analysis...');
      
      // Convert video to base64
      console.log('Converting video to base64...');
      const videoBase64 = await this.videoToBase64(videoUri);
      
      console.log('Sending to Lambda:', {
        videoSize: videoBase64.length,
        exerciseName,
        focusArea,
      });

      // Send to Lambda
      const response = await fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-key': 'posture-critic-v1',
        },
        body: JSON.stringify({
          video: videoBase64,
          timestamp: new Date().toISOString(),
          exerciseName,
          focusArea,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Lambda error: ${response.status}`);
      }

      const analysis = (await response.json()) as AnalysisResult;
      
      console.log('Analysis complete:', {
        postureName: analysis.postureName,
        score: analysis.score,
        processingTime: analysis.processingTime,
      });

      return analysis;
    } catch (error) {
      console.error('Analysis error:', error);
      throw error instanceof Error
        ? error
        : new Error('Failed to analyze posture');
    }
  }

  /**
   * Check if Lambda is reachable
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video: 'test',
        }),
      });
      // We expect 400 (missing video), not 500
      return response.status !== 500;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const analysisService = new AnalysisService();
