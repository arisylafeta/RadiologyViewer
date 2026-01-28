#!/bin/bash

# Script to download sample DICOM files for Radiology Friend
# Sources: Cornerstone.js test images, DICOM Library

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DICOM_DIR="$PROJECT_ROOT/public/dicom-library"

echo "Downloading sample DICOM files..."
echo "Target directory: $DICOM_DIR"

# Create directories if they don't exist
mkdir -p "$DICOM_DIR/mri-brain-001"
mkdir -p "$DICOM_DIR/xray-chest-001"
mkdir -p "$DICOM_DIR/ct-chest-001"

# Download MRI Brain sample from Cornerstone test images
echo "Downloading MRI Brain sample..."
curl -L -o "$DICOM_DIR/mri-brain-001/IM-0001-0001.dcm" \
  "https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages/CT2_J2KR" \
  || echo "Failed to download MRI sample"

# Download X-Ray Chest sample
echo "Downloading X-Ray Chest sample..."
curl -L -o "$DICOM_DIR/xray-chest-001/IM-0001-0001.dcm" \
  "https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages/CT2_J2KI" \
  || echo "Failed to download X-Ray sample"

# Download CT Chest sample
echo "Downloading CT Chest sample..."
curl -L -o "$DICOM_DIR/ct-chest-001/IM-0001-0001.dcm" \
  "https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages/CTImage.dcm" \
  || echo "Failed to download CT sample"

# Alternative: Download from DICOM Library (requires manual download)
# echo ""
# echo "Alternative sources:"
# echo "1. https://www.dicomlibrary.com/ - Download and place files manually"
# echo "2. https://github.com/cornerstonejs/cornerstoneWADOImageLoader/tree/master/testImages"

echo ""
echo "Download complete!"
echo ""
echo "DICOM files location:"
ls -la "$DICOM_DIR"/*/
