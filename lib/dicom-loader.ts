import { cornerstone } from './cornerstone-init';

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

export async function loadDicomImage(imageId: string): Promise<Image | null> {
  if (typeof window === 'undefined' || !cornerstone) return null;
  try {
    const image = await cornerstone.loadImage(imageId);
    return image;
  } catch (error) {
    console.error('Error loading DICOM image:', error);
    return null;
  }
}

export async function loadDicomSeries(imageIds: string[]): Promise<Image[]> {
  if (typeof window === 'undefined' || !cornerstone) return [];
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

export function enableElement(element: HTMLElement): void {
  if (typeof window === 'undefined' || !cornerstone) return;
  cornerstone.enable(element);
}

export function disableElement(element: HTMLElement): void {
  if (typeof window === 'undefined' || !cornerstone) return;
  cornerstone.disable(element);
}

export function displayImage(
  element: HTMLElement,
  image: Image
): void {
  if (typeof window === 'undefined' || !cornerstone) return;
  cornerstone.displayImage(element, image);
}

export function getEnabledElement(element: HTMLElement): EnabledElement | undefined {
  if (typeof window === 'undefined' || !cornerstone) return undefined;
  return cornerstone.getEnabledElement(element);
}

export function resize(element: HTMLElement, fit: boolean = true): void {
  if (typeof window === 'undefined' || !cornerstone) return;
  cornerstone.resize(element, fit);
}
