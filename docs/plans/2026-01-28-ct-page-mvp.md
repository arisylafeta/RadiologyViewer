# CT Page MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a professional-looking CT page for ankle DICOM viewing with window/level presets, AI overlays, and HU measurements panel.

**Architecture:** Update existing ViewerLayout and CTToolbar components to load dynamic window presets from metadata.json, add AI overlay bounding boxes for ankle anatomy, and ensure consistent page structure matching the XRay implementation.

**Tech Stack:** React, Next.js, TypeScript, Zustand (state management), Cornerstone.js (DICOM rendering), Lucide React (icons)

---

### Task 1: Update CT Page Structure

**Files:**
- Modify: `app/ct/page.tsx`

**Step 1: Add Suspense wrapper and remove static header**

```typescript
'use client';

import { Suspense } from 'react';
import { ViewerLayout } from '@/components/viewer/viewer-layout';

function CTPageContent() {
  return <ViewerLayout modality="CT" />;
}

export default function CTPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg text-text-primary mb-2">Loading...</p>
        </div>
      </div>
    }>
      <CTPageContent />
    </Suspense>
  );
}
```

**Step 2: Verify page loads without errors**

Run: `npm run dev`
Expected: CT page loads at `/ct` with loading state, then displays ViewerLayout with CT modality

**Step 3: Commit**

```bash
git add app/ct/page.tsx
git commit -m "refactor: add Suspense wrapper to CT page, remove static header"
```

---

### Task 2: Load Metadata in ViewerLayout

**Files:**
- Modify: `components/viewer/viewer-layout.tsx`

**Step 1: Add state for CT metadata**

```typescript
// Add near top of ViewerLayoutContent function (after existing state declarations)
const [ctMetadata, setCtMetadata] = useState<{
  windowPresets?: Record<string, { name: string; width: number; level: number; description?: string }>;
  pixelSpacing?: number[];
  sliceThickness?: string;
}>({});
```

**Step 2: Add useEffect to load metadata for CT scans**

```typescript
// Add after the existing useEffect that sets currentScan (around line 164)
useEffect(() => {
  const loadMetadata = async () => {
    if (modality === 'CT' && scan && scan.dicomPath) {
      try {
        const metadataPath = scan.dicomPath + '/metadata.json';
        const response = await fetch(metadataPath);
        if (response.ok) {
          const metadata = await response.json();
          setCtMetadata(metadata);
        }
      } catch (error) {
        console.error('Error loading CT metadata:', error);
      }
    }
  };

  loadMetadata();
}, [modality, scan]);
```

**Step 3: Pass metadata to CTToolbar**

Find the CTToolbar usage (around line 195) and update:
```typescript
// Before: <CTToolbar activePreset={ctPreset} onPresetChange={setCtPreset} />
// After:
<CTToolbar
  activePreset={ctPreset}
  onPresetChange={setCtPreset}
  presets={ctMetadata.windowPresets}
/>
```

**Step 4: Verify metadata loads**

Run: `npm run dev`, navigate to `/ct?scan=ct-ankle-001`
Expected: Check browser console - no errors, metadata.json loads successfully

**Step 5: Commit**

```bash
git add components/viewer/viewer-layout.tsx
git commit -m "feat: load CT metadata from JSON, pass presets to CTToolbar"
```

---

### Task 3: Update CTToolbar for Dynamic Presets

**Files:**
- Modify: `components/viewer/toolbars/ct-toolbar.tsx`

**Step 1: Add presets prop to interface**

```typescript
interface CTToolbarProps {
  activePreset: string;
  onPresetChange: (preset: string) => void;
  presets?: Record<string, { name: string; width: number; level: number; description?: string }>;
}
```

**Step 2: Build preset list from props or fallback to defaults**

Add at the start of component function:
```typescript
export function CTToolbar({ activePreset, onPresetChange, presets }: CTToolbarProps) {
  // Build preset list from loaded metadata or fallback to defaults
  const presetList = useMemo(() => {
    if (presets && Object.keys(presets).length > 0) {
      return Object.entries(presets).map(([id, preset]) => ({
        id,
        name: preset.name,
        w: preset.width,
        l: preset.level,
      }));
    }

    // Fallback to default hardcoded presets
    return [
      { id: 'brain', name: 'Brain', w: 80, l: 40 },
      { id: 'subdural', name: 'Subdural', w: 200, l: 75 },
      { id: 'stroke', name: 'Stroke', w: 8, l: 32 },
      { id: 'bone', name: 'Bone', w: 2500, l: 480 },
      { id: 'lung', name: 'Lung', w: 1500, l: -600 },
      { id: 'mediastinum', name: 'Mediastinum', w: 350, l: 50 },
      { id: 'abdomen', name: 'Abdomen', w: 350, l: 40 },
      { id: 'liver', name: 'Liver', w: 150, l: 30 },
    ];
  }, [presets]);

  const currentPreset = presetList.find((p) => p.id === activePreset) || presetList[0];
```

**Step 3: Update dropdown to use dynamic presetList**

Replace the hardcoded windowPresets.slice() calls with presetList:

```typescript
// Replace lines 58-70 (Head presets section):
{presetList.slice(0, 4).map((preset) => (
  <DropdownMenuItem
    key={preset.id}
    onClick={() => onPresetChange(preset.id)}
    className={cn(
      'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer text-xs flex justify-between',
      activePreset === preset.id && 'bg-primary text-white'
    )}
  >
    <span>{preset.name}</span>
    <span className="text-white/50 text-xs">W:{preset.w} L:{preset.l}</span>
  </DropdownMenuItem>
))}

// Update lines 74-86 (Chest presets section):
{presetList.slice(4, 6).map((preset) => (
  // ... same structure as above
))}

// Update lines 90-102 (Abdomen presets section):
{presetList.slice(6, 8).map((preset) => (
  // ... same structure as above
))}
```

**Step 4: Verify preset dropdown renders dynamically**

Run: `npm run dev`, navigate to `/ct?scan=ct-ankle-001`, click window preset dropdown
Expected: Shows "Bone", "Soft Tissue", "Standard" presets from metadata.json with correct W/L values

**Step 5: Commit**

```bash
git add components/viewer/toolbars/ct-toolbar.tsx
git commit -m "feat: make CTToolbar use dynamic presets from metadata"
```

---

### Task 4: Add AI Overlay Data for Ankle CT

**Files:**
- Modify: `lib/mock-data.ts`

**Step 1: Update overlayData for ct-ankle-001**

Find the 'ct-ankle-001' entry in mockAIAnalyses (around line 248) and update:
```typescript
'ct-ankle-001': {
  scanId: 'ct-ankle-001',
  findings: ctAnkleFindings,
  overallAssessment: 'CT ankle shows normal bony architecture and joint spaces. No fracture or ligamentous injury identified. Examination within normal limits.',
  processingTime: 14.3,
  analyzedAt: '2026-01-28T10:45:12Z',
  overlayData: [
    {
      type: 'bounding-box',
      coordinates: [[100, 150], [250, 350]], // [top-left, bottom-right]
      color: '#06b6d4', // cyan
      label: 'Tibia',
    },
    {
      type: 'bounding-box',
      coordinates: [[280, 150], [350, 350]],
      color: '#ec4899', // magenta
      label: 'Fibula',
    },
    {
      type: 'bounding-box',
      coordinates: [[120, 280], [320, 380]],
      color: '#84cc16', // lime
      label: 'Ankle Joint',
    },
  ],
},
```

**Step 2: Verify overlays render on viewport**

Run: `npm run dev`, navigate to `/ct?scan=ct-ankle-001`
Expected: Three colored bounding boxes appear over the ankle CT image with labels "Tibia", "Fibula", "Ankle Joint"

**Step 3: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add AI overlay bounding boxes for ankle CT anatomy"
```

---

### Task 5: Update CT Measurements Mock Data

**Files:**
- Modify: `components/viewer/viewer-layout.tsx`

**Step 1: Update ctMeasurements state to use ankle-specific data**

Find the ctMeasurements state definition (around line 84) and update:
```typescript
const [ctMeasurements, setCtMeasurements] = useState<CTMeasurement[]>([
  {
    id: '1',
    type: 'hu-roi',
    value: 145.5,
    unit: 'mm²',
    location: 'Tibial cortex',
    timestamp: new Date().toISOString(),
    huStats: {
      mean: 1425.3,
      min: 1200,
      max: 1650,
      stdDev: 120.2,
    },
  },
  {
    id: '2',
    type: 'hu-probe',
    value: 850,
    unit: 'HU',
    location: 'Medial malleolus',
    timestamp: new Date().toISOString(),
  },
]);
```

**Step 2: Verify measurements panel displays updated data**

Run: `npm run dev`, navigate to `/ct?scan=ct-ankle-001`, open measurements panel
Expected: Shows "Tibial cortex" ROI with mean HU ~1425, and "Medial malleolus" probe at 850 HU

**Step 3: Commit**

```bash
git add components/viewer/viewer-layout.tsx
git commit -m "feat: update CT measurements to ankle-specific HU values"
```

---

### Task 6: Final Testing and Verification

**Step 1: Run full page load test**

Run: `npm run dev`
Navigate to: `http://localhost:3000/ct?scan=ct-ankle-001`

**Verification checklist:**
- [ ] Page shows Suspense loading state briefly
- [ ] ViewerLayout displays without errors
- [ ] 10 DICOM slices load correctly (ankle CT)
- [ ] Window preset dropdown shows "Bone", "Soft Tissue", "Standard" with correct W/L values from metadata
- [ ] Clicking presets updates display (visual check only)
- [ ] AI overlays render as 3 colored bounding boxes (Tibia, Fibula, Ankle Joint)
- [ ] Measurements panel shows 2 ankle-specific measurements
- [ ] AI findings tab shows 4 findings for ankle scan
- [ ] Console shows no errors

**Step 2: Run linting and type checking**

Run: `npm run lint` (if exists)
Run: `npm run typecheck` (if exists)
Expected: No linting or TypeScript errors

**Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete CT page MVP with dynamic presets, AI overlays, and measurements"
```

---

## Testing Strategy

Since this is an MVP with visual-only functionality (no actual window/level adjustment or HU measurement), testing will be primarily visual:

1. **Page Load Test**: Ensure Suspense wrapper works and page loads cleanly
2. **Metadata Loading Test**: Verify metadata.json loads from `/samples/ct/ankle/metadata.json`
3. **Dynamic Presets Test**: Check window presets appear in dropdown with correct values
4. **AI Overlay Test**: Verify bounding boxes render with correct colors and labels
5. **Measurements Panel Test**: Ensure ankle-specific HU measurements display correctly
6. **Error Handling Test**: Verify graceful handling if metadata fails to load

## Potential Issues and Solutions

**Issue**: Metadata loading fails (404 or network error)
**Solution**: CTToolbar falls back to hardcoded presets, viewer still works

**Issue**: Overlay coordinates don't match actual anatomy
**Solution**: This is visual-only for MVP; coordinates can be adjusted in mock-data.ts as needed

**Issue**: Window/level changes don't actually affect image display
**Solution**: MVP scope - store updates work, but no actual cornerstone viewport manipulation needed
