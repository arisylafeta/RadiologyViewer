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

// Mock scans with sample image references
export const mockScans: Scan[] = [
  {
    id: 'mri-brain-001',
    patientId: 'p001',
    patientName: 'Arben Hoxha',
    modality: 'MRI',
    bodyPart: 'Brain',
    date: '2026-01-27',
    status: 'analyzed',
    sliceCount: 1,
    dicomPath: '/samples/mri/brain',
    thumbnailPath: '/samples/mri/brain/slice-001.dcm',
    hasAIOverlay: true, // Hero scan
  },
  {
    id: 'xray-chest-001',
    patientId: 'p002',
    patientName: 'Elira Kelmendi',
    modality: 'XRAY',
    bodyPart: 'Chest',
    date: '2026-01-26',
    status: 'analyzed',
    sliceCount: 10,
    dicomPath: '/samples/xray/chest/normal-chest',
    thumbnailPath: '/samples/xray/chest/normal-chest/slice-001.dcm',
    hasAIOverlay: true, // Hero scan
  },
  {
    id: 'ct-chest-001',
    patientId: 'p003',
    patientName: 'Gentian Berisha',
    modality: 'CT',
    bodyPart: 'Chest',
    date: '2026-01-25',
    status: 'analyzed',
    sliceCount: 1,
    dicomPath: '/samples/ct/chest',
    thumbnailPath: '/samples/ct/chest/slice-001.dcm',
    hasAIOverlay: true, // Hero scan
  },
  {
    id: 'ct-brain-001',
    patientId: 'p004',
    patientName: 'Miranda Shehu',
    modality: 'CT',
    bodyPart: 'Brain',
    date: '2026-01-24',
    status: 'analyzed',
    sliceCount: 1,
    dicomPath: '/samples/ct/brain',
    thumbnailPath: '/samples/ct/brain/slice-001.dcm',
    hasAIOverlay: true,
  },
  {
    id: 'ct-abdomen-001',
    patientId: 'p001',
    patientName: 'Arben Hoxha',
    modality: 'CT',
    bodyPart: 'Abdomen',
    date: '2026-01-23',
    status: 'pending',
    sliceCount: 1,
    dicomPath: '/samples/ct/abdomen',
    thumbnailPath: '/samples/ct/abdomen/slice-001.dcm',
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
    confidence: 78,
    severity: 'mild',
    description: 'Cardiothoracic ratio approximately 0.52, indicating mild cardiomegaly. Heart appears slightly enlarged.',
  },
  {
    id: 'f004',
    name: 'Pulmonary Edema',
    confidence: 12,
    severity: 'normal',
    description: 'No evidence of pulmonary edema. Clear lung fields bilaterally without infiltrates or effusions.',
  },
  {
    id: 'f005',
    name: 'Lung Fields',
    confidence: 95,
    severity: 'normal',
    description: 'Lung fields are clear bilaterally. No focal opacities, consolidations, or effusions detected.',
  },
  {
    id: 'f006',
    name: 'Bone Structures',
    confidence: 89,
    severity: 'normal',
    description: 'Rib cage and spine appear normal without fractures or deformities. Costophrenic angles are sharp.',
  },
  {
    id: 'f007',
    name: 'Mediastinum',
    confidence: 94,
    severity: 'normal',
    description: 'Mediastinal contour normal. No widening or mass effect noted.',
  },
  {
    id: 'f008',
    name: 'Pleural Space',
    confidence: 91,
    severity: 'normal',
    description: 'No pleural effusions or thickening. Pleural spaces are clear.',
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
  'mri-brain-001': {
    scanId: 'mri-brain-001',
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
  'xray-chest-001': {
    scanId: 'xray-chest-001',
    findings: chestXrayFindings,
    overallAssessment: 'Normal chest X-ray with mild cardiomegaly. Lung fields, bones, and soft tissues appear unremarkable. No acute cardiopulmonary pathology identified.',
    processingTime: 3.2,
    analyzedAt: '2026-01-26T09:15:42Z',
    overlayData: [
      {
        type: 'bounding-box' as const,
        coordinates: [[150, 200], [350, 400]],
        color: '#ec4899',
        label: 'Heart Border',
      },
    ],
  },
  'ct-chest-001': {
    scanId: 'ct-chest-001',
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
  'ct-brain-001': {
    scanId: 'ct-brain-001',
    findings: [
      {
        id: 'f007',
        name: 'No Acute Hemorrhage',
        confidence: 98,
        severity: 'normal',
        description: 'No evidence of acute intracranial hemorrhage or mass effect.',
      },
    ],
    overallAssessment: 'CT brain shows normal ventricular size and configuration. No acute intracranial abnormality detected.',
    processingTime: 15.2,
    analyzedAt: '2026-01-24T11:30:22Z',
    overlayData: [],
  },
  'ct-abdomen-001': {
    scanId: 'ct-abdomen-001',
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

// Helper function to get sample images for a modality
export const getSampleImagesForModality = (
  modality: string,
  bodyPart: string
): { dicomPath: string; thumbnailPath: string } | null => {
  const modalityLower = modality.toLowerCase();
  const bodyPartLower = bodyPart.toLowerCase();

  // CT samples
  if (modalityLower === 'ct') {
    if (bodyPartLower === 'brain') {
      return {
        dicomPath: '/samples/ct/brain',
        thumbnailPath: '/samples/ct/brain/slice-001.png',
      };
    }
    if (bodyPartLower === 'chest') {
      return {
        dicomPath: '/samples/ct/chest',
        thumbnailPath: '/samples/ct/chest/slice-001.png',
      };
    }
    if (bodyPartLower === 'abdomen') {
      return {
        dicomPath: '/samples/ct/abdomen',
        thumbnailPath: '/samples/ct/abdomen/slice-001.png',
      };
    }
  }

  // MRI samples
  if (modalityLower === 'mri') {
    if (bodyPartLower === 'brain') {
      return {
        dicomPath: '/samples/mri/brain',
        thumbnailPath: '/samples/mri/brain/slice-001.png',
      };
    }
  }

  // X-Ray samples
  if (modalityLower === 'xray') {
    if (bodyPartLower === 'chest') {
      return {
        dicomPath: '/samples/xray/chest',
        thumbnailPath: '/samples/xray/chest/image-001.png',
      };
    }
  }

  return null;
};
