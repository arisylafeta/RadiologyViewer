interface ConfidenceMeterProps {
  confidence: number; // 0-100
}

export function ConfidenceMeter({ confidence }: ConfidenceMeterProps) {
  const getColor = (conf: number) => {
    if (conf >= 80) return 'bg-success';
    if (conf >= 60) return 'bg-info';
    if (conf >= 40) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">Confidence</span>
        <span className="text-text-primary font-medium">{confidence}%</span>
      </div>
      <div className="h-2 bg-darker rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(confidence)} transition-all duration-300`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
