export interface WindowPreset {
  width: number;
  level: number;
}

export interface SequencePreset {
  name: string;
  tr: number;
  te: number;
}

export interface ViewPreset {
  name: string;
  gamma: number;
  brightness: number;
}

export interface CTMetadata {
  modality: 'CT';
  bodyPart: string;
  sliceCount: number;
  sliceThickness: string;
  kvp: string;
  windowPresets: Record<string, WindowPreset>;
  pixelSpacing: [number, number];
  slices: Array<{
    filename: string;
    position: number;
    huRange: [number, number];
  }>;
}

export interface MRIMetadata {
  modality: 'MRI';
  bodyPart: string;
  sliceCount: number;
  sliceThickness: string;
  sequencePresets: Record<string, SequencePreset>;
  pixelSpacing: [number, number];
  slices: Array<{
    filename: string;
    position: number;
    sequence: string;
  }>;
}

export interface XRayMetadata {
  modality: 'XRAY';
  bodyPart: string;
  sliceCount: number;
  viewPosition: string;
  kvp: string;
  mas: string;
  viewPresets: Record<string, ViewPreset>;
  pixelSpacing: [number, number];
  images: Array<{
    filename: string;
    view: string;
  }>;
}

export type SampleMetadata = CTMetadata | MRIMetadata | XRayMetadata;

export const getSampleImagePath = (
  modality: string,
  bodyPart: string,
  filename: string
): string => {
  return `/samples/${modality.toLowerCase()}/${bodyPart.toLowerCase()}/${filename}`;
};

export const loadSampleMetadata = async (
  modality: string,
  bodyPart: string
): Promise<SampleMetadata | null> => {
  try {
    const response = await fetch(
      `/samples/${modality.toLowerCase()}/${bodyPart.toLowerCase()}/metadata.json`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to load sample metadata:', error);
    return null;
  }
};