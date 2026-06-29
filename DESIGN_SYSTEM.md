# PostureCritic Design System

## Aesthetic Direction

**Athletic, Modern, Body-Focused**

PostureCritic analyzes posture and body alignment. The design reflects:
- **Precision** — Careful, focused movement
- **Athletic** — Energetic, performance-driven
- **Modern** — Clean, professional, approachable

Purple primary color conveys body awareness and precision. Pink accents add energy and urgency.

---

## Color Palette

### Light Mode

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#8B3A8B` | Main actions, navigation |
| **Primary Light** | `#A855F7` | Hover states, accents |
| **Accent** | `#EC4899` | Energy, highlights |
| **Success** | `#10B981` | Correct form, positive |
| **Warning** | `#F59E0B` | Caution, alerts |
| **Danger** | `#EF4444` | Incorrect form, errors |
| **Text** | `#1a1a1a` | Primary text |
| **Text Secondary** | `#6B7280` | Supporting text |
| **Background** | `#FAFAFA` | App background |
| **Surface** | `#FFFFFF` | Cards |
| **Border** | `#E5E7EB` | Dividers |

### Dark Mode

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#C084FC` | Main actions (brighter) |
| **Accent** | `#F472B6` | Energy, lighter pink |
| **Danger** | `#F87171` | Red for dark mode |

---

## Typography

### Display
- **Display Large**: 40px, 700 weight
- **Display Small**: 32px, 700 weight

### Headings
- **Heading Large**: 28px, 600 weight
- **Heading Small**: 20px, 600 weight

### Body
- **Body Large**: 16px, 400 weight (main content)
- **Body Medium**: 14px, 400 weight (supporting)
- **Body Small**: 12px, 400 weight (tertiary)

### Labels
- **Label Large**: 14px, 600 weight (buttons)
- **Label Small**: 12px, 600 weight (small labels)

---

## Spacing System

- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `2xl`: 32px
- `3xl`: 48px
- `4xl`: 64px

---

## Components

### Button

**Variants:**
- **Primary** — Main action (purple)
- **Secondary** — Alternative action (outlined)
- **Tertiary** — Low priority (text only)
- **Danger** — Destructive action (red)

**Sizes:** sm, md, lg

### Timer

Displays recording time in MM:SS format. Auto-increments during recording.

```tsx
<Timer isActive={isRecording} onTick={setRecordingTime} />
```

---

## Design Principles

1. **Consistency** — Use design tokens everywhere
2. **Clarity** — Clear hierarchy, readable text
3. **Feedback** — User knows what's happening (recording, permissions, etc.)
4. **Accessibility** — Sufficient contrast, accessible touch targets
5. **Error Prevention** — Ask before destructive actions

---

## File Structure

```
src/
├── constants/
│   └── theme.ts          # Design tokens
├── components/
│   ├── button.tsx        # Reusable button
│   └── timer.tsx         # Recording timer
├── services/
│   └── camera.ts         # Camera & video logic
└── app/
    ├── index.tsx         # Home screen
    ├── camera.tsx        # Camera recording
    ├── history.tsx       # Video history
    └── _layout.tsx       # Navigation
```

---

## Future Enhancements

- [ ] Video playback with analysis overlay
- [ ] Posture correction hints during recording
- [ ] Progress analytics and charts
- [ ] Export video with annotations
- [ ] Cloud backup (optional)

