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
import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XRayToolbarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const viewPresets = [
  { id: 'standard', name: 'Standard', description: 'Default view' },
  { id: 'bone', name: 'Bone Enhancement', description: 'Enhance bone structures' },
  { id: 'soft', name: 'Soft Tissue', description: 'Enhance soft tissue' },
  { id: 'inverted', name: 'Inverted', description: 'Negative image' },
];

export function XRayToolbar({ activeView, onViewChange }: XRayToolbarProps) {
  const currentView = viewPresets.find((v) => v.id === activeView) || viewPresets[0];

  return (
    <>
      <div className="h-6 w-px bg-white/10 mx-2" />

      {/* View Presets */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-white/90 hover:text-white hover:bg-white/10 gap-2 text-xs font-medium"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{currentView.name}</span>
            <ChevronDown className="h-3 w-3 text-white/50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-slate-900 border-slate-700 w-64">
          <DropdownMenuLabel className="text-white/50 text-xs">X-Ray View Presets</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />

          {viewPresets.map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => onViewChange(preset.id)}
              className={cn(
                'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer text-xs flex flex-col items-start gap-1 py-2',
                activeView === preset.id && 'bg-primary text-white'
              )}
            >
              <span className="font-medium">{preset.name}</span>
              <span className="text-white/50 text-xs">{preset.description}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Technique Info (mock) */}
      <div className="px-3 py-1 bg-black/40 rounded border border-white/10">
        <div className="text-xs text-white/50">kVp: <span className="text-white">120</span> | mAs: <span className="text-white">3.2</span></div>
      </div>
    </>
  );
}
