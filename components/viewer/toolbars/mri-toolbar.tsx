'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MRIToolbarProps {
  activeSequence: string;
  onSequenceChange: (sequence: string) => void;
}

const sequences = [
  { id: 't1', name: 'T1-Weighted', tr: 450, te: 15, description: 'Anatomy' },
  { id: 't2', name: 'T2-Weighted', tr: 4000, te: 100, description: 'Edema/Fluid' },
  { id: 'flair', name: 'FLAIR', tr: 9000, te: 120, description: 'Suppress CSF' },
  { id: 'dwi', name: 'Diffusion', tr: 3000, te: 80, description: 'Ischemia' },
  { id: 'pd', name: 'Proton Density', tr: 2000, te: 20, description: 'Tissue contrast' },
  { id: 't1-gad', name: 'T1 + Gad', tr: 450, te: 15, description: 'Enhancement' },
];

export function MRIToolbar({ activeSequence, onSequenceChange }: MRIToolbarProps) {
  const currentSeq = sequences.find((s) => s.id === activeSequence) || sequences[0];

  return (
    <>
      <div className="h-6 w-px bg-white/10 mx-2" />

      {/* Sequence Selection */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-white/90 hover:text-white hover:bg-white/10 gap-2 text-xs font-medium"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{currentSeq.name}</span>
            <span className="text-white/50">TR:{currentSeq.tr} TE:{currentSeq.te}</span>
            <ChevronDown className="h-3 w-3 text-white/50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-slate-900 border-slate-700 w-72">
          <DropdownMenuLabel className="text-white/50 text-xs">MRI Sequences</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />

          {sequences.map((seq) => (
            <DropdownMenuItem
              key={seq.id}
              onClick={() => onSequenceChange(seq.id)}
              className={cn(
                'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer text-xs flex flex-col items-start gap-1 py-2',
                activeSequence === seq.id && 'bg-primary text-white'
              )}
            >
              <div className="flex justify-between w-full">
                <span className="font-medium">{seq.name}</span>
                <span className="text-white/50 text-xs">TR:{seq.tr} TE:{seq.te}</span>
              </div>
              <span className="text-white/50 text-xs">{seq.description}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Contrast Controls (mock display) */}
      <div className="px-3 py-1 bg-black/40 rounded border border-white/10 flex items-center gap-2">
        <div className="text-xs text-white/50">Contrast: <span className="text-white">1.0</span></div>
      </div>
    </>
  );
}
