import { create } from 'zustand';

interface ViewerState {
  // Current scan
  currentScanId: string | null;
  currentSliceIndex: number;
  totalSlices: number;

  // Window/Level settings
  windowWidth: number;
  windowCenter: number;

  // Tool state
  activeTool: 'pan' | 'zoom' | 'measure' | 'none';
  showAIOverlay: boolean;

  // Grid view
  gridSize: 1 | 4 | 9 | 16;

  // Actions
  setCurrentScan: (scanId: string, totalSlices: number) => void;
  setSliceIndex: (index: number) => void;
  setWindowLevel: (width: number, center: number) => void;
  setActiveTool: (tool: ViewerState['activeTool']) => void;
  toggleAIOverlay: () => void;
  setGridSize: (size: ViewerState['gridSize']) => void;
  reset: () => void;
}

const defaultState = {
  currentScanId: null,
  currentSliceIndex: 0,
  totalSlices: 0,
  windowWidth: 400,
  windowCenter: 40,
  activeTool: 'none' as const,
  showAIOverlay: false,
  gridSize: 1 as const,
};

export const useViewerStore = create<ViewerState>((set) => ({
  ...defaultState,

  setCurrentScan: (scanId, totalSlices) =>
    set({ currentScanId: scanId, totalSlices, currentSliceIndex: 0 }),

  setSliceIndex: (index) =>
    set((state) => ({
      currentSliceIndex: Math.max(0, Math.min(index, state.totalSlices - 1)),
    })),

  setWindowLevel: (width, center) =>
    set({ windowWidth: width, windowCenter: center }),

  setActiveTool: (tool) =>
    set({ activeTool: tool }),

  toggleAIOverlay: () =>
    set((state) => ({ showAIOverlay: !state.showAIOverlay })),

  setGridSize: (size) =>
    set({ gridSize: size }),

  reset: () =>
    set(defaultState),
}));
