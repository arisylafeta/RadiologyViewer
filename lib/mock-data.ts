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
