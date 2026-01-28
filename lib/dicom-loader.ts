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
export function buildWadoUri(scanId: string, sliceIndex: number = 0): string {
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

  const filePath = scanMap[scanId];
  if (!filePath) {
    console.error(`Unknown scan ID: ${scanId}`);
    return '';
  }

  return `wadouri:${filePath}`;
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
