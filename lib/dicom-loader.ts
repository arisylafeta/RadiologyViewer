// Dynamically import cornerstone to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cornerstone: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cornerstoneWADOImageLoader: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dicomParser: any = null;

// Initialize on client side only
if (typeof window !== 'undefined') {
  const initCornerstone = async () => {
    const cornerstoneModule = await import('cornerstone-core');
    const wadoModule = await import('cornerstone-wado-image-loader');
    const dicomParserModule = await import('dicom-parser');

    cornerstone = cornerstoneModule.default;
    cornerstoneWADOImageLoader = wadoModule.default;
    dicomParser = dicomParserModule.default;

    // Configure WADO image loader - MUST set dicomParser before registering loader
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    // Register wadouri scheme
    cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage);
  };

  initCornerstone();
}

export interface DicomImage {
  imageId: string;
  patientName?: string;
  patientId?: string;
  studyDate?: string;
  modality?: string;
  seriesDescription?: string;
  instanceNumber?: number;
  rows?: number;
  columns?: number;
}

// Type aliases for cornerstone types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Image = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EnabledElement = any;

// MRI Shoulder series files mapping (exported for getSeriesSliceCount)
const mriShoulderSeriesFiles: Record<string, string[]> = {
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
  'mri-shoulder-001-s003': [
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
  'mri-shoulder-001-s004': [
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
  'mri-shoulder-001-s005': [
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
  'mri-shoulder-001-s006': [
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
};

// MRI series path mapping
const mriSeriesPaths: Record<string, string> = {
  'mri-shoulder-001-s001': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 001 [MR - Scout]',
  'mri-shoulder-001-s002': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 002 [MR - TSE T2 TRS1]',
  'mri-shoulder-001-s003': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 003 [MR - SE T1 SAG1]',
  'mri-shoulder-001-s004': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 004 [MR - SE T1 SAG1]',
  'mri-shoulder-001-s005': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 005 [MR - GE STIR COR1]',
  'mri-shoulder-001-s006': '/samples/mri/48213468/DICOM/Doe^Giovanni [48213468]/20020101 000000 [ - RM SPALLA SN]/Series 006 [MR - SE T1 COR1]',
};

/**
 * Wait for cornerstone to be initialized
 */
async function waitForCornerstone(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max

  while (!cornerstone && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }

  return !!cornerstone;
}

/**
 * Build a wadouri image ID for loading DICOM from public directory
 * Uses the dicom-samples.ts configuration for file paths
 */
export function buildWadoUri(scanId: string, sliceIndex: number = 0, seriesId?: string): string {
  // Map scan IDs to their directory names and file paths
  const scanMap: Record<string, string> = {
    's001': '/dicom-library/mri-brain-001/IM-0001-0001.dcm',
    's002': '/samples/xray/chest/normal-chest/slice-001.dcm',
    's003': '/dicom-library/ct-chest-001/IM-0001-0001.dcm',
  };

  // X-Ray chest slice files
  const xraySliceFiles = [
    'slice-001.dcm',
    'slice-002.dcm',
    'slice-003.dcm',
    'slice-004.dcm',
    'slice-005.dcm',
    'slice-006.dcm',
    'slice-007.dcm',
    'slice-008.dcm',
    'slice-009.dcm',
    'slice-010.dcm',
  ] as const;

  // Ankle CT slice files in actual file naming order as they appear in filesystem
  // Non-sequential filenames: (1), (10), (100-107) - common in partial datasets
  const ankleSliceFiles = [
    'VHFCT1mm-Ankle (1).dcm',
    'VHFCT1mm-Ankle (10).dcm',
    'VHFCT1mm-Ankle (100).dcm',
    'VHFCT1mm-Ankle (101).dcm',
    'VHFCT1mm-Ankle (102).dcm',
    'VHFCT1mm-Ankle (103).dcm',
    'VHFCT1mm-Ankle (104).dcm',
    'VHFCT1mm-Ankle (105).dcm',
    'VHFCT1mm-Ankle (106).dcm',
    'VHFCT1mm-Ankle (107).dcm',
  ] as const;



  // Handle X-Ray chest with multiple slice files
  if (scanId === 's002') {
    const validIndex = Math.max(0, Math.min(sliceIndex, xraySliceFiles.length - 1));
    const sliceFile = xraySliceFiles[validIndex];
    return `wadouri:/samples/xray/chest/normal-chest/${sliceFile}`;
  }

  // Handle ankle CT with non-sequential files
  if (scanId === 'ct-ankle-001') {
    const validIndex = Math.max(0, Math.min(sliceIndex, ankleSliceFiles.length - 1));
    const sliceFile = ankleSliceFiles[validIndex];
    return `wadouri:/samples/ct/ankle/${sliceFile}`;
  }

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

  // Handle MRI shoulder scan without series ID (fallback to first series)
  if (scanId === 'mri-shoulder-001') {
    const defaultSeriesId = 'mri-shoulder-001-s002'; // T2 series
    const seriesFiles = mriShoulderSeriesFiles[defaultSeriesId];
    if (seriesFiles && seriesFiles.length > 0) {
      const validIndex = Math.max(0, Math.min(sliceIndex, seriesFiles.length - 1));
      const sliceFile = seriesFiles[validIndex];
      const seriesPath = mriSeriesPaths[defaultSeriesId];
      return `wadouri:${seriesPath}/${sliceFile}`;
    }
  }

  const filePath = scanMap[scanId];
  if (!filePath) {
    console.error(`Unknown scan ID: ${scanId}`);
    return '';
  }

  return `wadouri:${filePath}`;
}

/**
 * Get the number of slices in an MRI series
 */
export function getSeriesSliceCount(seriesId: string): number {
  const seriesFiles = mriShoulderSeriesFiles[seriesId];
  return seriesFiles ? seriesFiles.length : 0;
}

export async function loadDicomImage(imageId: string): Promise<Image | null> {
  const isReady = await waitForCornerstone();
  if (!isReady) {
    console.error('Cornerstone not initialized');
    return null;
  }

  try {
    const image = await cornerstone.loadImage(imageId);
    return image;
  } catch (error) {
    console.error('Error loading DICOM image:', error);
    return null;
  }
}

export async function loadDicomSeries(imageIds: string[]): Promise<Image[]> {
  const isReady = await waitForCornerstone();
  if (!isReady) {
    console.error('Cornerstone not initialized');
    return [];
  }

  try {
    const images = await Promise.all(
      imageIds.map(async (imageId) => {
        try {
          return await cornerstone.loadImage(imageId);
        } catch (error) {
          console.error(`Error loading image ${imageId}:`, error);
          return null;
        }
      })
    );
    return images.filter((image): image is Image => image !== null);
  } catch (error) {
    console.error('Error loading DICOM series:', error);
    return [];
  }
}

export async function enableElement(element: HTMLElement): Promise<void> {
  const isReady = await waitForCornerstone();
  if (!isReady) {
    console.error('Cornerstone not initialized');
    return;
  }
  cornerstone.enable(element);
}

export async function disableElement(element: HTMLElement): Promise<void> {
  const isReady = await waitForCornerstone();
  if (!isReady) return;
  cornerstone.disable(element);
}

export async function displayImage(
  element: HTMLElement,
  image: Image
): Promise<void> {
  const isReady = await waitForCornerstone();
  if (!isReady) {
    console.error('Cornerstone not initialized');
    return;
  }
  cornerstone.displayImage(element, image);
}

export async function getEnabledElement(element: HTMLElement): Promise<EnabledElement | undefined> {
  const isReady = await waitForCornerstone();
  if (!isReady) return undefined;
  return cornerstone.getEnabledElement(element);
}

export async function resize(element: HTMLElement, fit: boolean = true): Promise<void> {
  const isReady = await waitForCornerstone();
  if (!isReady) return;
  cornerstone.resize(element, fit);
}
