# MRI Multi-View MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a professional MRI viewer with multi-window display (2x2 grid), AI overlay system with numbered findings, sequence presets, and ROI intensity analysis using real DICOM data from the shoulder study.

**Architecture:** Enhance existing viewer infrastructure to support series-based MRI data with per-viewport series mapping. Add AI overlay component for numbered findings annotations. Implement MRI-specific toolbar presets and measurement tools. Maintain separation of concerns: data layer (mock-data.ts), DICOM loading (dicom-loader.ts), UI components (viewer-layout, viewport-grid), and MRI-specific features.

**Tech Stack:** Next.js 14, React, TypeScript, Cornerstone.js (DICOM rendering), Tailwind CSS, Zustand (state management)

---

### Task 1: Create Git Worktree for Feature Branch

**Files:**
- Create: Git worktree at `../radiology-friend-feature-mri-multi-view`

**Step 1: Verify clean working directory**

```bash
git status
```
Expected: "working tree clean"

**Step 2: Create feature branch**

```bash
git checkout -b feature/mri-multi-view-mvp
```
Expected: "Switched to a new branch 'feature/mri-multi-view-mvp'"

**Step 3: Create worktree**

```bash
cd /Users/admin/Desktop/Projects
git worktree add radiology-friend-mri-mvp feature/mri-multi-view-mvp
```
Expected: "Preparing worktree (new checkout 'feature/mri-multi-view-mvp')"

**Step 4: Verify worktree created**

```bash
ls -la radiology-friend-mri-mvp/
```
Expected: Directory exists with project files

**Step 5: Push branch to remote**

```bash
git push -u origin feature/mri-multi-view-mvp
```
Expected: Branch pushed to origin

---

### Task 2: Add MRI Scan and Series Data Model

**Files:**
- Modify: `lib/mock-data.ts:42-109`

**Step 1: Add MRI shoulder scan entry**

```typescript
{
  id: 'mri-shoulder-001',
  patientId: 'p006',
  patientName: 'Giovanni Doe',
  modality: 'MRI',
  bodyPart: 'Shoulder',
  date: '2002-01-01',
  status: 'analyzed',
  sliceCount: 70, // Total across all series
  dicomPath: '/samples/mri/48213468/DICOM',
  thumbnailPath: '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 002 [MR - TSE T2 TRS1]/1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.728.0.dcm',
  hasAIOverlay: true,
}
```

**Step 2: Add patient entry for Giovanni Doe**

```typescript
{
  id: 'p006',
  name: 'Giovanni Doe',
  age: 48,
  gender: 'M',
  patientId: '48213468',
},
```

**Step 3: Add series configuration type definition**

```typescript
export interface MRISeries {
  seriesId: string;
  seriesNumber: number;
  seriesName: string;
  sequence: 'scout' | 't1' | 't2' | 'stir' | 'flair' | 'dwi';
  orientation: 'sagittal' | 'coronal' | 'transverse';
  sliceCount: number;
  path: string;
  files: string[];
}
```

**Step 4: Add series configuration for MRI shoulder scan**

```typescript
export const mriShoulderSeries: MRISeries[] = [
  {
    seriesId: 'mri-shoulder-001-s001',
    seriesNumber: 1,
    seriesName: 'Scout',
    sequence: 'scout',
    orientation: 'transverse',
    sliceCount: 3,
    path: '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 001 [MR - Scout]',
    files: [
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.722.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.726.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.727.0.dcm',
    ],
  },
  {
    seriesId: 'mri-shoulder-001-s002',
    seriesNumber: 2,
    seriesName: 'TSE T2',
    sequence: 't2',
    orientation: 'transverse',
    sliceCount: 15,
    path: '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 002 [MR - TSE T2 TRS1]',
    files: [
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.728.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.730.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.731.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.732.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.733.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.734.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.735.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.736.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.737.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.738.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.739.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.740.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.741.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.742.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.728.0.dcm',
    ],
  },
  {
    seriesId: 'mri-shoulder-001-s003',
    seriesNumber: 3,
    seriesName: 'SE T1 SAG1',
    sequence: 't1',
    orientation: 'sagittal',
    sliceCount: 14,
    path: '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 003 [MR - SE T1 SAG1]',
    files: [
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.743.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.745.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.746.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.747.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.748.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.749.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.750.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.751.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.752.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.753.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.754.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.755.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.756.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.757.0.dcm',
    ],
  },
  {
    seriesId: 'mri-shoulder-001-s004',
    seriesNumber: 4,
    seriesName: 'SE T1 SAG1',
    sequence: 't1',
    orientation: 'sagittal',
    sliceCount: 14,
    path: '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 004 [MR - SE T1 SAG1]',
    files: [
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.758.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.760.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.761.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.762.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.763.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.764.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.765.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.766.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.767.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.768.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.769.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.770.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.771.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.772.0.dcm',
    ],
  },
  {
    seriesId: 'mri-shoulder-001-s005',
    seriesNumber: 5,
    seriesName: 'STIR COR1',
    sequence: 'stir',
    orientation: 'coronal',
    sliceCount: 12,
    path: '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 005 [MR - GE STIR COR1]',
    files: [
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.773.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.775.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.776.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.777.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.778.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.779.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.780.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.781.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.782.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.783.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.784.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.785.0.dcm',
    ],
  },
  {
    seriesId: 'mri-shoulder-001-s006',
    seriesNumber: 6,
    seriesName: 'SE T1 COR1',
    sequence: 't1',
    orientation: 'coronal',
    sliceCount: 12,
    path: '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 006 [MR - SE T1 COR1]',
    files: [
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.786.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.788.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.789.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.790.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.791.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.792.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.793.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.794.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.795.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.796.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.797.0.dcm',
      '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.798.0.dcm',
    ],
  },
];
```

**Step 5: Add helper function to get series by ID**

```typescript
export const getSeriesByScanId = (scanId: string): MRISeries[] => {
  if (scanId === 'mri-shoulder-001') {
    return mriShoulderSeries;
  }
  return [];
};
```

**Step 6: Export MRISeries type**

Add to existing exports in lib/types.ts

**Step 7: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 8: Commit**

```bash
git add lib/mock-data.ts lib/types.ts
git commit -m "feat: add MRI shoulder scan with series configuration"
```

---

### Task 3: Update DICOM Loader for MRI Series Support

**Files:**
- Modify: `lib/dicom-loader.ts:70-128`

**Step 1: Update buildWadoUri function signature**

```typescript
export function buildWadoUri(
  scanId: string,
  sliceIndex: number = 0,
  seriesId?: string
): string {
```

**Step 2: Add MRI series file mapping**

```typescript
// MRI shoulder series file mappings
const mriShoulderSeriesFiles = {
  'mri-shoulder-001-s001': [
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.722.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.726.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.727.0.dcm',
  ],
  'mri-shoulder-001-s002': [
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.728.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.730.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.731.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.732.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.733.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.734.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.735.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.736.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.737.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.738.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.739.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.740.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.741.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.742.0.dcm',
    '1.3.6.1.4.1.5962.99.1.2786334768.1849416866.1385765836848.728.0.dcm',
  ],
  // Add series 003, 004, 005, 006 with their files from Task 2
};
```

**Step 3: Add MRI series path mapping**

```typescript
const mriSeriesPaths: Record<string, string> = {
  'mri-shoulder-001-s001': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 001 [MR - Scout]',
  'mri-shoulder-001-s002': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 002 [MR - TSE T2 TRS1]',
  'mri-shoulder-001-s003': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 003 [MR - SE T1 SAG1]',
  'mri-shoulder-001-s004': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 004 [MR - SE T1 SAG1]',
  'mri-shoulder-001-s005': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 005 [MR - GE STIR COR1]',
  'mri-shoulder-001-s006': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 006 [MR - SE T1 COR1]',
};
```

**Step 4: Handle MRI series in buildWadoUri**

Add after existing scanId cases:

```typescript
// Handle MRI series
if (seriesId && mriSeriesPaths[seriesId]) {
  const seriesFiles = mriShoulderSeriesFiles[seriesId];
  if (seriesFiles && seriesFiles.length > 0) {
    const validIndex = Math.max(0, Math.min(sliceIndex, seriesFiles.length - 1));
    const sliceFile = seriesFiles[validIndex];
    const seriesPath = mriSeriesPaths[seriesId];
    return `wadouri:${seriesPath}/${sliceFile}`;
  }
}
```

**Step 5: Export getSeriesSliceCount helper**

```typescript
export function getSeriesSliceCount(seriesId: string): number {
  const seriesFiles = mriShoulderSeriesFiles[seriesId];
  return seriesFiles ? seriesFiles.length : 0;
}
```

**Step 6: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 7: Commit**

```bash
git add lib/dicom-loader.ts
git commit -m "feat: add MRI series support to DICOM loader"
```

---

### Task 4: Add AI Overlays Component with Numbered Badges

**Files:**
- Create: `components/viewer/mri-ai-overlays.tsx`

**Step 1: Create component file**

```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MRIAIFinding {
  id: string;
  number: number;
  label: string;
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  description: string;
  x: number;
  y: number;
}

interface MRIAIOverlaysProps {
  findings: MRIAIFinding[];
  width: number;
  height: number;
  visible: boolean;
}

const severityColors = {
  normal: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  mild: { border: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
  moderate: { border: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
  severe: { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export function MRIAIOverlays({ findings, width, height, visible }: MRIAIOverlaysProps) {
  if (!visible || findings.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {findings.map((finding) => {
          const colors = severityColors[finding.severity];
          const xPos = (finding.x / 100) * width;
          const yPos = (finding.y / 100) * height;

          return (
            <motion.div
              key={finding.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: finding.number * 0.1 }}
              className="absolute"
              style={{
                left: xPos,
                top: yPos,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Outer glow */}
              <div
                className="absolute inset-0 rounded-full blur-md opacity-30"
                style={{
                  backgroundColor: colors.border,
                  width: 48,
                  height: 48,
                  transform: 'translate(-50%, -50%)',
                }}
              />

              {/* Badge */}
              <div
                className="relative rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.border,
                  border: `3px solid ${colors.border}`,
                  boxShadow: `0 0 20px ${colors.bg}`,
                }}
              >
                <span className="text-lg">{finding.number}</span>
              </div>

              {/* Confidence meter */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${finding.confidence}%` }}
                  transition={{ duration: 0.5, delay: finding.number * 0.1 + 0.3 }}
                  className="h-full"
                  style={{
                    backgroundColor:
                      finding.confidence >= 80
                        ? '#22c55e'
                        : finding.confidence >= 60
                        ? '#eab308'
                        : '#ef4444',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* AI indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-blue-500/30"
      >
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-xs text-blue-400 font-medium">
          AI: {findings.length} finding{findings.length !== 1 ? 's' : ''}
        </span>
      </motion.div>
    </div>
  );
}
```

**Step 2: Install framer-motion if not available**

Run: `npm list framer-motion`
Expected: Check if installed. If not, run: `npm install framer-motion`

**Step 3: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add components/viewer/mri-ai-overlays.tsx
git commit -m "feat: add MRI AI overlays with numbered badges"
```

---

### Task 5: Add Mock AI Findings for MRI Shoulder

**Files:**
- Modify: `lib/mock-data.ts:194-256`

**Step 1: Create MRI shoulder findings**

```typescript
const mriShoulderFindings: AIFinding[] = [
  {
    id: 'mri-f001',
    name: 'Supraspinatus Tendinopathy',
    confidence: 92,
    severity: 'moderate',
    description: 'Increased T2 signal intensity in supraspinatus tendon consistent with moderate tendinopathy. No full-thickness tear identified.',
  },
  {
    id: 'mri-f002',
    name: 'Subacromial Bursitis',
    confidence: 88,
    severity: 'mild',
    description: 'Fluid in subacromial-subdeltoid bursa consistent with mild bursitis.',
  },
  {
    id: 'mri-f003',
    name: 'Labral Tear',
    confidence: 76,
    severity: 'mild',
    description: 'Superior labral anterior-posterior (SLAP) tear suspected. Recommend arthroscopic correlation.',
  },
  {
    id: 'mri-f004',
    name: 'Acromioclavicular Joint',
    confidence: 95,
    severity: 'normal',
    description: 'Acromioclavicular joint appears normal without significant degenerative changes.',
  },
];
```

**Step 2: Add MRI AI analysis entry**

```typescript
'mri-shoulder-001': {
  scanId: 'mri-shoulder-001',
  findings: mriShoulderFindings,
  overallAssessment: 'MRI shoulder demonstrates moderate supraspinatus tendinopathy with associated subacromial bursitis. Possible SLAP tear identified. AC joint normal. Correlation with clinical findings recommended.',
  processingTime: 24.7,
  analyzedAt: '2026-01-28T12:34:56Z',
  overlayData: [],
},
```

**Step 3: Create overlay data mapping for MRI findings**

Create new function after mockAIAnalyses:

```typescript
export const getMRIOverlayData = (scanId: string): MRIAIFinding[] => {
  if (scanId === 'mri-shoulder-001') {
    return [
      {
        id: 'mri-f001',
        number: 1,
        label: 'Supraspinatus Tendinopathy',
        confidence: 92,
        severity: 'moderate',
        description: 'Increased T2 signal in supraspinatus tendon',
        x: 45,
        y: 35,
      },
      {
        id: 'mri-f002',
        number: 2,
        label: 'Subacromial Bursitis',
        confidence: 88,
        severity: 'mild',
        description: 'Fluid in subacromial bursa',
        x: 55,
        y: 40,
      },
      {
        id: 'mri-f003',
        number: 3,
        label: 'Labral Tear',
        confidence: 76,
        severity: 'mild',
        description: 'Possible SLAP tear',
        x: 50,
        y: 55,
      },
    ];
  }
  return [];
};
```

**Step 4: Export MRIAIFinding type**

Add to lib/types.ts:

```typescript
export interface MRIAIFinding {
  id: string;
  number: number;
  label: string;
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  description: string;
  x: number;
  y: number;
}
```

**Step 5: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 6: Commit**

```bash
git add lib/mock-data.ts lib/types.ts
git commit -m "feat: add mock AI findings for MRI shoulder scan"
```

---

### Task 6: Update ViewerCanvas to Support AI Overlays

**Files:**
- Modify: `components/viewer/viewer-canvas.tsx:1-154`

**Step 1: Import AI overlays component**

```typescript
import { MRIAIOverlays } from './mri-ai-overlays';
```

**Step 2: Add props for AI overlays**

```typescript
interface ViewerCanvasProps {
  scanId: string;
  sliceIndex: number;
  className?: string;
  seriesId?: string;
  aiEnabled?: boolean;
}
```

**Step 3: Get MRI overlay data**

Add after aiAnalysis:

```typescript
const mriOverlayData = scanId?.startsWith('mri-') ? getMRIOverlayData(scanId) : [];
```

**Step 4: Add MRI AI overlays to render**

Replace AIOverlay component or add alongside:

```typescript
{/* MRI AI Overlays */}
{scanId?.startsWith('mri-') && (
  <MriAIOverlays
    findings={mriOverlayData}
    width={dimensions.width}
    height={dimensions.height}
    visible={aiEnabled ?? true}
  />
)}

{/* Legacy AI Overlay for other modalities */}
{!scanId?.startsWith('mri-') && (
  <AIOverlay
    overlayData={overlayData || []}
    width={dimensions.width}
    height={dimensions.height}
  />
)}
```

**Step 5: Update buildWadoUri call to pass seriesId**

```typescript
const imageId = buildWadoUri(scanId, sliceIndex, seriesId);
```

**Step 6: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 7: Commit**

```bash
git add components/viewer/viewer-canvas.tsx
git commit -m "feat: add MRI AI overlays to viewer canvas"
```

---

### Task 7: Update Viewport Component to Pass Series ID

**Files:**
- Modify: `components/viewer/viewport.tsx`

**Step 1: Read current viewport.tsx**

```bash
cat components/viewer/viewport.tsx
```
Expected: View current implementation

**Step 2: Add seriesId prop to interface**

```typescript
interface ViewportProps {
  scanId: string;
  seriesId?: string;
  sliceIndex: number;
  totalSlices: number;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}
```

**Step 3: Pass seriesId to ViewerCanvas**

Find ViewerCanvas usage and add seriesId prop:

```typescript
<ViewerCanvas
  scanId={scanId}
  sliceIndex={sliceIndex}
  seriesId={seriesId}
  aiEnabled={true}
  className="absolute inset-0"
/>
```

**Step 4: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 5: Commit**

```bash
git add components/viewer/viewport.tsx
git commit -m "feat: add seriesId support to viewport"
```

---

### Task 8: Update ViewportGrid for Multi-Series Display

**Files:**
- Modify: `components/viewer/viewport-grid.tsx:1-73`

**Step 1: Update interface to accept per-viewport series IDs**

```typescript
export interface ViewportGridProps {
  layout: GridLayout;
  scanId: string;
  seriesIds?: string[];
  activeViewportIndex: number;
  onViewportClick: (index: number) => void;
}
```

**Step 2: Update viewport generation logic**

Replace viewport generation:

```typescript
// Generate viewport configurations based on layout
const viewports = Array.from({ length: config.count }, (_, index) => {
  // For multi-series view, assign series per viewport
  const seriesId = seriesIds && seriesIds[index] ? seriesIds[index] : seriesIds?.[0];

  // Use current slice index for all viewports
  const sliceIndex = currentSliceIndex;

  // Get total slices for this series
  const seriesSliceCount = seriesId ? getSeriesSliceCount(seriesId) : totalSlices;

  return {
    index,
    seriesId,
    sliceIndex,
    totalSlices: seriesSliceCount,
  };
});
```

**Step 3: Pass seriesId to Viewport components**

Update Viewport component call:

```typescript
<Viewport
  key={viewport.index}
  scanId={scanId}
  seriesId={viewport.seriesId}
  sliceIndex={viewport.sliceIndex}
  totalSlices={viewport.totalSlices}
  isActive={activeViewportIndex === viewport.index}
  onClick={() => onViewportClick(viewport.index)}
  className="min-h-0"
/>
```

**Step 4: Import helper functions**

Add to imports:

```typescript
import { getSeriesSliceCount } from '@/lib/dicom-loader';
```

**Step 5: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 6: Commit**

```bash
git add components/viewer/viewport-grid.tsx
git commit -m "feat: support per-viewport series assignment"
```

---

### Task 9: Create Series Selector Component

**Files:**
- Create: `components/viewer/series-selector.tsx`

**Step 1: Create component file**

```typescript
'use client';

import { MRISeries } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface SeriesSelectorProps {
  seriesList: MRISeries[];
  selectedSeriesId: string | null;
  onSeriesSelect: (seriesId: string) => void;
  activeViewportIndex: number;
}

const sequenceColors = {
  scout: 'bg-gray-600',
  t1: 'bg-blue-600',
  t2: 'bg-green-600',
  stir: 'bg-purple-600',
  flair: 'bg-yellow-600',
  dwi: 'bg-red-600',
};

export function SeriesSelector({
  seriesList,
  selectedSeriesId,
  onSeriesSelect,
  activeViewportIndex,
}: SeriesSelectorProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-text-muted px-3 pt-2">
        Viewport {activeViewportIndex + 1} - Select Series
      </p>
      {seriesList.map((series) => (
        <button
          key={series.seriesId}
          onClick={() => onSeriesSelect(series.seriesId)}
          className={cn(
            'w-full text-left px-3 py-2 rounded transition-colors',
            'hover:bg-white/5',
            selectedSeriesId === series.seriesId
              ? 'bg-primary/20 text-primary'
              : 'text-text-primary'
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                sequenceColors[series.sequence]
              )}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Series {series.seriesNumber}: {series.seriesName}
                </span>
                <span className="text-xs text-text-muted">
                  {series.sliceCount} img
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-text-muted uppercase">
                  {series.sequence}
                </span>
                <span className="text-xs text-text-muted/50">•</span>
                <span className="text-xs text-text-muted capitalize">
                  {series.orientation}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add components/viewer/series-selector.tsx
git commit -m "feat: add series selector component"
```

---

### Task 10: Update StudyBrowser to Show MRI Series

**Files:**
- Modify: `components/viewer/study-browser.tsx:1-229`

**Step 1: Import SeriesSelector**

```typescript
import { SeriesSelector } from './series-selector';
import { MRISeries, getSeriesByScanId } from '@/lib/mock-data';
```

**Step 2: Add state for series selection**

Add after component interface:

```typescript
export function StudyBrowser({
  scans,
  selectedScanId,
  onScanSelect,
  modality,
}: StudyBrowserProps) {
  const [selectedViewportSeries, setSelectedViewportSeries] = useState<
    Record<number, string>
  >({});

  // Get series for MRI scans
  const seriesList = firstScan?.id?.startsWith('mri-')
    ? getSeriesByScanId(firstScan.id)
    : [];
```

**Step 3: Add series section after SeriesList**

Insert after SeriesList closing div:

```typescript
{/* MRI Series Selection */}
{modality === 'MRI' && seriesList.length > 0 && (
  <div className="border-b border-white/10">
    <div className="p-3">
      <SeriesSelector
        seriesList={seriesList}
        selectedSeriesId={selectedViewportSeries[0] || seriesList[1]?.seriesId}
        onSeriesSelect={(seriesId) =>
          setSelectedViewportSeries({ ...selectedViewportSeries, 0: seriesId })
        }
        activeViewportIndex={0}
      />
    </div>
  </div>
)}
```

**Step 4: Pass series selection to parent**

Add to StudyBrowserProps interface:

```typescript
onSeriesSelect?: (viewportIndex: number, seriesId: string) => void;
```

**Step 5: Emit series selection events**

Update onSeriesSelect in SeriesSelector:

```typescript
<SeriesSelector
  seriesList={seriesList}
  selectedSeriesId={selectedViewportSeries[0] || seriesList[1]?.seriesId}
  onSeriesSelect={(seriesId) => {
    setSelectedViewportSeries({ ...selectedViewportSeries, 0: seriesId });
    onSeriesSelect?.(0, seriesId);
  }}
  activeViewportIndex={0}
/>
```

**Step 6: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 7: Commit**

```bash
git add components/viewer/study-browser.tsx
git commit -m "feat: add MRI series selection to study browser"
```

---

### Task 11: Update ViewerLayout for Multi-View MRI

**Files:**
- Modify: `components/viewer/viewer-layout.tsx:65-254`

**Step 1: Add state for viewport series assignments**

Add after layout state:

```typescript
const [viewportSeries, setViewportSeries] = useState<string[]>([]);
```

**Step 2: Initialize default series for 2x2 layout**

Add after scan effect:

```typescript
useEffect(() => {
  if (scan && modality === 'MRI' && scan.id === 'mri-shoulder-001') {
    // Default 2x2 grid series: T2, T1 SAG, STIR, T1 COR
    setViewportSeries([
      'mri-shoulder-001-s002', // T2
      'mri-shoulder-001-s003', // T1 SAG
      'mri-shoulder-001-s005', // STIR
      'mri-shoulder-001-s006', // T1 COR
    ]);
  }
}, [scan, modality]);
```

**Step 3: Pass viewport series to ViewportGrid**

Update ViewportGrid props:

```typescript
<ViewportGrid
  layout={layout}
  scanId={scan.id}
  seriesIds={viewportSeries}
  activeViewportIndex={activeViewport}
  onViewportClick={setActiveViewport}
/>
```

**Step 4: Add series selection handler**

Add before return statement:

```typescript
const handleSeriesSelect = (viewportIndex: number, seriesId: string) => {
  const newSeries = [...viewportSeries];
  newSeries[viewportIndex] = seriesId;
  setViewportSeries(newSeries);
};
```

**Step 5: Pass handler to StudyBrowser**

Update StudyBrowser props:

```typescript
<StudyBrowser
  scans={scans.length > 0 ? scans : [scan]}
  selectedScanId={scan.id}
  onScanSelect={handleScanSelect}
  onSeriesSelect={handleSeriesSelect}
  modality={modality}
/>
```

**Step 6: Set default layout to 2x2 for MRI**

Update initial layout state:

```typescript
const [layout, setLayout] = useState<GridLayout>(modality === 'MRI' ? '2x2' : '1x1');
```

**Step 7: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 8: Test locally**

Run: `npm run dev`
Navigate to: `/mri?scan=mri-shoulder-001`
Verify: 2x2 grid with different series, AI overlays visible

**Step 9: Commit**

```bash
git add components/viewer/viewer-layout.tsx
git commit -m "feat: implement multi-view MRI with 2x2 grid and series selection"
```

---

### Task 12: Add MRI Sequence Presets to Toolbar

**Files:**
- Modify: `components/viewer/viewer-toolbar.tsx`

**Step 1: Read current toolbar implementation**

```bash
cat components/viewer/viewer-toolbar.tsx
```
Expected: View current implementation

**Step 2: Add MRI sequence presets dropdown**

Add after existing modality-specific controls:

```typescript
{modality === 'MRI' && (
  <div className="flex items-center gap-2">
    <span className="text-xs text-text-muted">Sequence:</span>
    <select
      className="bg-dark border border-border rounded px-2 py-1 text-sm text-text-primary"
      defaultValue="t2"
    >
      <option value="t1">T1</option>
      <option value="t2">T2</option>
      <option value="stir">STIR</option>
      <option value="flair">FLAIR</option>
      <option value="dwi">DWI</option>
    </select>
  </div>
)}
```

**Step 3: Add preset labels to viewports**

Update ViewportGrid to show sequence badges in each viewport corner:

In viewport.tsx, add after ViewerCanvas:

```typescript
{seriesId && scanId?.startsWith('mri-') && (
  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
    <span className="text-xs font-semibold text-primary uppercase">
      {seriesId.includes('s002') ? 'T2' :
       seriesId.includes('s003') ? 'T1' :
       seriesId.includes('s005') ? 'STIR' :
       seriesId.includes('s006') ? 'T1' : 'MRI'}
    </span>
  </div>
)}
```

**Step 4: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 5: Commit**

```bash
git add components/viewer/viewer-toolbar.tsx components/viewer/viewport.tsx
git commit -m "feat: add MRI sequence presets and labels"
```

---

### Task 13: Update MRI Page with Real Data

**Files:**
- Modify: `app/mri/page.tsx:1-6`

**Step 1: Update MRI page to auto-select shoulder scan**

```typescript
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ViewerLayout } from '@/components/viewer/viewer-layout';

function MRIPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Auto-select MRI shoulder scan if no scan specified
    if (!searchParams.get('scan')) {
      const params = new URLSearchParams();
      params.set('scan', 'mri-shoulder-001');
      router.push(`/mri?${params.toString()}`);
    }
  }, [searchParams, router]);

  return <ViewerLayout modality="MRI" />;
}

export default function MRIPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg text-text-primary mb-2">Loading...</p>
        </div>
      </div>
    }>
      <MRIPageContent />
    </Suspense>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Test navigation**

Run: `npm run dev`
Navigate to: `/mri`
Verify: Auto-redirects to `/mri?scan=mri-shoulder-001`

**Step 4: Commit**

```bash
git add app/mri/page.tsx
git commit -m "feat: auto-select MRI shoulder scan on page load"
```

---

### Task 14: Add ROI Intensity Measurement Tool

**Files:**
- Create: `components/viewer/mri-roi-tool.tsx`

**Step 1: Create ROI tool component**

```typescript
'use client';

import { useState } from 'react';
import { Target, Plus } from 'lucide-react';
import { MRIMeasurement } from './panels/mri-measurements';

interface MRIROIToolProps {
  onMeasurementAdd: (measurement: MRIMeasurement) => void;
}

export function MRIROITool({ onMeasurementAdd }: MRIROIToolProps) {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDrawROI = () => {
    // MVP: Simulate ROI creation
    setIsDrawing(true);
    setTimeout(() => {
      const newMeasurement: MRIMeasurement = {
        id: Date.now().toString(),
        type: 'intensity-roi',
        value: 185.4,
        unit: 'mm²',
        location: 'Supraspinatus tendon',
        sequence: 't2',
        timestamp: new Date().toISOString(),
        intensityStats: {
          mean: 142.3,
          min: 98,
          max: 228,
          stdDev: 35.2,
        },
      };
      onMeasurementAdd(newMeasurement);
      setIsDrawing(false);
    }, 500);
  };

  return (
    <button
      onClick={handleDrawROI}
      disabled={isDrawing}
      className={`
        p-2 rounded-lg transition-all
        ${isDrawing
          ? 'bg-primary/30 cursor-wait'
          : 'bg-dark hover:bg-white/10'
        }
      `}
      title="Draw ROI intensity measurement"
    >
      {isDrawing ? (
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      ) : (
        <Target className="w-5 h-5 text-primary" />
      )}
    </button>
  );
}
```

**Step 2: Add ROI tool to toolbar**

In viewer-toolbar.tsx, add after AI toggle:

```typescript
{modality === 'MRI' && (
  <MRIROITool onMeasurementAdd={(m) => console.log('ROI measurement:', m)} />
)}
```

**Step 3: Import in toolbar**

```typescript
import { MRIROITool } from './mri-roi-tool';
```

**Step 4: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

**Step 5: Commit**

```bash
git add components/viewer/mri-roi-tool.tsx components/viewer/viewer-toolbar.tsx
git commit -m "feat: add MRI ROI intensity measurement tool"
```

---

### Task 15: Final Integration and Testing

**Files:**
- Test: All components

**Step 1: Verify all builds**

Run: `npm run build`
Expected: Successful build with no errors

**Step 2: Run development server**

Run: `npm run dev`
Expected: Server starts successfully

**Step 3: Test navigation**

Navigate to: `/mri`
Verify: Auto-redirects to shoulder scan, 2x2 grid displays

**Step 4: Test multi-series view**

Verify: Each viewport shows different series (T2, T1, STIR, T1 COR)
Verify: Series labels appear in viewport corners

**Step 5: Test AI overlays**

Verify: Numbered badges (①, ②, ③) appear on pathology regions
Verify: Confidence meters show below each badge
Verify: Hover effects work (optional for MVP)

**Step 6: Test series selection**

Verify: Can select different series from study browser
Verify: Viewport updates with new series

**Step 7: Test layout switching**

Verify: Can switch between 1x1, 1x2, 2x2 layouts
Verify: Default remains 2x2 for MRI

**Step 8: Test ROI tool**

Verify: ROI tool button exists in toolbar
Verify: Clicking adds mock measurement (MVP)

**Step 9: Check responsiveness**

Resize browser window
Verify: Grid adjusts properly, viewports maintain aspect ratio

**Step 10: Final commit**

```bash
git status
git add .
git commit -m "feat: complete MRI multi-view MVP implementation"
```

**Step 11: Push to remote**

```bash
git push origin feature/mri-multi-view-mvp
```

---

## Testing Strategy

### Manual Testing Checklist

- [ ] MRI page loads and auto-selects shoulder scan
- [ ] 2x2 grid displays by default
- [ ] All four viewports show different series
- [ ] Series labels (T2, T1, STIR) visible in corners
- [ ] AI overlay badges appear with correct numbering
- [ ] Confidence meters display below badges
- [ ] Series selector shows all 6 series
- [ ] Selecting series updates viewport
- [ ] Layout switcher works (1x1, 1x2, 2x2, 3x3)
- [ ] ROI tool button visible
- [ ] Slice navigation works in active viewport
- [ ] Responsive design works on resize
- [ ] No console errors
- [ ] Build completes successfully

### Browser Compatibility

Test on:
- Chrome/Edge (Chromium)
- Firefox
- Safari

### Performance Considerations

- DICOM loading should complete within 3-5 seconds
- AI overlay animations should be smooth (60fps)
- Grid layout changes should be instantaneous

---

## Success Criteria

1. ✅ MRI page displays real DICOM data from shoulder study
2. ✅ Multi-view (2x2) layout shows different series
3. ✅ AI overlays with numbered badges visible
4. ✅ Series selector functional
5. ✅ Layout switcher works
6. ✅ Looks professional and clean
7. ✅ No functional bugs or console errors
8. ✅ Responsive design works
9. ✅ Build passes without errors

---

## Notes for Implementation

- Keep animations smooth but minimal
- Ensure contrast is sufficient for medical imaging
- Preserve existing CT and X-ray functionality
- Use existing color scheme and styling
- MVP focus: Visual impact over complete functionality
- AI overlays are static (mock data) for MVP
- ROI measurements are simulated (not interactive)
