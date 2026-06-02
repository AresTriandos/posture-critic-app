# PostureCritic - AI-Powered Posture Analysis

Unified posture app combining **gym form analysis**, **office ergonomic monitoring**, and **corrective exercises** into one seamless experience.

## 🎯 Features

### v1: Gym Mode (Current)
- 🎥 Record exercise videos
- 🧠 AI-powered form analysis (Gemini Vision)
- 📊 Posture angle measurement (MediaPipe)
- ⭐ Form score (0-100)
- 💡 Actionable improvement cues
- 📈 Session history & tracking

### v2: Office Mode (Coming Soon)
- 💼 Real-time posture monitoring
- 🔔 Slouching alerts
- ⏱️ Break reminders & tracking
- 📋 Daily posture report
- 🏢 Ergonomic exposure score

### v3: Corrective Exercises (Coming Soon)
- 🏋️ AI-recommended exercises (based on detected issues)
- 📚 Integration with ExerciseDB (11K+ exercises)
- 🎬 Follow-along routines
- ✅ Progress tracking

## 🏗️ Tech Stack

- **Framework:** React Native + Expo 56
- **Language:** TypeScript
- **Pose Detection:** MediaPipe Pose (on-device)
- **AI Analysis:** Google Gemini 2.5 Vision API
- **Backend:** AWS Lambda
- **Storage:** Expo SecureStore
- **UI:** React Native + custom components

## 🚀 Quick Start

```bash
# Install dependencies
npm install
# or
bun install

# Start development
npx expo start

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 📁 Project Structure

```
posture-critic-app/
├── src/
│   ├── services/
│   │   ├── pose-detection.ts      # MediaPipe Pose wrapper
│   │   ├── angle-calculator.ts    # Posture angle math
│   │   ├── gemini-analysis.ts     # Gemini Vision API
│   │   └── exercisedb.ts          # Exercise database (from FormCritic)
│   │
│   ├── components/
│   │   ├── pose-overlay.tsx       # Visual pose visualization
│   │   ├── angle-display.tsx      # Show posture angles
│   │   ├── exercise-detail-card.tsx # (from FormCritic)
│   │   └── corrective-exercises.tsx # (Phase 3)
│   │
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── gym/               # Gym mode screens
│   │   │   ├── office/            # Office mode screens (v2)
│   │   │   └── history/           # History & analytics
│   │   └── _layout.tsx
│   │
│   └── types/
│       └── index.ts               # TypeScript interfaces
│
├── lambda/
│   ├── index.ts                   # Gemini analysis handler
│   └── form-critic-lambda.zip    # (from FormCritic)
│
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Core Interfaces

```typescript
// Posture metrics from MediaPipe
interface PostureMetrics {
  neckAngle: number;        // 0-90° (0 = perfect, 90 = extreme forward)
  spineAngle: number;       // 0-180° (90 = upright, 0-90 = slouching)
  shoulderLift: number;     // -90 to 90 (negative = uneven)
  kneeAngle?: number;       // For gym mode
  overallScore: 0-100;
  timestamp: Date;
}

// Analysis result from Gemini
interface PostureAnalysis {
  exercise: string;
  score: number;
  critique: string;
  keyCues: string[];
  metrics: PostureMetrics;
  recommendedExercises: Exercise[];
}

// Session data
interface PostureSession {
  id: string;
  type: 'gym' | 'office' | 'correction';
  startTime: Date;
  endTime: Date;
  metrics: PostureMetrics[];
  analysis?: PostureAnalysis;
  videoPath?: string;
}
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create `.env.local`:
```bash
# Google Gemini (same as FormCritic)
EXPO_PUBLIC_GEMINI_API_KEY=REDACTED

# ExerciseDB (RapidAPI or Railway)
EXPO_PUBLIC_EXERCISEDB_URL=https://your-exercisedb-url
EXPO_PUBLIC_EXERCISEDB_KEY=your-rapidapi-key

# AWS Lambda
EXPO_PUBLIC_LAMBDA_URL=https://hevgy4dagmgawsrafitpkjahbq0ydunt.lambda-url.us-east-1.on.aws/
```

### 2. Install Dependencies

```bash
npm install
npm install @mediapipe/pose @mediapipe/tasks-vision
npm install @google/generative-ai
npm install expo-camera expo-media-library
```

### 3. Configure MediaPipe

MediaPipe will auto-download models on first use. No additional setup needed!

## 📊 v1 Timeline

- **Week 1:** Foundation + Gym Mode
  - [x] Project setup
  - [ ] MediaPipe Pose integration
  - [ ] Angle calculation engine
  - [ ] Gym mode recording
  - [ ] Gemini analysis integration
  
- **Week 2:** Polish + Ship
  - [ ] UI/UX refinement
  - [ ] History tracking
  - [ ] TestFlight build
  - [ ] Launch v1

## 🎯 v1 Success Criteria

- ✅ Record exercise video
- ✅ Detect posture angles in real-time
- ✅ Analyze with Gemini Vision
- ✅ Return score + posture-specific feedback
- ✅ Track session history
- ✅ Show improvement over time

## 🚀 Roadmap

**v1.1:** Better angle calculations, more exercise templates  
**v2.0:** Office mode with real-time monitoring  
**v2.1:** Break reminders, daily reports  
**v3.0:** Corrective exercises, AI recommendations  
**v3.1:** Wearable integration (Apple Watch, Oura Ring)  
**v4.0:** Social sharing, challenges, community  

## 📞 Questions?

See `/docs` for detailed guides on:
- MediaPipe Pose setup
- Angle calculation math
- Gemini integration
- Architecture overview

---

**Status:** Building v1 🚀  
**Updated:** 2026-06-02  
**Built by:** Ares (OpenClaw agent)
