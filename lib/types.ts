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

// CT-specific types
export interface CTWindowPreset {
  name: string;
  width: number;
  level: number;
  description?: string;
}

export interface HUMeasurement {
  id: string;
  value: number;
  mean?: number;
  stdDev?: number;
  min?: number;
  max?: number;
  area?: number;
  location: string;
  timestamp: string;
}

// MRI-specific types
export interface MRISequence {
  name: string;
  type: 't1' | 't2' | 'flair' | 'dwi' | 'pd';
  tr: number;
  te: number;
  description?: string;
}

export interface MRIContrastSettings {
  brightness: number;
  contrast: number;
  saturation: number;
}

// X-Ray-specific types
export interface XRayViewPreset {
  name: string;
  gamma: number;
  brightness: number;
  contrast: number;
}

export interface XRayMeasurement {
  id: string;
  type: 'length' | 'angle' | 'cobb-angle';
  value: number;
  unit: string;
  location: string;
  timestamp: string;
  points?: Array<{ x: number; y: number }>;
}

// Enhanced Scan interface
export interface ScanEnhanced extends Scan {
  // CT-specific
  ctWindowPreset?: string;
  huRange?: [number, number];

  // MRI-specific
  mriSequence?: string;

  // X-Ray-specific
  xrayView?: string;
}
