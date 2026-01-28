Architecture & Tech Stack
Framework: Next.js 16 with App Router, TypeScript
UI Library: shadcn/ui (modern, customizable, professional)
Styling: Tailwind CSS
State: Zustand (lightweight)
Icons: Lucide React
Mock Data: Hardcoded JSON files for patient records, scan history, analysis results
The system will have 4 main pages:
1. Dashboard (/) - Overview with stats, recent scans, government import
2. MRI Scans (/mri) - MRI upload and analysis interface
3. X-Ray Scans (/xray) - X-ray upload and analysis interface  
4. CT Scans (/ct) - CT upload and analysis interface
---
Dashboard Design
The dashboard will be a sophisticated medical command center:
- Header: Logo (Ministry of Health Albania 🇦🇱), user profile, notifications bell, settings
- Stats Cards Row: 4 colorful cards showing:
  - Total Scans (2,847)
  - Pending Reviews (23)
  - AI Accuracy (94.7%)
  - Government Imports (156 this week)
- Main Content Area:
  - Recent Scans Table: Paginated, filterable, showing patient name, scan type, date, status, action buttons
  - Quick Actions Panel: 4 large buttons - Upload MRI, Upload X-Ray, Upload CT, Import from Government
  - Patient Search: Search bar with autocomplete
- Sidebar Navigation: Dashboard, MRI Scans, X-Ray Scans, CT Scans, Patients, Settings, Logout
Does this dashboard direction look right so far?

Dashboard Design (Dark Theme)
Color Palette:
- Backgrounds: Dark slate (#0f172a, #1e293b)
- Surfaces: Lighter slate (#334155)
- Text: Light gray/white (#e2e8f0, #f8fafc)
- Accents: Dark blue (#1e40af, #2563eb) for active states
- Borders: Subtle slate (#475569)
Header: Dark slate bar (#1e293b), Ministry logo in white, subtle bottom border
Stats Cards: Dark surface (#334155), minimal white icons, light text
Table: Dark row backgrounds, lighter hover (#475569), muted status indicators
Navigation: Dark sidebar (#0f172a), light text, blue highlight for active state
Professional, high-contrast medical software aesthetic - similar to dark mode in Epic or Cerner systems.
---
Individual Scan Pages
Same layout (sidebar/viewer/analysis) but with dark theme:
- Viewer Area: Pure black background (#000000) for scans
- Panel Backgrounds: Dark slate (#1e293b)
- Text: Light gray (#e2e8f0)
- Buttons: Dark blue (#2563eb) with white text
- AI Overlays: Bright, high-contrast colors on scan (cyan, magenta, lime)
Does the dark palette direction work?


Understood - minimal, professional government aesthetic. 
Dashboard Design (Revised)
- Color Palette: White backgrounds, light grays (#f8f9fa, #e9ecef), dark text (#1f2937), subtle blue accents (#0ea5e9) only for active states/primary actions
- Header: Clean white bar with Ministry of Health logo (text + 🇦🇱), subtle divider line
- Stats Cards: White cards with light gray borders, monochromatic icons, dark numbers
- Table: Clean rows, subtle hover backgrounds, minimal indicators for status
- Navigation: Light gray sidebar, dark text, white active state with subtle left border highlight
The interface will resemble professional medical EMR systems (Epic, Cerner) - data-forward, clean, functional.
---
Individual Scan Pages (MRI/X-Ray/CT)
Each scan page will feature:
Layout: Left sidebar (patient info, history), center (DICOM viewer), right (AI analysis panel)
Center Viewer:
- Multi-slice browser with scroll
- Pan/zoom tools (minimal toolbar)
- Window/level sliders
- Measurement tools (distance, angle, ROI)
- Overlay toggle for AI segmentations
- Comparison view (before/after)
- 3D reconstruction button (simulated)
Right Panel:
- AI analysis results (segmentation masks, probability scores)
- Pathology detection list with confidence levels
- Clinical notes section
- Export report button
- Save to patient history button
Does this minimal, professional direction look right?