'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FindingCard } from './finding-card';
import { mockAIAnalyses } from '@/lib/mock-data';
import { Download, FileText, Clock } from 'lucide-react';

interface AIAnalysisPanelProps {
  scanId: string;
}

export function AIAnalysisPanel({ scanId }: AIAnalysisPanelProps) {
  const analysis = mockAIAnalyses[scanId];

  if (!analysis || !analysis.analyzedAt) {
    return (
      <Card className="bg-dark border-border p-6">
        <div className="text-center text-text-muted">
          <p>No AI analysis available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-dark border-border p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          AI Analysis Results
        </h3>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Clock className="h-3 w-3" />
          <span>Analyzed in {analysis.processingTime}s</span>
        </div>
      </div>

      <Separator className="bg-border" />

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-primary">Findings</h4>
        {analysis.findings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} />
        ))}
      </div>

      <Separator className="bg-border" />

      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-2">
          Overall Assessment
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed">
          {analysis.overallAssessment}
        </p>
      </div>

      <Separator className="bg-border" />

      <div className="space-y-2">
        <Button variant="default" size="sm" className="w-full">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Export Analysis
        </Button>
      </div>
    </Card>
  );
}
