import { create } from 'zustand';

interface Measurement {
  id: string;
  tool: string;
  value: number;
  unit: string;
  location: string;
  coordinates: number[][];
  timestamp: string;
}

interface ViewportState {
  sliceIndex: number;
  windowWidth: number;
  windowCenter: number;
  zoom: number;
  pan: { x: number; y: number };
}

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

  // Layout management
  layout: '1x1' | '1x2' | '2x2' | '3x3';
  activeViewportIndex: number;

  // Enhanced tool system
  toolOptions: Record<string, any>;

  // Measurement tracking
  measurements: Measurement[];
  selectedMeasurementId: string | null;

  // Viewport state per viewport
  viewportStates: ViewportState[];

  // Actions
  setCurrentScan: (scanId: string, totalSlices: number) => void;
  setSliceIndex: (index: number) => void;
  setWindowLevel: (width: number, center: number) => void;
  setActiveTool: (tool: ViewerState['activeTool']) => void;
  toggleAIOverlay: () => void;
  setGridSize: (size: ViewerState['gridSize']) => void;
  reset: () => void;
  setLayout: (layout: ViewerState['layout']) => void;
  setActiveViewport: (index: number) => void;
  addMeasurement: (measurement: Measurement) => void;
  deleteMeasurement: (id: string) => void;
  updateMeasurement: (id: string, updates: Partial<Measurement>) => void;
  selectMeasurement: (id: string | null) => void;
  updateViewportState: (index: number, state: Partial<ViewportState>) => void;
  resetMeasurements: () => void;
}

const defaultViewportState: ViewportState = {
  sliceIndex: 0,
  windowWidth: 400,
  windowCenter: 40,
  zoom: 1,
  pan: { x: 0, y: 0 },
};

const defaultState = {
  currentScanId: null,
  currentSliceIndex: 0,
  totalSlices: 0,
  windowWidth: 400,
  windowCenter: 40,
  activeTool: 'none' as const,
  showAIOverlay: false,
  gridSize: 1 as const,
  layout: '1x1' as const,
  activeViewportIndex: 0,
  toolOptions: {},
  measurements: [] as Measurement[],
  selectedMeasurementId: null,
  viewportStates: [defaultViewportState],
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

  setLayout: (layout) =>
    set((state) => {
      const viewportCount = layout === '1x1' ? 1 : layout === '1x2' ? 2 : layout === '2x2' ? 4 : 9;
      const newViewportStates = Array.from({ length: viewportCount }, (_, i) =>
        state.viewportStates[i] || { ...defaultViewportState }
      );
      return { layout, viewportStates: newViewportStates };
    }),

  setActiveViewport: (index) =>
    set({ activeViewportIndex: index }),

  addMeasurement: (measurement) =>
    set((state) => ({
      measurements: [...state.measurements, measurement],
    })),

  deleteMeasurement: (id) =>
    set((state) => ({
      measurements: state.measurements.filter((m) => m.id !== id),
      selectedMeasurementId: state.selectedMeasurementId === id ? null : state.selectedMeasurementId,
    })),

  updateMeasurement: (id, updates) =>
    set((state) => ({
      measurements: state.measurements.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  selectMeasurement: (id) =>
    set({ selectedMeasurementId: id }),

  updateViewportState: (index, state) =>
    set((prev) => {
      const newViewportStates = [...prev.viewportStates];
      if (newViewportStates[index]) {
        newViewportStates[index] = { ...newViewportStates[index], ...state };
      }
      return { viewportStates: newViewportStates };
    }),

  resetMeasurements: () =>
    set({ measurements: [], selectedMeasurementId: null }),
}));
