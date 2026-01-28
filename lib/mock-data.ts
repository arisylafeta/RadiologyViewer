import { Patient, Scan, AIAnalysis, AIFinding, DashboardStats } from './types';

// MRI Shoulder Scan ID constant
export const MRI_SHOULDER_SCAN_ID = 'mri-shoulder-001';

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
    name: 'Gjon Marku',
    age: 48,
    gender: 'M',
    patientId: 'ALB-2026-004823',
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
    patientName: 'Gjon Marku',
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
    name: 'Kardiomegali',
    confidence: 82,
    severity: 'mild',
    description: 'Raporti kardiotorakik rreth 0.52, duke treguar kardiomegali të lehtë.',
  },
  {
    id: 'f004',
    name: 'Edemë Pulmonare',
    confidence: 23,
    severity: 'normal',
    description: 'Nuk ka prova të edemës pulmonare. Fushat pulmonare të qarta në të dyja anët.',
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
    name: 'Nuk Ka Frakturë të Detektuar',
    confidence: 97,
    severity: 'normal',
    description: 'Nuk identifikohet frakturë akute ose shkeputje kortikale në tibia ose fibula.',
  },
  {
    id: 'f010',
    name: 'Struktura Ligamentoze',
    confidence: 89,
    severity: 'normal',
    description: 'Ligamentet e këmbës duken të paprekura pa prova të çarjes akute ose shtrëmbërimit.',
  },
  {
    id: 'f011',
    name: 'Hapësira Artikulare',
    confidence: 94,
    severity: 'normal',
    description: 'Hapësirat artikulare tibiotalare dhe subtalare janë të mirëruajtura pa efuzione.',
  },
  {
    id: 'f012',
    name: 'Indi i Butë',
    confidence: 85,
    severity: 'normal',
    description: 'Nuk detektohet ënjtje e rëndësishme e indeve të buta ose hematom.',
  },
];

const mriShoulderFindings: AIFinding[] = [
  {
    id: 'mri-f001',
    name: 'Tendinopati e Supraspinatit',
    confidence: 92,
    severity: 'moderate',
    description: 'Intensitet i lartë sinjali T2 në tendonin e supraspinatit i përshtatet tendinopatisë së moderuar. Nuk identifikohet çarje me trashësi të plotë.',
  },
  {
    id: 'mri-f002',
    name: 'Bursit Subakromiale',
    confidence: 88,
    severity: 'mild',
    description: 'Lëng në burësin subakromial-subdeltoid i përshtatet bursitit të lehtë.',
  },
  {
    id: 'mri-f003',
    name: 'Çarje Labrale',
    confidence: 76,
    severity: 'mild',
    description: 'Dyshohet çarje labrale antero-posteriore e sipërme (SLAP). Rekomandohet korrelacion arthroskopik.',
  },
  {
    id: 'mri-f004',
    name: 'Artikulacioni Akromioklavikular',
    confidence: 95,
    severity: 'normal',
    description: 'Artikulacioni akromioklavikular duket normal pa ndryshime degjenerative të rëndësishme.',
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
    overallAssessment: 'Radiografia e gjoksit tregon kardiomegali të lehtë. Mushkëritë janë të qarta pa infiltrate ose efuzione. Asnjë anomali kardiopulmonare akute.',
    processingTime: 3.2,
    analyzedAt: '2026-01-26T09:15:42Z',
    overlayData: [
      {
        type: 'bounding-box',
        coordinates: [[150, 200], [350, 400]], // [top-left, bottom-right]
        color: '#ec4899',
        label: 'Kufiri i Zemrës',
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
    overallAssessment: 'CT e këmbës tregon arkitekturë kockore normale dhe hapësira artikulare. Nuk identifikohet frakturë ose dëmtim ligamental. Ekzaminimi brenda kufijve normalë.',
    processingTime: 14.3,
    analyzedAt: '2026-01-28T10:45:12Z',
    overlayData: [
      {
        type: 'bounding-box',
        coordinates: [[100, 150], [250, 350]],
        color: '#06b6d4',
        label: 'Tibia',
      },
      {
        type: 'bounding-box',
        coordinates: [[280, 150], [350, 350]],
        color: '#ec4899',
        label: 'Fibula',
      },
      {
        type: 'bounding-box',
        coordinates: [[120, 280], [320, 380]],
        color: '#84cc16',
        label: 'Artikulacioni i Këmbës',
      },
    ],
  },
  'mri-shoulder-001': {
    scanId: 'mri-shoulder-001',
    findings: mriShoulderFindings,
    overallAssessment: 'MRI e shpatullës tregon tendinopati të moderuar të supraspinatit me bursit subakromiale shoqëruese. Identifikohet çarje e mundshme SLAP. Artikulacioni AC normal. Rekomandohet korrelacion me gjetjet klinike.',
    processingTime: 24.7,
    analyzedAt: '2026-01-28T12:34:56Z',
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

// MRI overlay data for AI findings
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

export const getMRIOverlayData = (scanId: string): MRIAIFinding[] => {
  if (scanId === MRI_SHOULDER_SCAN_ID) {
    return [
      {
        id: 'mri-f001',
        number: 1,
        label: 'Tendinopati Supraspinatus',
        confidence: 92,
        severity: 'moderate',
        description: 'Sinjale T2 e lartë në tendonin supraspinatus',
        x: 45,
        y: 35,
      },
      {
        id: 'mri-f002',
        number: 2,
        label: 'Bursit Subakromial',
        confidence: 88,
        severity: 'mild',
        description: 'Lëng në burësin subakromial',
        x: 55,
        y: 40,
      },
      {
        id: 'mri-f003',
        number: 3,
        label: 'Çarje Labrale',
        confidence: 76,
        severity: 'mild',
        description: 'Çarje e mundshme SLAP',
        x: 50,
        y: 55,
      },
    ];
  }
  return [];
};

// X-Ray overlay data for AI findings
export interface XRayAIFinding {
  id: string;
  number: number;
  label: string;
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  description: string;
  x: number;
  y: number;
}

export const getXRayOverlayData = (scanId: string): XRayAIFinding[] => {
  if (scanId === 's002') {
    return [
      {
        id: 'xray-f001',
        number: 1,
        label: 'Kardiomegali',
        confidence: 82,
        severity: 'mild',
        description: 'Raporti kardiotorakik rreth 0.52',
        x: 50,
        y: 55,
      },
      {
        id: 'xray-f002',
        number: 2,
        label: 'Fusha Pulmonare',
        confidence: 92,
        severity: 'normal',
        description: 'Fushat pulmonare të qarta',
        x: 35,
        y: 45,
      },
    ];
  }
  return [];
};

// CT overlay data for AI findings
export interface CTAIFinding {
  id: string;
  number: number;
  label: string;
  confidence: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  description: string;
  x: number;
  y: number;
}

export const getCTOverlayData = (scanId: string): CTAIFinding[] => {
  if (scanId === 'ct-ankle-001') {
    return [
      {
        id: 'ct-f001',
        number: 1,
        label: 'Tibia',
        confidence: 97,
        severity: 'normal',
        description: 'Nuk ka frakturë',
        x: 40,
        y: 45,
      },
      {
        id: 'ct-f002',
        number: 2,
        label: 'Fibula',
        confidence: 96,
        severity: 'normal',
        description: 'Struktura normale',
        x: 65,
        y: 45,
      },
      {
        id: 'ct-f003',
        number: 3,
        label: 'Artikulacioni',
        confidence: 94,
        severity: 'normal',
        description: 'Hapësira e ruajtur',
        x: 52,
        y: 65,
      },
      {
        id: 'ct-f004',
        number: 4,
        label: 'Inde të Buta',
        confidence: 89,
        severity: 'normal',
        description: 'Pa ënjtje',
        x: 52,
        y: 30,
      },
    ];
  }
  return [];
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
