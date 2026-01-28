import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIFinding } from '@/lib/types';
import { ConfidenceMeter } from './confidence-meter';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface FindingCardProps {
  finding: AIFinding;
}

const severityConfig = {
  normal: {
    icon: CheckCircle,
    color: 'text-success',
    bgColor: 'bg-success/20',
    borderColor: 'border-success/50',
    label: 'Normal',
  },
  mild: {
    icon: AlertCircle,
    color: 'text-info',
    bgColor: 'bg-info/20',
    borderColor: 'border-info/50',
    label: 'Mild',
  },
  moderate: {
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/20',
    borderColor: 'border-warning/50',
    label: 'Moderate',
  },
  severe: {
    icon: AlertTriangle,
    color: 'text-error',
    bgColor: 'bg-error/20',
    borderColor: 'border-error/50',
    label: 'Severe',
  },
};

export function FindingCard({ finding }: FindingCardProps) {
  const config = severityConfig[finding.severity];
  const Icon = config.icon;

  return (
    <Card className={`bg-darker border ${config.borderColor} p-4`}>
      <div className="flex items-start gap-3 mb-3">
        <Icon className={`h-5 w-5 ${config.color} mt-0.5`} />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-text-primary mb-1">
            {finding.name}
          </h4>
          <Badge variant="outline" className={`${config.bgColor} ${config.color} ${config.borderColor}`}>
            {config.label}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-3">
        {finding.description}
      </p>

      <ConfidenceMeter confidence={finding.confidence} />
    </Card>
  );
}
