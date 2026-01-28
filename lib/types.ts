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
