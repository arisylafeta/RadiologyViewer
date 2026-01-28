'use client';

import { Card } from '@/components/ui/card';
import { Ruler, Triangle, Trash2, Clock } from 'lucide-react';

export interface XRayMeasurement {
  id: string;
  type: 'length' | 'angle' | 'cobb-angle';
  value: number;
  unit: string;
  location: string;
  timestamp: string;
  description?: string;
}

interface XRayMeasurementsPanelProps {
  measurements: XRayMeasurement[];
  onDelete: (id: string) => void;
}

const measurementIcons = {
  length: Ruler,
  angle: Triangle,
  'cobb-angle': Triangle,
};

const measurementLabels = {
  length: 'Gjatësia',
  angle: 'Këndi',
  'cobb-angle': 'Këndi Cobb',
};

export function XRayMeasurementsPanel({ measurements, onDelete }: XRayMeasurementsPanelProps) {
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
        <p className="text-sm text-text-muted">Asnjë matje rentgeni</p>
        <p className="text-xs text-text-muted mt-1">
          Përdorni mjetet e matjes për analizën e kockave dhe këndeve
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
                {measurement.description && (
                  <p className="text-xs text-text-muted mt-1 truncate">
                    {measurement.description}
                  </p>
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
