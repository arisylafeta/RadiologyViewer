// Dynamically import cornerstone to avoid SSR issues
let cornerstone: any = null;
let cornerstoneWADOImageLoader: any = null;

// Initialize on client side only
if (typeof window !== 'undefined') {
  const initCornerstone = async () => {
    const cornerstoneModule = await import('cornerstone-core');
    const wadoModule = await import('cornerstone-wado-image-loader');

    cornerstone = cornerstoneModule.default;
    cornerstoneWADOImageLoader = wadoModule.default;

    // Configure WADO image loader
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

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
export type Image = any;
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
  // Import dynamically to avoid SSR issues
  const { getDicomFilePaths } = require('./dicom-samples');
  const paths = getDicomFilePaths(scanId);
  
  if (paths.length > 0) {
    // Use the actual file path from dicom-samples
    return `wadouri:${paths[0]}`;
  }
  
  // Fallback to legacy format if scan not found
  const formattedSlice = sliceIndex.toString().padStart(3, '0');
  return `wadouri:/dicom-library/${scanId}/slice_${formattedSlice}.dcm`;
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
