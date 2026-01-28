'use client';

import { Card } from '@/components/ui/card';
import { Ruler, Circle, Target, Trash2, Clock } from 'lucide-react';

export interface CTMeasurement {
  id: string;
  type: 'length' | 'area' | 'hu-probe' | 'hu-roi';
  value: number;
  unit: string;
  location: string;
  timestamp: string;
  huValue?: number;
  huStats?: {
    mean: number;
    min: number;
    max: number;
    stdDev: number;
  };
}

interface CTMeasurementsPanelProps {
  measurements: CTMeasurement[];
  onDelete: (id: string) => void;
}

const measurementIcons = {
  length: Ruler,
  area: Circle,
  'hu-probe': Target,
  'hu-roi': Circle,
};

const measurementLabels = {
  length: 'Gjatësia',
  area: 'Sipërfaqja',
  'hu-probe': 'HU Probe',
  'hu-roi': 'HU ROI',
};

export function CTMeasurementsPanel({ measurements, onDelete }: CTMeasurementsPanelProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (measurements.length === 0) {
    return (
      <div className="text-center py-8">
        <Ruler className="h-8 w-8 text-text-muted mx-auto mb-3 opacity-50" />
        <p className="text-sm text-text-muted">No CT measurements</p>
        <p className="text-xs text-text-muted mt-1">
          Use measurement tools to add HU values and measurements
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {measurements.map((measurement) => {
        const Icon = measurementIcons[measurement.type];
        return (
          <Card
            key={measurement.id}
            className="bg-darker border-border-medical p-3 group hover:border-border-medical-light transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-dark rounded-md">
                <Icon className="h-4 w-4 text-primary-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {measurementLabels[measurement.type]}
                  </span>
                  <span className="text-sm font-semibold text-primary-blue whitespace-nowrap">
                    {measurement.value.toFixed(2)} {measurement.unit}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 truncate">
                  {measurement.location}
                </p>

                {/* HU Value Display */}
                {measurement.huValue !== undefined && (
                  <div className="mt-2 p-2 bg-black/40 rounded border border-primary-blue/20">
                    <div className="text-xs text-text-muted">
                      Vlera HU: <span className="text-primary-blue font-mono font-semibold">{measurement.huValue}</span>
                    </div>
                  </div>
                )}

                {/* HU Statistics for ROI */}
                {measurement.huStats && (
                  <div className="mt-2 p-2 bg-black/40 rounded border border-primary-blue/20 space-y-1">
                    <div className="text-xs text-text-muted flex justify-between">
                      <span>HU mesatare:</span>
                      <span className="text-primary-blue font-mono font-semibold">{measurement.huStats.mean.toFixed(1)}</span>
                    </div>
                    <div className="text-xs text-text-muted flex justify-between">
                      <span>Gamë:</span>
                      <span className="text-primary-blue font-mono">{measurement.huStats.min.toFixed(0)} - {measurement.huStats.max.toFixed(0)}</span>
                    </div>
                    <div className="text-xs text-text-muted flex justify-between">
                      <span>DS:</span>
                      <span className="text-primary-blue font-mono">{measurement.huStats.stdDev.toFixed(1)}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-medical/50">
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(measurement.timestamp)}
                  </div>
                  <button
                    onClick={() => onDelete(measurement.id)}
                    className="p-1 text-text-muted hover:text-error hover:bg-error/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete measurement"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
