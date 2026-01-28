/**
 * DICOM Sample Files Configuration
 * 
 * Maps scan IDs to their corresponding DICOM file paths.
 * These files are stored in the public directory and served as static assets.
 */

export interface DicomSample {
  id: string;
  scanId: string;
  modality: 'MRI' | 'XRAY' | 'CT';
  bodyPart: string;
  filePath: string;
  description: string;
}

/**
 * Sample DICOM files for hero scans
 * Files are located in public/dicom-library/
 */
export const dicomSamples: DicomSample[] = [
  {
    id: 'mri-brain-001',
    scanId: 's001',
    modality: 'MRI',
    bodyPart: 'Brain',
    filePath: '/dicom-library/mri-brain-001/IM-0001-0001.dcm',
    description: 'MRI Brain scan - T1 weighted image',
  },
  {
    id: 'xray-chest-001',
    scanId: 's002',
    modality: 'XRAY',
    bodyPart: 'Chest',
    filePath: '/dicom-library/xray-chest-001/IM-0001-0001.dcm',
    description: 'Chest X-ray - PA view',
  },
  {
    id: 'ct-chest-001',
    scanId: 's003',
    modality: 'CT',
    bodyPart: 'Chest',
    filePath: '/dicom-library/ct-chest-001/IM-0001-0001.dcm',
    description: 'CT Chest scan - Axial view',
  },
];

/**
 * Get DICOM sample by scan ID
 */
export function getDicomSampleByScanId(scanId: string): DicomSample | undefined {
  return dicomSamples.find(sample => sample.scanId === scanId);
}

/**
 * Get all DICOM file paths for a scan
 * Returns array of file paths for multi-slice support
 */
export function getDicomFilePaths(scanId: string): string[] {
  const sample = getDicomSampleByScanId(scanId);
  if (!sample) {
    return [];
  }
  // For now, single slice support
  // In the future, this could return multiple slices
  return [sample.filePath];
}

/**
 * Get the base directory path for a scan
 */
export function getDicomBasePath(scanId: string): string | undefined {
  const sample = getDicomSampleByScanId(scanId);
  if (!sample) {
    return undefined;
  }
  return `/dicom-library/${sample.id}`;
}
