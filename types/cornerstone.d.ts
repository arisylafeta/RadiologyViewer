declare module 'cornerstone-core' {
  export interface Image {
    imageId: string;
    minPixelValue: number;
    maxPixelValue: number;
    slope: number;
    intercept: number;
    windowCenter: number;
    windowWidth: number;
    getPixelData: () => Float32Array | Int16Array | Uint16Array | Uint8Array;
    getImageData: () => ImageData;
    rows: number;
    columns: number;
    height: number;
    width: number;
    color: boolean;
    columnPixelSpacing: number;
    rowPixelSpacing: number;
    invert: boolean;
    sizeInBytes: number;
    rgba: boolean;
  }

  export interface EnabledElement {
    element: HTMLElement;
    image?: Image;
    canvas?: HTMLCanvasElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    viewport?: any;
  }

  const cornerstone: {
    loadImage(imageId: string): Promise<Image>;
    displayImage(element: HTMLElement, image: Image): void;
    enable(element: HTMLElement): void;
    disable(element: HTMLElement): void;
    getEnabledElement(element: HTMLElement): EnabledElement | undefined;
    resize(element: HTMLElement, fit?: boolean): void;
  };
  export default cornerstone;
}

declare module 'cornerstone-wado-image-loader' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cornerstoneWADOImageLoader: any;
  export default cornerstoneWADOImageLoader;
}

declare module 'dicom-parser' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dicomParser: any;
  export default dicomParser;
}
