// Dynamically import cornerstone modules to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cornerstone: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cornerstoneWADOImageLoader: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dicomParser: any = null;

// Initialize on client side only
if (typeof window !== 'undefined') {
  // Use dynamic imports to avoid SSR issues
  const initCornerstone = async () => {
    const cornerstoneModule = await import('cornerstone-core');
    const wadoModule = await import('cornerstone-wado-image-loader');
    const dicomParserModule = await import('dicom-parser');
    
    cornerstone = cornerstoneModule.default;
    cornerstoneWADOImageLoader = wadoModule.default;
    dicomParser = dicomParserModule.default;
    
    // Configure web worker for WADO image loader
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    // Configure web worker path
    const config = {
      webWorkerPath: '/workers/cornerstoneWADOImageLoaderWebWorker.js',
      taskConfiguration: {
        decodeTask: {
          loadCodecsOnStartup: true,
          initializeCodecsOnStartup: false,
          codecsPath: '/workers/cornerstoneWADOImageLoaderCodecs.js',
          usePDFJS: false,
          strict: false,
        },
      },
    };

    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
  };
  
  initCornerstone();
}

export { cornerstone, cornerstoneWADOImageLoader, dicomParser };
export default cornerstone;
