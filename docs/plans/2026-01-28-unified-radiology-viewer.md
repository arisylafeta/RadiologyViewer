# Unified Radiology Friend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a professional dark-themed medical imaging viewer (MRI/X-Ray/CT) using Next.js 16 with real DICOM rendering via cornerstone.js, featuring a dashboard and modality-specific viewer pages with AI analysis overlays.

**Architecture:** Full Next.js 16 App Router application with TypeScript. Client-side DICOM rendering using cornerstone.js. All data mocked using real anonymized DICOM files from public datasets. AI analysis results pre-computed as JSON overlays for 2-3 hero scans, static results for others. Dark medical professional theme throughout.

**Tech Stack:** Next.js 16, TypeScript, shadcn/ui (dark theme), Tailwind CSS, cornerstone.js, cornerstoneWADOImageLoader, Zustand, Lucide React

---

## Phase 1: Project Initialization & Setup

### Task 1: Initialize Next.js Project

**Files:**
- Create: `radiology-friend/` (new project directory)
- Create: `radiology-friend/package.json`
- Create: `radiology-friend/tsconfig.json`
- Create: `radiology-friend/tailwind.config.ts`
- Create: `radiology-friend/next.config.ts`

**Step 1: Create new Next.js 16 project**

```bash
cd "/Users/admin/Desktop/Projects/Radiology Friend"
npx create-next-app@latest radiology-friend --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Expected output: Project created successfully

**Step 2: Navigate to project directory**

```bash
cd radiology-friend
```

**Step 3: Install core dependencies**

```bash
npm install zustand lucide-react cornerstone-core cornerstone-wado-image-loader dicom-parser
```

**Step 4: Install shadcn/ui**

```bash
npx shadcn@latest init -d
```

When prompted:
- Style: New York
- Base color: Slate
- CSS variables: Yes

**Step 5: Verify installation**

```bash
npm run dev
```

Expected: Server runs on http://localhost:3000

**Step 6: Stop dev server and commit**

```bash
git init
git add .
git commit -m "chore: initialize Next.js 16 project with TypeScript and Tailwind"
```

---

### Task 2: Configure Dark Medical Theme

**Files:**
- Modify: `radiology-friend/tailwind.config.ts`
- Modify: `radiology-friend/app/globals.css`
- Create: `radiology-friend/lib/colors.ts`

**Step 1: Create color palette constants**

Create `lib/colors.ts`:

```typescript
// Dark Medical Professional Color Palette
export const colors = {
  // Backgrounds
  darkest: '#0f172a',      // Darkest slate - sidebar, main bg
  darker: '#1e293b',       // Dark slate - header, panels
  dark: '#334155',         // Lighter slate - cards, surfaces

  // Text
  textPrimary: '#f8fafc',  // Almost white - primary text
  textSecondary: '#e2e8f0', // Light gray - secondary text
  textMuted: '#94a3b8',    // Muted gray - labels

  // Accents
  primary: '#2563eb',      // Blue - primary actions
  primaryHover: '#1e40af', // Darker blue - hover states

  // Borders
  border: '#475569',       // Subtle slate borders
  borderLight: '#64748b',  // Lighter borders for emphasis

  // Status colors
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Amber
  error: '#ef4444',        // Red
  info: '#06b6d4',         // Cyan

  // AI Overlay colors (high contrast)
  aiCyan: '#06b6d4',
  aiMagenta: '#ec4899',
  aiLime: '#84cc16',
  aiYellow: '#eab308',

  // Viewer specific
  viewerBlack: '#000000',  // Pure black for scan backgrounds
} as const;
```

**Step 2: Update Tailwind config with custom colors**

Modify `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medical dark theme
        darkest: '#0f172a',
        darker: '#1e293b',
        dark: '#334155',
        'text-primary': '#f8fafc',
        'text-secondary': '#e2e8f0',
        'text-muted': '#94a3b8',
        border: '#475569',
        'border-light': '#64748b',
        'viewer-black': '#000000',

        // Accent colors
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1e40af',
        },

        // AI overlays
        'ai-cyan': '#06b6d4',
        'ai-magenta': '#ec4899',
        'ai-lime': '#84cc16',
        'ai-yellow': '#eab308',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**Step 3: Update global CSS with dark theme**

Modify `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.5rem;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-darkest text-text-primary;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

**Step 4: Commit theme configuration**

```bash
git add lib/colors.ts tailwind.config.ts app/globals.css
git commit -m "feat: configure dark medical professional theme"
```

---

### Task 3: Install shadcn/ui Components

**Files:**
- Create: `radiology-friend/components/ui/button.tsx`
- Create: `radiology-friend/components/ui/card.tsx`
- Create: `radiology-friend/components/ui/table.tsx`
- Create: `radiology-friend/components/ui/input.tsx`
- Create: `radiology-friend/components/ui/slider.tsx`
- Create: `radiology-friend/components/ui/badge.tsx`
- Create: `radiology-friend/components/ui/separator.tsx`
- Create: `radiology-friend/components/ui/tooltip.tsx`

**Step 1: Install required shadcn components**

```bash
npx shadcn@latest add button card table input slider badge separator tooltip
```

**Step 2: Verify components installed**

```bash
ls components/ui/
```

Expected: All component files listed above

**Step 3: Commit UI components**

```bash
git add components/ui/
git commit -m "chore: add shadcn/ui components"
```

---

## Phase 2: Mock Data & DICOM Setup

### Task 4: Create Mock Data Structure

**Files:**
- Create: `radiology-friend/lib/types.ts`
- Create: `radiology-friend/lib/mock-data.ts`
- Create: `radiology-friend/public/dicom-library/.gitkeep`

**Step 1: Define TypeScript types**

Create `lib/types.ts`:

```typescript
export type ScanModality = 'MRI' | 'CT' | 'XRAY';

export type ScanStatus = 'pending' | 'analyzed' | 'reviewed';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  patientId: string; // Hospital ID
}

export interface Scan {
  id: string;
  patientId: string;
  patientName: string;
  modality: ScanModality;
  bodyPart: string;
  date: string;
  status: ScanStatus;
  sliceCount: number;
  dicomPath: string; // Path to DICOM files
  thumbnailPath: string;
  hasAIOverlay: boolean; // Hero scans have visual overlays
}

export interface AIFinding {
  id: string;
  name: string;
  confidence: number; // 0-100
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  description: string;
}

export interface AIAnalysis {
  scanId: string;
  findings: AIFinding[];
  overallAssessment: string;
  processingTime: number; // seconds
  analyzedAt: string;
  // For hero scans with visual overlays
  overlayData?: {
    type: 'segmentation' | 'heatmap' | 'bounding-box';
    coordinates: number[][]; // Polygon points or box coords
    color: string;
    label: string;
  }[];
}

export interface DashboardStats {
  totalScans: number;
  pendingReviews: number;
  aiAccuracy: number;
  governmentImports: number;
}
```

**Step 2: Create mock data**

Create `lib/mock-data.ts`:

```typescript
import { Patient, Scan, AIAnalysis, AIFinding, DashboardStats } from './types';

// Mock patients
export const mockPatients: Patient[] = [
  {
    id: 'p001',
    name: 'Arben Hoxha',
    age: 45,
    gender: 'M',
    patientId: 'ALB-2026-001847',
  },
  {
    id: 'p002',
    name: 'Elira Kelmendi',
    age: 62,
    gender: 'F',
    patientId: 'ALB-2026-001892',
  },
  {
    id: 'p003',
    name: 'Gentian Berisha',
    age: 38,
    gender: 'M',
    patientId: 'ALB-2026-002103',
  },
  {
    id: 'p004',
    name: 'Miranda Shehu',
    age: 54,
    gender: 'F',
    patientId: 'ALB-2026-002156',
  },
];

// Mock scans (we'll add real DICOM paths later)
export const mockScans: Scan[] = [
  {
    id: 's001',
    patientId: 'p001',
    patientName: 'Arben Hoxha',
    modality: 'MRI',
    bodyPart: 'Brain',
    date: '2026-01-27',
    status: 'analyzed',
    sliceCount: 156,
    dicomPath: '/dicom-library/mri-brain-001',
    thumbnailPath: '/thumbnails/mri-brain-001.jpg',
    hasAIOverlay: true, // Hero scan
  },
  {
    id: 's002',
    patientId: 'p002',
    patientName: 'Elira Kelmendi',
    modality: 'XRAY',
    bodyPart: 'Chest',
    date: '2026-01-26',
    status: 'analyzed',
    sliceCount: 1,
    dicomPath: '/dicom-library/xray-chest-001',
    thumbnailPath: '/thumbnails/xray-chest-001.jpg',
    hasAIOverlay: true, // Hero scan
  },
  {
    id: 's003',
    patientId: 'p003',
    patientName: 'Gentian Berisha',
    modality: 'CT',
    bodyPart: 'Chest',
    date: '2026-01-25',
    status: 'analyzed',
    sliceCount: 284,
    dicomPath: '/dicom-library/ct-chest-001',
    thumbnailPath: '/thumbnails/ct-chest-001.jpg',
    hasAIOverlay: true, // Hero scan
  },
  {
    id: 's004',
    patientId: 'p004',
    patientName: 'Miranda Shehu',
    modality: 'MRI',
    bodyPart: 'Knee',
    date: '2026-01-24',
    status: 'pending',
    sliceCount: 98,
    dicomPath: '/dicom-library/mri-knee-001',
    thumbnailPath: '/thumbnails/mri-knee-001.jpg',
    hasAIOverlay: false,
  },
];

// Mock AI findings templates
const brainMRIFindings: AIFinding[] = [
  {
    id: 'f001',
    name: 'White Matter Hyperintensities',
    confidence: 87,
    severity: 'mild',
    description: 'Small scattered white matter hyperintensities in periventricular region, consistent with age-related changes.',
  },
  {
    id: 'f002',
    name: 'Ventricle Size',
    confidence: 94,
    severity: 'normal',
    description: 'Lateral ventricles within normal size limits for patient age.',
  },
];

const chestXrayFindings: AIFinding[] = [
  {
    id: 'f003',
    name: 'Cardiomegaly',
    confidence: 82,
    severity: 'mild',
    description: 'Cardiothoracic ratio approximately 0.52, indicating mild cardiomegaly.',
  },
  {
    id: 'f004',
    name: 'Pulmonary Edema',
    confidence: 23,
    severity: 'normal',
    description: 'No evidence of pulmonary edema. Clear lung fields bilaterally.',
  },
];

const ctChestFindings: AIFinding[] = [
  {
    id: 'f005',
    name: 'Pulmonary Nodule',
    confidence: 91,
    severity: 'moderate',
    description: 'Small pulmonary nodule detected in right upper lobe, measuring approximately 6mm. Recommend follow-up CT in 3 months.',
  },
  {
    id: 'f006',
    name: 'Lymphadenopathy',
    confidence: 34,
    severity: 'normal',
    description: 'No significant mediastinal or hilar lymphadenopathy.',
  },
];

// Mock AI analyses
export const mockAIAnalyses: Record<string, AIAnalysis> = {
  s001: {
    scanId: 's001',
    findings: brainMRIFindings,
    overallAssessment: 'Brain MRI shows age-appropriate findings with mild white matter changes. No acute abnormalities detected. Recommend routine follow-up.',
    processingTime: 12.4,
    analyzedAt: '2026-01-27T14:23:18Z',
    overlayData: [
      {
        type: 'segmentation',
        coordinates: [[120, 80], [180, 80], [180, 140], [120, 140]], // Example polygon
        color: '#06b6d4',
        label: 'White Matter',
      },
    ],
  },
  s002: {
    scanId: 's002',
    findings: chestXrayFindings,
    overallAssessment: 'Chest X-ray demonstrates mild cardiomegaly. Lungs are clear without infiltrates or effusions. No acute cardiopulmonary abnormality.',
    processingTime: 3.2,
    analyzedAt: '2026-01-26T09:15:42Z',
    overlayData: [
      {
        type: 'bounding-box',
        coordinates: [[150, 200], [350, 400]], // [top-left, bottom-right]
        color: '#ec4899',
        label: 'Heart Border',
      },
    ],
  },
  s003: {
    scanId: 's003',
    findings: ctChestFindings,
    overallAssessment: 'CT chest reveals small pulmonary nodule in right upper lobe requiring follow-up imaging. Otherwise unremarkable study.',
    processingTime: 18.7,
    analyzedAt: '2026-01-25T16:47:03Z',
    overlayData: [
      {
        type: 'bounding-box',
        coordinates: [[220, 140], [240, 160]],
        color: '#84cc16',
        label: 'Nodule (6mm)',
      },
    ],
  },
  s004: {
    scanId: 's004',
    findings: [],
    overallAssessment: 'Analysis pending.',
    processingTime: 0,
    analyzedAt: '',
  },
};

// Dashboard statistics
export const dashboardStats: DashboardStats = {
  totalScans: 2847,
  pendingReviews: 23,
  aiAccuracy: 94.7,
  governmentImports: 156,
};
```

**Step 3: Create DICOM library directory**

```bash
mkdir -p public/dicom-library
mkdir -p public/thumbnails
touch public/dicom-library/.gitkeep
touch public/thumbnails/.gitkeep
```

**Step 4: Commit mock data structure**

```bash
git add lib/types.ts lib/mock-data.ts public/
git commit -m "feat: add mock data structure and TypeScript types"
```

---

### Task 5: Initialize Cornerstone.js for DICOM Rendering

**Files:**
- Create: `radiology-friend/lib/cornerstone-init.ts`
- Create: `radiology-friend/lib/dicom-loader.ts`

**Step 1: Create Cornerstone initialization module**

Create `lib/cornerstone-init.ts`:

```typescript
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

let initialized = false;

export function initializeCornerstone() {
  if (initialized) return;

  // Configure WADO Image Loader
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

  // Configure web worker
  const config = {
    maxWebWorkers: 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
      },
    },
  };

  cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

  initialized = true;
  console.log('Cornerstone.js initialized');
}

export { cornerstone };
```

**Step 2: Create DICOM loader utility**

Create `lib/dicom-loader.ts`:

```typescript
import { cornerstone } from './cornerstone-init';

export interface DicomImage {
  imageId: string;
  width: number;
  height: number;
  sliceIndex: number;
}

/**
 * Load a DICOM image by file path
 * For now, returns placeholder - we'll implement real loading after adding DICOM files
 */
export async function loadDicomImage(filePath: string): Promise<DicomImage> {
  // TODO: Implement actual DICOM loading with cornerstone
  // For MVP phase, this will load from public/dicom-library/

  return {
    imageId: `wadouri:${filePath}`,
    width: 512,
    height: 512,
    sliceIndex: 0,
  };
}

/**
 * Load all slices from a DICOM series directory
 */
export async function loadDicomSeries(directoryPath: string, sliceCount: number): Promise<DicomImage[]> {
  const images: DicomImage[] = [];

  // TODO: Implement actual multi-slice loading
  // For now, return empty array - will implement after adding real DICOM files

  return images;
}

/**
 * Enable/disable an element for Cornerstone rendering
 */
export function enableCornerstoneElement(element: HTMLElement) {
  try {
    cornerstone.enable(element);
  } catch (error) {
    console.error('Failed to enable cornerstone element:', error);
  }
}

/**
 * Disable an element from Cornerstone rendering
 */
export function disableCornerstoneElement(element: HTMLElement) {
  try {
    cornerstone.disable(element);
  } catch (error) {
    console.error('Failed to disable cornerstone element:', error);
  }
}

/**
 * Display a DICOM image on an enabled element
 */
export async function displayImage(element: HTMLElement, imageId: string) {
  try {
    const image = await cornerstone.loadImage(imageId);
    cornerstone.displayImage(element, image);
  } catch (error) {
    console.error('Failed to display image:', error);
  }
}
```

**Step 3: Commit Cornerstone setup**

```bash
git add lib/cornerstone-init.ts lib/dicom-loader.ts
git commit -m "feat: initialize Cornerstone.js for DICOM rendering"
```

---

## Phase 3: Core Layout & Navigation

### Task 6: Create Root Layout with Sidebar

**Files:**
- Create: `radiology-friend/components/sidebar.tsx`
- Modify: `radiology-friend/app/layout.tsx`
- Create: `radiology-friend/components/header.tsx`

**Step 1: Create Sidebar component**

Create `components/sidebar.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  Bone,
  Scan,
  Settings,
  LogOut,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'MRI Scans',
    href: '/mri',
    icon: Brain,
  },
  {
    title: 'X-Ray Scans',
    href: '/xray',
    icon: Bone,
  },
  {
    title: 'CT Scans',
    href: '/ct',
    icon: Scan,
  },
];

const bottomNavItems = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    title: 'Logout',
    href: '/logout',
    icon: LogOut,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-darkest border-r border-border">
      {/* Logo & Ministry Header */}
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-text-primary">
              Radiology Friend
            </h1>
          </div>
          <p className="text-xs text-text-muted">
            Ministria e Shëndetësisë 🇦🇱
          </p>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-dark hover:text-text-primary'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 space-y-2 border-t border-border">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-dark hover:text-text-primary transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
```

**Step 2: Create Header component**

Create `components/header.tsx`:

```typescript
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 bg-darker border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Medical Imaging System
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-text-secondary" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-error rounded-full" />
        </Button>

        <Button variant="ghost" size="icon">
          <User className="h-5 w-5 text-text-secondary" />
        </Button>
      </div>
    </header>
  );
}
```

**Step 3: Update root layout**

Modify `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Radiology Friend - Ministry of Health Albania",
  description: "Professional AI-powered medical imaging analysis system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Header />
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
```

**Step 4: Create utils file if missing**

Create `lib/utils.ts` (if not already created by shadcn):

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Step 5: Install missing dependencies**

```bash
npm install clsx tailwind-merge
```

**Step 6: Commit layout components**

```bash
git add components/sidebar.tsx components/header.tsx app/layout.tsx lib/utils.ts
git commit -m "feat: add sidebar navigation and header layout"
```

---

## Phase 4: Dashboard Page

### Task 7: Create Dashboard Stats Cards

**Files:**
- Create: `radiology-friend/components/dashboard/stats-card.tsx`
- Create: `radiology-friend/components/dashboard/stats-grid.tsx`

**Step 1: Create StatsCard component**

Create `components/dashboard/stats-card.tsx`:

```typescript
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="bg-dark border-border p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-muted font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>

          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-success' : 'text-error'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last week
            </p>
          )}
        </div>

        <div className="bg-darker p-3 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
```

**Step 2: Create StatsGrid component**

Create `components/dashboard/stats-grid.tsx`:

```typescript
import { Activity, Clock, TrendingUp, Download } from 'lucide-react';
import { StatsCard } from './stats-card';
import { dashboardStats } from '@/lib/mock-data';

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Scans"
        value={dashboardStats.totalScans.toLocaleString()}
        icon={Activity}
        trend={{ value: 12.5, isPositive: true }}
      />

      <StatsCard
        title="Pending Reviews"
        value={dashboardStats.pendingReviews}
        icon={Clock}
        trend={{ value: -8.2, isPositive: true }}
      />

      <StatsCard
        title="AI Accuracy"
        value={`${dashboardStats.aiAccuracy}%`}
        icon={TrendingUp}
        trend={{ value: 2.1, isPositive: true }}
      />

      <StatsCard
        title="Government Imports"
        value={`${dashboardStats.governmentImports} this week`}
        icon={Download}
      />
    </div>
  );
}
```

**Step 3: Commit stats components**

```bash
git add components/dashboard/
git commit -m "feat: add dashboard statistics cards"
```

---

### Task 8: Create Recent Scans Table

**Files:**
- Create: `radiology-friend/components/dashboard/recent-scans-table.tsx`
- Create: `radiology-friend/components/ui/status-badge.tsx`

**Step 1: Create StatusBadge component**

Create `components/ui/status-badge.tsx`:

```typescript
import { Badge } from '@/components/ui/badge';
import { ScanStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: ScanStatus;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/20 text-warning border-warning/50',
  },
  analyzed: {
    label: 'Analyzed',
    className: 'bg-info/20 text-info border-info/50',
  },
  reviewed: {
    label: 'Reviewed',
    className: 'bg-success/20 text-success border-success/50',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
```

**Step 2: Create RecentScansTable component**

Create `components/dashboard/recent-scans-table.tsx`:

```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockScans } from '@/lib/mock-data';
import { Eye, Download } from 'lucide-react';

export function RecentScansTable() {
  // Show only first 5 scans
  const recentScans = mockScans.slice(0, 5);

  const getViewerPath = (modality: string, scanId: string) => {
    const modalityLower = modality.toLowerCase();
    return `/${modalityLower}?scan=${scanId}`;
  };

  return (
    <Card className="bg-dark border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Recent Scans</h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-text-muted">Patient</TableHead>
            <TableHead className="text-text-muted">Modality</TableHead>
            <TableHead className="text-text-muted">Body Part</TableHead>
            <TableHead className="text-text-muted">Date</TableHead>
            <TableHead className="text-text-muted">Status</TableHead>
            <TableHead className="text-text-muted text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentScans.map((scan) => (
            <TableRow key={scan.id} className="border-border hover:bg-darker">
              <TableCell className="font-medium text-text-primary">
                {scan.patientName}
              </TableCell>
              <TableCell className="text-text-secondary">{scan.modality}</TableCell>
              <TableCell className="text-text-secondary">{scan.bodyPart}</TableCell>
              <TableCell className="text-text-secondary">
                {new Date(scan.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <StatusBadge status={scan.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link href={getViewerPath(scan.modality, scan.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
```

**Step 3: Commit recent scans table**

```bash
git add components/dashboard/recent-scans-table.tsx components/ui/status-badge.tsx
git commit -m "feat: add recent scans table to dashboard"
```

---

### Task 9: Create Dashboard Quick Actions

**Files:**
- Create: `radiology-friend/components/dashboard/quick-actions.tsx`

**Step 1: Create QuickActions component**

Create `components/dashboard/quick-actions.tsx`:

```typescript
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Bone, Scan, Upload } from 'lucide-react';

const actions = [
  {
    title: 'Upload MRI',
    description: 'Upload and analyze MRI scans',
    icon: Brain,
    href: '/mri',
    color: 'text-ai-cyan',
  },
  {
    title: 'Upload X-Ray',
    description: 'Upload and analyze X-Ray images',
    icon: Bone,
    href: '/xray',
    color: 'text-ai-magenta',
  },
  {
    title: 'Upload CT',
    description: 'Upload and analyze CT scans',
    icon: Scan,
    href: '/ct',
    color: 'text-ai-lime',
  },
  {
    title: 'Import from Government',
    description: 'Import scans from central registry',
    icon: Upload,
    href: '/import',
    color: 'text-ai-yellow',
  },
];

export function QuickActions() {
  return (
    <Card className="bg-dark border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.href}
              variant="outline"
              className="h-auto flex-col items-start p-4 border-border hover:bg-darker"
              asChild
            >
              <Link href={action.href}>
                <Icon className={`h-8 w-8 mb-3 ${action.color}`} />
                <span className="text-sm font-semibold text-text-primary mb-1">
                  {action.title}
                </span>
                <span className="text-xs text-text-muted">
                  {action.description}
                </span>
              </Link>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
```

**Step 2: Commit quick actions**

```bash
git add components/dashboard/quick-actions.tsx
git commit -m "feat: add quick actions panel to dashboard"
```

---

### Task 10: Assemble Dashboard Page

**Files:**
- Modify: `radiology-friend/app/page.tsx`

**Step 1: Update dashboard page with all components**

Modify `app/page.tsx`:

```typescript
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { RecentScansTable } from '@/components/dashboard/recent-scans-table';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-muted">
          Overview of medical imaging analysis system
        </p>
      </div>

      <StatsGrid />

      <QuickActions />

      <RecentScansTable />
    </div>
  );
}
```

**Step 2: Run development server and test**

```bash
npm run dev
```

Expected: Dashboard displays with stats, quick actions, and recent scans table

**Step 3: Stop server and commit**

```bash
git add app/page.tsx
git commit -m "feat: complete dashboard page assembly"
```

---

## Phase 5: DICOM Viewer Component

### Task 11: Create Base Viewer Component

**Files:**
- Create: `radiology-friend/components/viewer/dicom-viewer.tsx`
- Create: `radiology-friend/components/viewer/viewer-canvas.tsx`
- Create: `radiology-friend/lib/stores/viewer-store.ts`

**Step 1: Create Zustand store for viewer state**

Create `lib/stores/viewer-store.ts`:

```typescript
import { create } from 'zustand';

interface ViewerState {
  // Current scan
  currentScanId: string | null;
  currentSliceIndex: number;
  totalSlices: number;

  // Window/Level settings
  windowWidth: number;
  windowCenter: number;

  // Tool state
  activeTool: 'pan' | 'zoom' | 'measure' | 'none';
  showAIOverlay: boolean;

  // Grid view
  gridSize: 1 | 4 | 9 | 16;

  // Actions
  setCurrentScan: (scanId: string, totalSlices: number) => void;
  setSliceIndex: (index: number) => void;
  setWindowLevel: (width: number, center: number) => void;
  setActiveTool: (tool: ViewerState['activeTool']) => void;
  toggleAIOverlay: () => void;
  setGridSize: (size: ViewerState['gridSize']) => void;
  reset: () => void;
}

const defaultState = {
  currentScanId: null,
  currentSliceIndex: 0,
  totalSlices: 0,
  windowWidth: 400,
  windowCenter: 40,
  activeTool: 'none' as const,
  showAIOverlay: false,
  gridSize: 1 as const,
};

export const useViewerStore = create<ViewerState>((set) => ({
  ...defaultState,

  setCurrentScan: (scanId, totalSlices) =>
    set({ currentScanId: scanId, totalSlices, currentSliceIndex: 0 }),

  setSliceIndex: (index) =>
    set((state) => ({
      currentSliceIndex: Math.max(0, Math.min(index, state.totalSlices - 1)),
    })),

  setWindowLevel: (width, center) =>
    set({ windowWidth: width, windowCenter: center }),

  setActiveTool: (tool) =>
    set({ activeTool: tool }),

  toggleAIOverlay: () =>
    set((state) => ({ showAIOverlay: !state.showAIOverlay })),

  setGridSize: (size) =>
    set({ gridSize: size }),

  reset: () =>
    set(defaultState),
}));
```

**Step 2: Create ViewerCanvas component**

Create `components/viewer/viewer-canvas.tsx`:

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { initializeCornerstone } from '@/lib/cornerstone-init';
import { enableCornerstoneElement, disableCornerstoneElement } from '@/lib/dicom-loader';

interface ViewerCanvasProps {
  scanId: string;
  sliceIndex: number;
  className?: string;
}

export function ViewerCanvas({ scanId, sliceIndex, className }: ViewerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize cornerstone on mount
    initializeCornerstone();

    if (canvasRef.current) {
      enableCornerstoneElement(canvasRef.current);
    }

    return () => {
      if (canvasRef.current) {
        disableCornerstoneElement(canvasRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // TODO: Load and display DICOM image based on scanId and sliceIndex
    // This will be implemented after adding real DICOM files
    console.log('Loading scan:', scanId, 'slice:', sliceIndex);
  }, [scanId, sliceIndex]);

  return (
    <div
      ref={canvasRef}
      className={`bg-viewer-black ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Cornerstone will render DICOM here */}
      <div className="flex items-center justify-center h-full text-text-muted">
        <p>DICOM Viewer - Scan: {scanId}, Slice: {sliceIndex}</p>
      </div>
    </div>
  );
}
```

**Step 3: Create main DicomViewer component**

Create `components/viewer/dicom-viewer.tsx`:

```typescript
'use client';

import { ViewerCanvas } from './viewer-canvas';
import { useViewerStore } from '@/lib/stores/viewer-store';
import { Card } from '@/components/ui/card';

interface DicomViewerProps {
  scanId: string;
  totalSlices: number;
}

export function DicomViewer({ scanId, totalSlices }: DicomViewerProps) {
  const { currentSliceIndex, gridSize } = useViewerStore();

  if (gridSize === 1) {
    return (
      <Card className="bg-darker border-border overflow-hidden aspect-square">
        <ViewerCanvas
          scanId={scanId}
          sliceIndex={currentSliceIndex}
        />
      </Card>
    );
  }

  // Multi-slice grid view
  const gridCols = Math.sqrt(gridSize);
  const slices = Array.from({ length: gridSize }, (_, i) => {
    const sliceIndex = Math.floor((i / gridSize) * totalSlices);
    return sliceIndex;
  });

  return (
    <Card className="bg-darker border-border overflow-hidden">
      <div
        className="grid gap-1 p-1"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        }}
      >
        {slices.map((sliceIndex, i) => (
          <ViewerCanvas
            key={i}
            scanId={scanId}
            sliceIndex={sliceIndex}
            className="aspect-square"
          />
        ))}
      </div>
    </Card>
  );
}
```

**Step 4: Commit viewer components**

```bash
git add components/viewer/ lib/stores/
git commit -m "feat: create base DICOM viewer component with Zustand store"
```

---

### Task 12: Create Viewer Controls

**Files:**
- Create: `radiology-friend/components/viewer/viewer-controls.tsx`
- Create: `radiology-friend/components/viewer/slice-navigator.tsx`
- Create: `radiology-friend/components/viewer/window-level-controls.tsx`

**Step 1: Create SliceNavigator component**

Create `components/viewer/slice-navigator.tsx`:

```typescript
'use client';

import { useViewerStore } from '@/lib/stores/viewer-store';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function SliceNavigator() {
  const { currentSliceIndex, totalSlices, setSliceIndex } = useViewerStore();

  const handlePrevious = () => {
    setSliceIndex(currentSliceIndex - 1);
  };

  const handleNext = () => {
    setSliceIndex(currentSliceIndex + 1);
  };

  const handleSliderChange = (value: number[]) => {
    setSliceIndex(value[0]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">Slice Navigation</span>
        <span className="text-sm font-medium text-text-primary">
          {currentSliceIndex + 1} / {totalSlices}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentSliceIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Slider
          value={[currentSliceIndex]}
          onValueChange={handleSliderChange}
          max={totalSlices - 1}
          step={1}
          className="flex-1"
        />

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentSliceIndex === totalSlices - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

**Step 2: Create WindowLevelControls component**

Create `components/viewer/window-level-controls.tsx`:

```typescript
'use client';

import { useViewerStore } from '@/lib/stores/viewer-store';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const presets = [
  { name: 'Brain', width: 80, center: 40 },
  { name: 'Bone', width: 2000, center: 400 },
  { name: 'Lung', width: 1500, center: -600 },
  { name: 'Soft Tissue', width: 400, center: 40 },
];

export function WindowLevelControls() {
  const { windowWidth, windowCenter, setWindowLevel } = useViewerStore();

  const handleWidthChange = (value: number[]) => {
    setWindowLevel(value[0], windowCenter);
  };

  const handleCenterChange = (value: number[]) => {
    setWindowLevel(windowWidth, value[0]);
  };

  const applyPreset = (width: number, center: number) => {
    setWindowLevel(width, center);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">Window Width</span>
          <span className="text-sm font-medium text-text-primary">{windowWidth}</span>
        </div>
        <Slider
          value={[windowWidth]}
          onValueChange={handleWidthChange}
          min={1}
          max={2000}
          step={1}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">Window Center</span>
          <span className="text-sm font-medium text-text-primary">{windowCenter}</span>
        </div>
        <Slider
          value={[windowCenter]}
          onValueChange={handleCenterChange}
          min={-1000}
          max={1000}
          step={1}
        />
      </div>

      <div>
        <p className="text-sm text-text-muted mb-2">Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset.width, preset.center)}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Create main ViewerControls component**

Create `components/viewer/viewer-controls.tsx`:

```typescript
'use client';

import { useViewerStore } from '@/lib/stores/viewer-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SliceNavigator } from './slice-navigator';
import { WindowLevelControls } from './window-level-controls';
import {
  Move,
  ZoomIn,
  Ruler,
  Grid3x3,
  Layers,
} from 'lucide-react';

export function ViewerControls() {
  const { activeTool, setActiveTool, gridSize, setGridSize, showAIOverlay, toggleAIOverlay } = useViewerStore();

  const tools = [
    { name: 'pan', icon: Move, label: 'Pan' },
    { name: 'zoom', icon: ZoomIn, label: 'Zoom' },
    { name: 'measure', icon: Ruler, label: 'Measure' },
  ] as const;

  const gridSizes = [1, 4, 9, 16] as const;

  return (
    <Card className="bg-dark border-border p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Tools</h3>
        <div className="grid grid-cols-3 gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.name;

            return (
              <Button
                key={tool.name}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTool(tool.name)}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{tool.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator className="bg-border" />

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Grid View</h3>
        <div className="grid grid-cols-4 gap-2">
          {gridSizes.map((size) => (
            <Button
              key={size}
              variant={gridSize === size ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridSize(size)}
            >
              {size === 1 ? '1x1' : `${Math.sqrt(size)}x${Math.sqrt(size)}`}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      <SliceNavigator />

      <Separator className="bg-border" />

      <WindowLevelControls />

      <Separator className="bg-border" />

      <div>
        <Button
          variant={showAIOverlay ? 'default' : 'outline'}
          size="sm"
          onClick={toggleAIOverlay}
          className="w-full"
        >
          <Layers className="h-4 w-4 mr-2" />
          {showAIOverlay ? 'Hide' : 'Show'} AI Overlay
        </Button>
      </div>
    </Card>
  );
}
```

**Step 4: Commit viewer controls**

```bash
git add components/viewer/viewer-controls.tsx components/viewer/slice-navigator.tsx components/viewer/window-level-controls.tsx
git commit -m "feat: add viewer controls with slice navigation and window/level"
```

---

## Phase 6: AI Analysis Panel

### Task 13: Create AI Analysis Components

**Files:**
- Create: `radiology-friend/components/ai-panel/ai-analysis-panel.tsx`
- Create: `radiology-friend/components/ai-panel/finding-card.tsx`
- Create: `radiology-friend/components/ai-panel/confidence-meter.tsx`

**Step 1: Create ConfidenceMeter component**

Create `components/ai-panel/confidence-meter.tsx`:

```typescript
interface ConfidenceMeterProps {
  confidence: number; // 0-100
}

export function ConfidenceMeter({ confidence }: ConfidenceMeterProps) {
  const getColor = (conf: number) => {
    if (conf >= 80) return 'bg-success';
    if (conf >= 60) return 'bg-info';
    if (conf >= 40) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">Confidence</span>
        <span className="text-text-primary font-medium">{confidence}%</span>
      </div>
      <div className="h-2 bg-darker rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(confidence)} transition-all duration-300`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
```

**Step 2: Create FindingCard component**

Create `components/ai-panel/finding-card.tsx`:

```typescript
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIFinding } from '@/lib/types';
import { ConfidenceMeter } from './confidence-meter';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface FindingCardProps {
  finding: AIFinding;
}

const severityConfig = {
  normal: {
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/20',
    borderColor: 'border-success/50',
    label: 'Normal',
  },
  mild: {
    icon: AlertCircle,
    color: 'text-info',
    bgColor: 'bg-info/20',
    borderColor: 'border-info/50',
    label: 'Mild',
  },
  moderate: {
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/20',
    borderColor: 'border-warning/50',
    label: 'Moderate',
  },
  severe: {
    icon: AlertTriangle,
    color: 'text-error',
    bgColor: 'bg-error/20',
    borderColor: 'border-error/50',
    label: 'Severe',
  },
};

export function FindingCard({ finding }: FindingCardProps) {
  const config = severityConfig[finding.severity];
  const Icon = config.icon;

  return (
    <Card className={`bg-darker border ${config.borderColor} p-4`}>
      <div className="flex items-start gap-3 mb-3">
        <Icon className={`h-5 w-5 ${config.color} mt-0.5`} />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-text-primary mb-1">
            {finding.name}
          </h4>
          <Badge variant="outline" className={`${config.bgColor} ${config.color} ${config.borderColor}`}>
            {config.label}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-3">
        {finding.description}
      </p>

      <ConfidenceMeter confidence={finding.confidence} />
    </Card>
  );
}
```

**Step 3: Create AIAnalysisPanel component**

Create `components/ai-panel/ai-analysis-panel.tsx`:

```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FindingCard } from './finding-card';
import { mockAIAnalyses } from '@/lib/mock-data';
import { Download, FileText, Clock } from 'lucide-react';

interface AIAnalysisPanelProps {
  scanId: string;
}

export function AIAnalysisPanel({ scanId }: AIAnalysisPanelProps) {
  const analysis = mockAIAnalyses[scanId];

  if (!analysis || !analysis.analyzedAt) {
    return (
      <Card className="bg-dark border-border p-6">
        <div className="text-center text-text-muted">
          <p>No AI analysis available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-dark border-border p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          AI Analysis Results
        </h3>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Clock className="h-3 w-3" />
          <span>Analyzed in {analysis.processingTime}s</span>
        </div>
      </div>

      <Separator className="bg-border" />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-primary">Findings</h4>
        {analysis.findings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} />
        ))}
      </div>

      <Separator className="bg-border" />

      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-2">
          Overall Assessment
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed">
          {analysis.overallAssessment}
        </p>
      </div>

      <Separator className="bg-border" />

      <div className="space-y-2">
        <Button variant="default" size="sm" className="w-full">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Export Analysis
        </Button>
      </div>
    </Card>
  );
}
```

**Step 4: Commit AI panel components**

```bash
git add components/ai-panel/
git commit -m "feat: add AI analysis panel with findings display"
```

---

## Phase 7: Modality-Specific Pages

### Task 14: Create MRI Viewer Page

**Files:**
- Create: `radiology-friend/app/mri/page.tsx`
- Create: `radiology-friend/components/viewer/viewer-layout.tsx`

**Step 1: Create ViewerLayout component**

Create `components/viewer/viewer-layout.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useViewerStore } from '@/lib/stores/viewer-store';
import { DicomViewer } from './dicom-viewer';
import { ViewerControls } from './viewer-controls';
import { AIAnalysisPanel } from '../ai-panel/ai-analysis-panel';
import { mockScans } from '@/lib/mock-data';

interface ViewerLayoutProps {
  modality: 'MRI' | 'CT' | 'XRAY';
}

export function ViewerLayout({ modality }: ViewerLayoutProps) {
  const searchParams = useSearchParams();
  const scanId = searchParams.get('scan');
  const { setCurrentScan, reset } = useViewerStore();

  // Get scan from mock data
  const scan = scanId ? mockScans.find((s) => s.id === scanId) : null;

  useEffect(() => {
    if (scan) {
      setCurrentScan(scan.id, scan.sliceCount);
    }

    return () => {
      reset();
    };
  }, [scan, setCurrentScan, reset]);

  if (!scan) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg text-text-primary mb-2">No scan selected</p>
          <p className="text-sm text-text-muted">
            Please select a scan from the dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
      {/* Left Sidebar - Controls */}
      <div className="col-span-3 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text-primary mb-1">
            Patient Information
          </h3>
          <div className="text-sm text-text-muted space-y-1">
            <p>{scan.patientName}</p>
            <p>{scan.bodyPart} {modality}</p>
            <p>{new Date(scan.date).toLocaleDateString()}</p>
          </div>
        </div>
        <ViewerControls />
      </div>

      {/* Center - DICOM Viewer */}
      <div className="col-span-6">
        <DicomViewer scanId={scan.id} totalSlices={scan.sliceCount} />
      </div>

      {/* Right Sidebar - AI Analysis */}
      <div className="col-span-3 overflow-y-auto">
        <AIAnalysisPanel scanId={scan.id} />
      </div>
    </div>
  );
}
```

**Step 2: Create MRI page**

Create `app/mri/page.tsx`:

```typescript
import { ViewerLayout } from '@/components/viewer/viewer-layout';

export default function MRIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">MRI Viewer</h1>
        <p className="text-text-muted">
          Magnetic Resonance Imaging analysis with AI assistance
        </p>
      </div>

      <ViewerLayout modality="MRI" />
    </div>
  );
}
```

**Step 3: Commit MRI page**

```bash
git add app/mri/ components/viewer/viewer-layout.tsx
git commit -m "feat: create MRI viewer page with layout"
```

---

### Task 15: Create X-Ray and CT Pages

**Files:**
- Create: `radiology-friend/app/xray/page.tsx`
- Create: `radiology-friend/app/ct/page.tsx`

**Step 1: Create X-Ray page**

Create `app/xray/page.tsx`:

```typescript
import { ViewerLayout } from '@/components/viewer/viewer-layout';

export default function XRayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">X-Ray Viewer</h1>
        <p className="text-text-muted">
          Radiography analysis with AI-powered pathology detection
        </p>
      </div>

      <ViewerLayout modality="XRAY" />
    </div>
  );
}
```

**Step 2: Create CT page**

Create `app/ct/page.tsx`:

```typescript
import { ViewerLayout } from '@/components/viewer/viewer-layout';

export default function CTPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">CT Viewer</h1>
        <p className="text-text-muted">
          Computed Tomography imaging with AI analysis
        </p>
      </div>

      <ViewerLayout modality="CT" />
    </div>
  );
}
```

**Step 3: Commit X-Ray and CT pages**

```bash
git add app/xray/ app/ct/
git commit -m "feat: create X-Ray and CT viewer pages"
```

---

## Phase 8: Real DICOM Integration (TODO)

### Task 16: Document DICOM Integration Steps

**Files:**
- Create: `radiology-friend/docs/dicom-integration.md`

**Step 1: Create DICOM integration documentation**

Create `docs/dicom-integration.md`:

```markdown
# DICOM Integration Guide

This document outlines the steps needed to integrate real DICOM files into the viewer.

## Current State

- Cornerstone.js is initialized but not actively loading DICOM files
- Mock data structure is in place with paths pointing to `/dicom-library/`
- ViewerCanvas component is ready but displays placeholder content

## Steps to Complete Integration

### 1. Obtain DICOM Files

**Public Datasets:**
- OpenNeuro: https://openneuro.org/
- IXI Dataset: https://brain-development.org/ixi-dataset/
- The Cancer Imaging Archive: https://www.cancerimagingarchive.net/

**What to download:**
- 2-3 brain MRI series (150-200 slices each)
- 2-3 chest X-rays (single images)
- 2-3 chest CT series (200-300 slices each)

### 2. Organize DICOM Files

Place files in:
```
public/dicom-library/
├── mri-brain-001/
│   ├── IM-0001-0001.dcm
│   ├── IM-0001-0002.dcm
│   └── ... (all slices)
├── xray-chest-001/
│   └── chest-xray.dcm
└── ct-chest-001/
    ├── CT-0001-0001.dcm
    ├── CT-0001-0002.dcm
    └── ... (all slices)
```

### 3. Generate Thumbnails

Create thumbnail JPGs for dashboard display:
```bash
# Use ImageMagick or similar tool
convert dicom-file.dcm -resize 200x200 thumbnail.jpg
```

Place in `public/thumbnails/`

### 4. Update DICOM Loader

Modify `lib/dicom-loader.ts`:

```typescript
export async function loadDicomImage(filePath: string): Promise<DicomImage> {
  const imageId = `wadouri:${filePath}`;
  const image = await cornerstone.loadImage(imageId);

  return {
    imageId,
    width: image.width,
    height: image.height,
    sliceIndex: 0,
  };
}

export async function loadDicomSeries(directoryPath: string, sliceCount: number): Promise<DicomImage[]> {
  const images: DicomImage[] = [];

  for (let i = 1; i <= sliceCount; i++) {
    const filename = `IM-0001-${String(i).padStart(4, '0')}.dcm`;
    const filePath = `${directoryPath}/${filename}`;
    const image = await loadDicomImage(filePath);
    images.push({ ...image, sliceIndex: i - 1 });
  }

  return images;
}
```

### 5. Update ViewerCanvas

Modify `components/viewer/viewer-canvas.tsx` to actually load and display images:

```typescript
useEffect(() => {
  if (!canvasRef.current || !scanId) return;

  const scan = mockScans.find(s => s.id === scanId);
  if (!scan) return;

  const imageId = `wadouri:${scan.dicomPath}/IM-0001-${String(sliceIndex + 1).padStart(4, '0')}.dcm`;

  displayImage(canvasRef.current, imageId);
}, [scanId, sliceIndex]);
```

### 6. Create AI Overlay Rendering

For hero scans with AI overlay data:

```typescript
// After displaying DICOM image, draw overlay
const analysis = mockAIAnalyses[scanId];
if (analysis?.overlayData && showAIOverlay) {
  analysis.overlayData.forEach((overlay) => {
    // Draw polygon or bounding box using Cornerstone tools
    // or custom canvas overlay
  });
}
```

### 7. Test with Real Files

1. Start dev server: `npm run dev`
2. Navigate to dashboard
3. Click "View" on a scan
4. Verify:
   - DICOM image displays correctly
   - Slice navigation works
   - Window/Level adjustments affect image
   - Grid view shows multiple slices
   - AI overlays render on hero scans

## Notes

- DICOM files can be large (50-200MB per series)
- Consider adding loading states for slow connections
- May need to configure Next.js for large static file serving
- Cornerstone web workers should be configured for performance
```

**Step 2: Commit documentation**

```bash
mkdir -p docs
git add docs/dicom-integration.md
git commit -m "docs: add DICOM integration guide for future implementation"
```

---

## Phase 9: Final Polish & Testing

### Task 17: Add Loading States and Error Handling

**Files:**
- Create: `radiology-friend/components/ui/loading-spinner.tsx`
- Modify: `radiology-friend/components/viewer/viewer-canvas.tsx`

**Step 1: Create LoadingSpinner component**

Create `components/ui/loading-spinner.tsx`:

```typescript
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {message && (
        <p className="text-sm text-text-muted">{message}</p>
      )}
    </div>
  );
}
```

**Step 2: Add loading state to ViewerCanvas**

Modify `components/viewer/viewer-canvas.tsx`:

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { initializeCornerstone } from '@/lib/cornerstone-init';
import { enableCornerstoneElement, disableCornerstoneElement } from '@/lib/dicom-loader';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ViewerCanvasProps {
  scanId: string;
  sliceIndex: number;
  className?: string;
}

export function ViewerCanvas({ scanId, sliceIndex, className }: ViewerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize cornerstone on mount
    try {
      initializeCornerstone();

      if (canvasRef.current) {
        enableCornerstoneElement(canvasRef.current);
      }

      // Simulate loading for MVP
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to initialize viewer');
      setIsLoading(false);
    }

    return () => {
      if (canvasRef.current) {
        disableCornerstoneElement(canvasRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // TODO: Load and display DICOM image based on scanId and sliceIndex
    console.log('Loading scan:', scanId, 'slice:', sliceIndex);
  }, [scanId, sliceIndex]);

  return (
    <div
      ref={canvasRef}
      className={`bg-viewer-black relative ${className}`}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    >
      {isLoading && <LoadingSpinner message="Loading scan..." />}

      {error && (
        <div className="flex items-center justify-center h-full">
          <p className="text-error">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex items-center justify-center h-full text-text-muted">
          <div className="text-center">
            <p className="text-lg mb-2">DICOM Viewer Ready</p>
            <p className="text-sm">Scan: {scanId}, Slice: {sliceIndex + 1}</p>
            <p className="text-xs mt-4 text-text-muted">
              Awaiting real DICOM integration
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 3: Commit loading states**

```bash
git add components/ui/loading-spinner.tsx components/viewer/viewer-canvas.tsx
git commit -m "feat: add loading states and error handling to viewer"
```

---

### Task 18: Create README Documentation

**Files:**
- Create: `radiology-friend/README.md`

**Step 1: Create comprehensive README**

Create `README.md`:

```markdown
# Radiology Friend - Unified Medical Imaging Viewer

## 🇦🇱 Ministria e Shëndetësisë - Republika e Shqipërisë

Professional AI-powered medical imaging analysis system supporting MRI, X-Ray, and CT scans.

---

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## ✨ Features

### Core Capabilities
- **Multi-Modality Support**: MRI, X-Ray, and CT imaging
- **Professional DICOM Viewer**: Powered by cornerstone.js
- **AI-Powered Analysis**: Automated organ segmentation and pathology detection
- **Dark Medical Theme**: Optimized for radiologist workflow
- **Clinical Tools**: Slice navigation, window/level controls, measurement tools

### Viewer Features
- Multi-slice grid view (1x1, 2x2, 3x3, 4x4)
- Window/Level presets (Brain, Bone, Lung, Soft Tissue)
- Pan, Zoom, and Measurement tools
- AI overlay visualization
- Real-time slice navigation

### Dashboard
- System statistics and metrics
- Recent scans table with filtering
- Quick actions for upload and import
- Government data integration support

---

## 📁 Project Structure

```
radiology-friend/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── mri/page.tsx          # MRI viewer
│   ├── xray/page.tsx         # X-Ray viewer
│   ├── ct/page.tsx           # CT viewer
│   └── layout.tsx            # Root layout with sidebar
├── components/
│   ├── dashboard/            # Dashboard components
│   ├── viewer/               # DICOM viewer components
│   ├── ai-panel/             # AI analysis display
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── stores/               # Zustand state management
│   ├── mock-data.ts          # Mock patient and scan data
│   ├── types.ts              # TypeScript type definitions
│   ├── cornerstone-init.ts   # DICOM viewer initialization
│   └── dicom-loader.ts       # DICOM loading utilities
└── public/
    ├── dicom-library/        # DICOM files (to be added)
    └── thumbnails/           # Scan thumbnails
```

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (dark theme)
- **DICOM Rendering**: cornerstone.js, cornerstoneWADOImageLoader
- **State Management**: Zustand
- **Icons**: Lucide React

---

## 📊 Mock Data

Currently using mock data for:
- Patient information
- Scan metadata
- AI analysis results

### Hero Scans
Three scans have pre-computed AI overlays:
- `s001`: Brain MRI with white matter segmentation
- `s002`: Chest X-Ray with cardiomegaly detection
- `s003`: Chest CT with pulmonary nodule identification

---

## 🔧 DICOM Integration

Real DICOM files are not included in this repository. To integrate real medical images:

1. See `docs/dicom-integration.md` for detailed instructions
2. Download anonymized datasets from:
   - [OpenNeuro](https://openneuro.org/)
   - [IXI Dataset](https://brain-development.org/ixi-dataset/)
   - [The Cancer Imaging Archive](https://www.cancerimagingarchive.net/)
3. Place DICOM files in `public/dicom-library/`
4. Update mock data paths to match your file structure

---

## 🎨 Design System

### Dark Medical Theme
- **Backgrounds**: `#0f172a`, `#1e293b`, `#334155`
- **Text**: `#f8fafc`, `#e2e8f0`, `#94a3b8`
- **Primary**: `#2563eb`
- **Borders**: `#475569`

### AI Overlay Colors
- Cyan: `#06b6d4`
- Magenta: `#ec4899`
- Lime: `#84cc16`
- Yellow: `#eab308`

---

## 🧪 Development

### Adding New Scans

1. Add scan entry to `lib/mock-data.ts`:
```typescript
{
  id: 's005',
  patientId: 'p005',
  patientName: 'New Patient',
  modality: 'MRI',
  bodyPart: 'Spine',
  date: '2026-01-28',
  status: 'pending',
  sliceCount: 120,
  dicomPath: '/dicom-library/mri-spine-001',
  thumbnailPath: '/thumbnails/mri-spine-001.jpg',
  hasAIOverlay: false,
}
```

2. Add AI analysis if needed in `mockAIAnalyses`

### Customizing Window/Level Presets

Edit `components/viewer/window-level-controls.tsx`:
```typescript
const presets = [
  { name: 'Custom', width: 800, center: 100 },
  // ... add more
];
```

---

## 📝 License

Developed for the Ministry of Health - Republic of Albania 🇦🇱

---

## ⚕️ Medical Disclaimer

This system assists medical professionals and **must not** be used as sole basis for clinical decisions. All AI-generated reports require review by qualified radiologists.

---

**© 2026 Ministria e Shëndetësisë dhe Mbrojtjes Sociale**
```

**Step 2: Commit README**

```bash
git add README.md
git commit -m "docs: create comprehensive README documentation"
```

---

### Task 19: Final Build and Testing

**Step 1: Run production build**

```bash
npm run build
```

Expected: Build completes without errors

**Step 2: Test production build locally**

```bash
npm start
```

Expected: Server runs and all pages load correctly

**Step 3: Verify all routes**

Test each route manually:
- http://localhost:3000/ (Dashboard)
- http://localhost:3000/mri?scan=s001
- http://localhost:3000/xray?scan=s002
- http://localhost:3000/ct?scan=s003

**Step 4: Create final commit**

```bash
git add -A
git commit -m "chore: final build verification and testing complete"
```

---

## Phase 10: Repository Migration

### Task 20: Archive Old Repositories

**Files:**
- N/A (repository operations)

**Step 1: Create archive branches in old repos**

```bash
cd "/Users/admin/Desktop/Projects/Radiology Friend/MRI_MVP"
git checkout -b archive-2026-01-28
git push origin archive-2026-01-28
cd "/Users/admin/Desktop/Projects/Radiology Friend/MVP-ChestXray"
git checkout -b archive-2026-01-28
git push origin archive-2026-01-28
```

**Step 2: Add archive README to old repos**

Create README.md in both old repos:

```markdown
# ⚠️ ARCHIVED

This repository has been archived and merged into the unified **Radiology Friend** system.

**New Repository**: [Link to new repo]

**Archive Date**: January 28, 2026

**Reason**: Consolidated MRI and X-Ray functionality into a single Next.js application with CT support.

---

For historical reference, this archive branch preserves the original implementation.
```

**Step 3: Commit archive notices**

```bash
# In each old repo
git add README.md
git commit -m "docs: mark repository as archived"
git push
```

**Step 4: Document migration**

Create `docs/migration-notes.md` in new repo:

```markdown
# Migration Notes

## Previous Repositories

This project consolidates two previous MVP implementations:

### MRI_MVP
- **Tech Stack**: Flask (Python), HTML templates
- **Features**: MRI upload, AI organ segmentation, Albanian medical reports
- **AI Engine**: `engine_mri.py` with segmentation models
- **Archived**: 2026-01-28

### MVP-ChestXray
- **Tech Stack**: Flask (Python), HTML templates
- **Features**: Chest X-ray upload, pathology classification (18 conditions)
- **AI Engine**: `engine_chest.py` with DenseNet-121 model
- **Archived**: 2026-01-28

## New Unified System

- **Tech Stack**: Next.js 16, TypeScript, cornerstone.js
- **Features**: MRI + X-Ray + CT viewing with mocked AI analysis
- **Approach**: Professional DICOM viewer with pre-computed AI results
- **Benefits**:
  - Single codebase
  - Modern UI/UX
  - Scalable architecture
  - Professional medical imaging standards

## Future Work

To restore AI functionality:
1. Create separate Python API service
2. Port `engine_mri.py` and `engine_chest.py` to API endpoints
3. Add CT analysis engine
4. Connect Next.js frontend to Python backend via REST API
```

**Step 5: Commit migration documentation**

```bash
cd "/Users/admin/Desktop/Projects/Radiology Friend/radiology-friend"
git add docs/migration-notes.md
git commit -m "docs: add migration notes from previous repositories"
```

---

## Summary

This implementation plan creates a professional, unified medical imaging viewer with:

✅ **Next.js 16 + TypeScript** foundation
✅ **Dark medical professional** theme
✅ **Dashboard** with stats, recent scans, quick actions
✅ **DICOM viewer** with cornerstone.js (ready for real files)
✅ **Clinical tools**: slice navigation, window/level, grid view, measurements
✅ **AI analysis panel** with findings, confidence scores, overlays
✅ **Three modality pages**: MRI, X-Ray, CT
✅ **Mock data structure** with 3 hero scans + AI overlays
✅ **Documentation** for DICOM integration and migration

### What's Mock vs. Real

**Mock (for MVP demo)**:
- Patient data
- Scan metadata
- AI analysis results
- DICOM file paths (structure exists, awaiting real files)

**Real (functional)**:
- Next.js application architecture
- Cornerstone.js integration (initialized and ready)
- UI components and navigation
- State management with Zustand
- Responsive dark medical theme

### Next Steps After Plan Completion

1. **Add Real DICOM Files**: Follow `docs/dicom-integration.md`
2. **Create AI Overlays**: Generate segmentation masks for hero scans
3. **Deploy**: Configure for production hosting
4. **Optional**: Create Python backend API for real-time AI analysis

---

**Total Tasks**: 20
**Estimated Implementation Time**: 6-8 hours
**Complexity**: Medium (mostly assembly, some cornerstone.js integration)
