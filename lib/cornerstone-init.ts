import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

// Configure web worker for WADO image loader
if (typeof window !== 'undefined') {
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
}

export { cornerstone, cornerstoneWADOImageLoader, dicomParser };
export default cornerstone;
