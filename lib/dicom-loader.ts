import cornerstone from 'cornerstone-core';

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

export async function loadDicomImage(imageId: string): Promise<cornerstone.Image | null> {
  try {
    const image = await cornerstone.loadImage(imageId);
    return image;
  } catch (error) {
    console.error('Error loading DICOM image:', error);
    return null;
  }
}

export async function loadDicomSeries(imageIds: string[]): Promise<cornerstone.Image[]> {
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
    return images.filter((image): image is cornerstone.Image => image !== null);
  } catch (error) {
    console.error('Error loading DICOM series:', error);
    return [];
  }
}

export function enableElement(element: HTMLElement): void {
  cornerstone.enable(element);
}

export function disableElement(element: HTMLElement): void {
  cornerstone.disable(element);
}

export function displayImage(
  element: HTMLElement,
  image: cornerstone.Image
): void {
  cornerstone.displayImage(element, image);
}

export function getEnabledElement(element: HTMLElement): cornerstone.EnabledElement | undefined {
  return cornerstone.getEnabledElement(element);
}

export function resize(element: HTMLElement, fit: boolean = true): void {
  cornerstone.resize(element, fit);
}
