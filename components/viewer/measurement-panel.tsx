'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FindingCard } from '@/components/ai-panel/finding-card';
import { AIFinding, ScanModality } from '@/lib/types';
import {
  Ruler,
  MoveDiagonal,
  Circle,
  Trash2,
  Download,
  FileText,
  ClipboardList,
  Activity,
  Clock,
} from 'lucide-react';
import { CTMeasurementsPanel, CTMeasurement } from './panels/ct-measurements';
import { MRIMeasurementsPanel, MRIMeasurement } from './panels/mri-measurements';
import { XRayMeasurementsPanel, XRayMeasurement } from './panels/xray-measurements';

export type MeasurementType = 'length' | 'angle' | 'area' | 'ellipse';

export interface Measurement {
  id: string;
  type: MeasurementType;
  value: number;
  unit: string;
  location: string;
  timestamp: string;
  description?: string;
}

interface MeasurementPanelProps {
  scanId: string;
  modality: ScanModality;
  measurements: Measurement[];
  aiFindings?: AIFinding[];
  overallAssessment?: string;
  onDeleteMeasurement: (id: string) => void;
  onExport: () => void;
  onGenerateReport?: () => void;

  // Modality-specific measurements
  ctMeasurements?: CTMeasurement[];
  mriMeasurements?: MRIMeasurement[];
  xrayMeasurements?: XRayMeasurement[];
}

type TabType = 'measurements' | 'ai-findings' | 'report';

const measurementIcons: Record<MeasurementType, typeof Ruler> = {
  length: Ruler,
  angle: MoveDiagonal,
  area: Circle,
  ellipse: Circle,
};

const measurementLabels: Record<MeasurementType, string> = {
  length: 'Length',
  angle: 'Angle',
  area: 'Area',
  ellipse: 'Ellipse',
};

export function MeasurementPanel({
  scanId,
  modality,
  measurements,
  aiFindings = [],
  overallAssessment = '',
  onDeleteMeasurement,
  onExport,
  onGenerateReport,
  ctMeasurements,
  mriMeasurements,
  xrayMeasurements,
}: MeasurementPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('measurements');

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const tabs = [
    { id: 'measurements' as TabType, label: 'Measurements', icon: Ruler },
    { id: 'ai-findings' as TabType, label: 'AI Findings', icon: Activity },
    { id: 'report' as TabType, label: 'Report', icon: FileText },
  ];

  return (
    <div
      className="w-[320px] h-full bg-[#0f0f0f] border-l border-border-medical flex flex-col"
      style={{ backgroundColor: '#0f0f0f' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border-medical">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary-blue" />
          Measurement Tracking
        </h3>
        <p className="text-xs text-text-muted mt-1">Scan ID: {scanId}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-medical">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-2 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'text-primary-blue border-b-2 border-primary-blue bg-darker'
                  : 'text-text-muted hover:text-text-secondary hover:bg-darker/50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Measurements Tab */}
        {activeTab === 'measurements' && (
          <div className="p-3 space-y-2">
            {modality === 'CT' && ctMeasurements && (
              <CTMeasurementsPanel
                measurements={ctMeasurements}
                onDelete={onDeleteMeasurement}
              />
            )}
            {modality === 'MRI' && mriMeasurements && (
              <MRIMeasurementsPanel
                measurements={mriMeasurements}
                onDelete={onDeleteMeasurement}
              />
            )}
            {modality === 'XRAY' && xrayMeasurements && (
              <XRayMeasurementsPanel
                measurements={xrayMeasurements}
                onDelete={onDeleteMeasurement}
              />
            )}

            {/* Fallback to generic measurements */}
            {(!ctMeasurements && !mriMeasurements && !xrayMeasurements ||
              (modality === 'CT' && (!ctMeasurements || ctMeasurements.length === 0)) ||
              (modality === 'MRI' && (!mriMeasurements || mriMeasurements.length === 0)) ||
              (modality === 'XRAY' && (!xrayMeasurements || xrayMeasurements.length === 0))) && (
              <div className="text-center py-8">
                <Ruler className="h-8 w-8 text-text-muted mx-auto mb-3 opacity-50" />
                <p className="text-sm text-text-muted">No measurements yet</p>
                <p className="text-xs text-text-muted mt-1">
                  Use measurement tools to add
                </p>
              </div>
            )}
          </div>
        )}

        {/* AI Findings Tab */}
        {activeTab === 'ai-findings' && (
          <div className="p-3 space-y-3">
            {aiFindings.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 text-text-muted mx-auto mb-3 opacity-50" />
                <p className="text-sm text-text-muted">No AI findings</p>
                <p className="text-xs text-text-muted mt-1">
                  Run AI analysis to detect findings
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs text-text-muted">
                    {aiFindings.length} finding{aiFindings.length !== 1 ? 's' : ''} detected
                  </span>
                  <Badge variant="outline" className="text-xs bg-ai-cyan/10 text-ai-cyan border-ai-cyan/30">
                    AI Analysis
                  </Badge>
                </div>
                {aiFindings.map((finding) => (
                  <FindingCard key={finding.id} finding={finding} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Report Tab */}
        {activeTab === 'report' && (
          <div className="p-3 space-y-4">
            {/* Overall Assessment */}
            <div>
              <h4 className="text-xs font-semibold text-text-primary mb-2 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary-blue" />
                Overall Assessment
              </h4>
              <Card className="bg-darker border-border-medical p-3">
                {overallAssessment ? (
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {overallAssessment}
                  </p>
                ) : (
                  <p className="text-sm text-text-muted italic">
                    No assessment available. Generate a report to see the overall assessment.
                  </p>
                )}
              </Card>
            </div>

            {/* Key Findings Summary */}
            <div>
              <h4 className="text-xs font-semibold text-text-primary mb-2 flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5 text-primary-blue" />
                Key Findings Summary
              </h4>
              <Card className="bg-darker border-border-medical p-3">
                {measurements.length === 0 && aiFindings.length === 0 ? (
                  <p className="text-sm text-text-muted italic">
                    No measurements or findings to summarize.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {measurements.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Measurements</span>
                        <Badge variant="outline" className="bg-primary-blue/10 text-primary-blue border-primary-blue/30">
                          {measurements.length}
                        </Badge>
                      </div>
                    )}
                    {aiFindings.length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">AI Findings</span>
                        <Badge variant="outline" className="bg-ai-cyan/10 text-ai-cyan border-ai-cyan/30">
                          {aiFindings.length}
                        </Badge>
                      </div>
                    )}
                    {aiFindings.filter((f) => f.severity === 'severe').length > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary text-error">Critical Findings</span>
                        <Badge variant="outline" className="bg-error/10 text-error border-error/30">
                          {aiFindings.filter((f) => f.severity === 'severe').length}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Generate Report Button */}
            {onGenerateReport && (
              <Button
                onClick={onGenerateReport}
                className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border-medical bg-darker/50">
        <Button
          onClick={onExport}
          variant="outline"
          className="w-full border-border-medical text-text-secondary hover:bg-darker hover:text-text-primary"
          disabled={measurements.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Measurements
        </Button>
      </div>
    </div>
  );
}
