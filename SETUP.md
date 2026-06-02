# PostureCritic - Setup & Development Guide

**Status:** 🚀 v1 Foundation READY TO BUILD  
**Date:** 2026-06-02  
**Mode:** Gym Mode (Phase 1)

---

## 🏗️ What's Been Built

### Core Services ✅
- **`src/services/pose-detection.ts`** (5.2KB)
  - MediaPipe Pose wrapper
  - Landmark detection & validation
  - Confidence scoring
  
- **`src/services/angle-calculator.ts`** (7.8KB)
  - Posture angle calculations
  - Score computation (0-100)
  - Trend analysis
  - Recommendations engine

### Type Definitions ✅
- **`src/types/index.ts`** (3.1KB)
  - Full TypeScript interfaces
  - Session data models
  - Analysis results
  - Error handling

### Documentation ✅
- **`README.md`** (5.1KB) - Project overview
- **`SETUP.md`** (This file)

---

## 🚀 Next Steps (Building Week 1)

### Step 1: Install Dependencies (30 min)
```bash
cd /data/.openclaw/workspace/posture-critic-app

# Install base packages
npm install expo@latest
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install expo-camera expo-media-library expo-secure-store

# Install AI/ML packages
npm install @mediapipe/pose @mediapipe/tasks-vision
npm install @google/generative-ai

# Install reusable services from FormCritic
npm install axios
```

### Step 2: Create App Structure (1 hour)
```
src/
├── app/
│   ├── (tabs)/
│   │   ├── gym/
│   │   │   ├── _layout.tsx
│   │   │   ├── record.tsx          # Camera recording screen
│   │   │   ├── camera.tsx          # Camera component
│   │   │   └── results.tsx         # Analysis results screen
│   │   ├── history/
│   │   │   ├── _layout.tsx
│   │   │   └── index.tsx           # Session history
│   │   └── _layout.tsx             # Tab navigator
│   ├── _layout.tsx                 # Root layout
│   └── index.tsx                   # Home screen
│
├── components/
│   ├── pose-overlay.tsx            # Visual pose display
│   ├── angle-display.tsx           # Show posture angles
│   ├── score-card.tsx              # Display score + feedback
│   └── session-card.tsx            # History item
│
├── services/
│   ├── pose-detection.ts           # ✅ Done
│   ├── angle-calculator.ts         # ✅ Done
│   ├── gemini-analysis.ts          # Create (Gym analysis)
│   ├── storage.ts                  # Session persistence
│   └── exercisedb.ts               # Reuse from FormCritic
│
├── types/
│   └── index.ts                    # ✅ Done
│
├── utils/
│   ├── formatting.ts               # Angle/score formatting
│   ├── validation.ts               # Data validation
│   └── constants.ts                # App constants
│
└── hooks/
    ├── usePoseDetection.ts         # React hook for pose
    ├── usePostureSession.ts        # Session management
    └── useAnalysis.ts              # Gemini analysis hook
```

### Step 3: Build Gym Mode Components (2 hours)

#### 3a. Pose Detection Hook
```typescript
// src/hooks/usePoseDetection.ts
import { useEffect, useState } from 'react';
import { poseDetectionService } from '../services/pose-detection';
import { calculatePostureAngles, calculatePostureScore } from '../services/angle-calculator';

export function usePoseDetection(isActive: boolean) {
  const [landmarks, setLandmarks] = useState(null);
  const [angles, setAngles] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    (async () => {
      await poseDetectionService.initialize();
      setLoading(false);
    })();
  }, [isActive]);

  const detectPose = async (image: any) => {
    const detected = await poseDetectionService.detectPose(image);
    if (detected) {
      setLandmarks(detected);
      const angles = calculatePostureAngles(detected);
      setAngles(angles);
      const score = calculatePostureScore(angles);
      setScore(score);
    }
  };

  return { landmarks, angles, score, loading, detectPose };
}
```

#### 3b. Record Screen
```typescript
// src/app/(tabs)/gym/record.tsx
// - Camera component
// - Record button
// - Preview before analysis
// - Send to Lambda for Gemini analysis
```

#### 3c. Results Screen
- Display posture score
- Show angle metrics
- Display AI feedback from Gemini
- Save session

### Step 4: Gemini Integration (1 hour)

Create `src/services/gemini-analysis.ts`:
```typescript
// Enhanced prompt with posture data
const prompt = `
You are an expert fitness coach analyzing exercise form and posture.

Exercise: ${exerciseName}
Detected Posture Metrics:
- Neck angle: ${angles.neckAngle}°
- Spine angle: ${angles.spineAngle}°
- Shoulder alignment: ${angles.shoulderLift}°

Analyze the video and provide:
1. Posture-specific feedback
2. Form score (0-100)
3. Key areas to improve
4. Muscle activation patterns

Return JSON: {
  "score": number,
  "critique": string,
  "keyCues": string[],
  "posturalIssues": string[]
}
`;
```

### Step 5: Session History & Storage (1 hour)

Create `src/services/storage.ts`:
- Save sessions to local storage
- Load session history
- Delete old sessions
- Export data

---

## 📋 Development Checklist (Week 1)

### Day 1-2: Setup & Infrastructure
- [ ] Install all dependencies
- [ ] Create project structure
- [ ] Set up Expo project config
- [ ] Create base navigation

### Day 3-4: Pose Detection
- [ ] Implement PoseDetection hook
- [ ] Create PoseOverlay component
- [ ] Create AngleDisplay component
- [ ] Test on device

### Day 5-6: Recording & Analysis
- [ ] Build camera recording screen
- [ ] Implement video upload to Lambda
- [ ] Connect to Gemini analysis
- [ ] Display results

### Day 7: Polish & History
- [ ] Add session history screen
- [ ] Implement storage service
- [ ] Polish UI/UX
- [ ] Prepare for TestFlight build

---

## 🎯 v1 Definition (MVP)

### Must Have ✅
- [x] Pose detection (MediaPipe)
- [x] Angle calculation
- [x] Video recording
- [ ] Gemini analysis integration
- [ ] Results display
- [ ] Session history
- [ ] Local storage

### Nice to Have
- [ ] Dark mode
- [ ] Custom exercises
- [ ] Sharing results
- [ ] Export data

### Out of Scope (v2+)
- [ ] Office mode
- [ ] Correction exercises
- [ ] Cloud sync
- [ ] Wearable integration

---

## 🔗 Integration Points

### With FormCritic
- Reuse ExerciseDB service
- Reuse Gemini Lambda integration
- Reuse styling/theme system
- Share component library

### With ExerciseDB
- Get exercise templates
- Pull exercise GIFs
- Get muscle group mapping
- Future: Corrective exercise recommendations

### With AWS Lambda
- Send video + posture metrics
- Get detailed Gemini analysis
- Return JSON response

---

## 📊 File Structure Quick Reference

```
posture-critic-app/
├── src/
│   ├── app/                    # Expo Router screens
│   ├── components/             # Reusable components
│   ├── services/               # Business logic
│   │   ├── pose-detection.ts      ✅
│   │   ├── angle-calculator.ts    ✅
│   │   ├── gemini-analysis.ts     (Create)
│   │   └── storage.ts             (Create)
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript definitions
│   ├── utils/                  # Utility functions
│   └── styles/                 # Global styles
│
├── lambda/
│   └── index.ts                # Posture analysis handler
│
├── app.json                    # Expo config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── README.md                   # Project overview
├── SETUP.md                    # This file
└── ARCHITECTURE.md             # (Create) Technical details
```

---

## 🎨 UI/UX Considerations for v1

### Gym Mode Flow
```
Home
  ↓
Tap "Gym Mode"
  ↓
Select Exercise (dropdown)
  ↓
Camera Screen
  - Show pose overlay in real-time
  - Show current posture angles
  - Record button
  ↓
Recording... (15 seconds)
  - Show pose skeleton
  - Show live angles
  - Show recording timer
  ↓
Processing...
  - Send to Lambda
  - Gemini analyzes
  ↓
Results
  - Score (large, prominent)
  - Posture metrics
  - AI feedback
  - Cues for improvement
  - Save button
  ↓
Saved ✅
  - Option: Redo, Home, History
```

---

## 🚀 Key Technical Decisions

✅ **MediaPipe Pose** - On-device, real-time, privacy-first  
✅ **Angle Calculator** - Mathematical, deterministic, no ML overhead  
✅ **Gemini Vision** - Rich analysis combining angles + video  
✅ **Local Storage** - Privacy first, works offline  
✅ **Expo Router** - Same as FormCritic, proven setup  

---

## 📞 Questions During Development?

Common issues will be documented in:
- `TROUBLESHOOTING.md` (create when needed)
- `ARCHITECTURE.md` (create when design is final)
- In-code comments with implementation notes

---

## 🎯 Success Criteria for v1

**Ship when:**
- ✅ Can record exercise video
- ✅ Pose detection works (shows skeleton)
- ✅ Angles calculated accurately
- ✅ Gemini analysis returns feedback
- ✅ Score + feedback display correctly
- ✅ Sessions persist locally
- ✅ Can view history

**Nice to have (can ship without):**
- Dark mode
- Custom exercise support
- Export functionality

---

## 📅 Timeline

| Week | Deliverable | Status |
|------|-------------|--------|
| Week 1 | Core services + gym mode | 🚀 Starting |
| Week 2 | Polish + TestFlight | 📋 Planning |
| Week 3 | Office mode (v2) | 📋 Planning |
| Week 4 | Corrective exercises (v3) | 📋 Planning |

**Target Ship Date:** June 16, 2026

---

**Ready to build?** Let's go! 🚀

*Last updated: 2026-06-02*
*Next: Start with Step 1 (Install Dependencies)*
