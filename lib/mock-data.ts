import { Patient, Scan, AIAnalysis, AIFinding, DashboardStats, MRISeries } from './types';

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
  {
    id: 'p005',
    name: 'Driton Krasniqi',
    age: 29,
    gender: 'M',
    patientId: 'ALB-2026-002287',
  },
  {
    id: 'p006',
    name: 'Giovanni Doe',
    age: 48,
    gender: 'M',
    patientId: '48213468',
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
    sliceCount: 10,
    dicomPath: '/samples/xray/chest/normal-chest',
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
  {
    id: 'ct-ankle-001',
    patientId: 'p005',
    patientName: 'Driton Krasniqi',
    modality: 'CT',
    bodyPart: 'Ankle',
    date: '2026-01-28',
    status: 'analyzed',
    sliceCount: 10, // Preview dataset - 10 representative slices
    dicomPath: '/samples/ct/ankle',
    thumbnailPath: '/samples/ct/ankle/VHFCT1mm-Ankle (1).dcm',
    hasAIOverlay: true,
  },
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

const ctAnkleFindings: AIFinding[] = [
  {
    id: 'f009',
    name: 'No Fracture Detected',
    confidence: 97,
    severity: 'normal',
    description: 'No acute fracture or cortical disruption identified in tibia or fibula.',
  },
  {
    id: 'f010',
    name: 'Ligamentous Structures',
    confidence: 89,
    severity: 'normal',
    description: 'Ankle ligaments appear intact without evidence of acute tear or sprain.',
  },
  {
    id: 'f011',
    name: 'Joint Space',
    confidence: 94,
    severity: 'normal',
    description: 'Tibiotalar and subtalar joint spaces are well preserved without effusion.',
  },
  {
    id: 'f012',
    name: 'Soft Tissue',
    confidence: 85,
    severity: 'normal',
    description: 'No significant soft tissue swelling or hematoma detected.',
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
  'ct-ankle-001': {
    scanId: 'ct-ankle-001',
    findings: ctAnkleFindings,
    overallAssessment: 'CT ankle shows normal bony architecture and joint spaces. No fracture or ligamentous injury identified. Examination within normal limits.',
    processingTime: 14.3,
    analyzedAt: '2026-01-28T10:45:12Z',
    overlayData: [],
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
// TODO: Extract hardcoded modality strings to constants
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
    if (bodyPartLower === 'ankle') {
      return {
        dicomPath: '/samples/ct/ankle',
        thumbnailPath: '/samples/ct/ankle/VHFCT1mm-Ankle (1).dcm',
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

export const mriShoulderSeries = [
  {
    seriesId: 'mri-shoulder-001-s001',
    seriesNumber: 1,
    seriesName: 'Scout',
    sequence: 'scout' as const,
    orientation: 'transverse' as const,
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
    sequence: 't2' as const,
    orientation: 'transverse' as const,
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
    sequence: 't1' as const,
    orientation: 'sagittal' as const,
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
    sequence: 't1' as const,
    orientation: 'sagittal' as const,
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
    sequence: 'stir' as const,
    orientation: 'coronal' as const,
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
    sequence: 't1' as const,
    orientation: 'coronal' as const,
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

export const getSeriesByScanId = (scanId: string): MRISeries[] => {
  if (scanId === 'mri-shoulder-001') {
    return mriShoulderSeries;
  }
  return [];
};
