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
import { ChevronDown, Droplet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CTMetadataToolbarProps {
  presets?: Record<string, { name: string; width: number; level: number; description?: string }>;
  activePreset: string;
  onPresetChange: (preset: string) => void;
}

const defaultPresets = [
  { id: 'brain', name: 'Brain', w: 80, l: 40, description: undefined as string | undefined },
  { id: 'subdural', name: 'Subdural', w: 200, l: 75, description: undefined as string | undefined },
  { id: 'stroke', name: 'Stroke', w: 8, l: 32, description: undefined as string | undefined },
  { id: 'bone', name: 'Bone', w: 2500, l: 480, description: undefined as string | undefined },
  { id: 'lung', name: 'Lung', w: 1500, l: -600, description: undefined as string | undefined },
  { id: 'mediastinum', name: 'Mediastinum', w: 350, l: 50, description: undefined as string | undefined },
  { id: 'abdomen', name: 'Abdomen', w: 350, l: 40, description: undefined as string | undefined },
  { id: 'liver', name: 'Liver', w: 150, l: 30, description: undefined as string | undefined },
];

export function CTMetadataToolbar({ presets, activePreset, onPresetChange }: CTMetadataToolbarProps) {
  const windowPresets = presets ? 
    Object.entries(presets).map(([key, value]) => ({
      id: key,
      name: value.name,
      w: value.width,
      l: value.level,
      description: value.description,
    })) :
    defaultPresets;

  const currentPreset = windowPresets.find((p) => p.id === activePreset) || windowPresets[0];

  return (
    <>
      <div className="h-6 w-px bg-white/10 mx-2" />

      {/* Window/Level Presets */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-white/90 hover:text-white hover:bg-white/10 gap-2 text-xs font-medium"
          >
            <Droplet className="h-3.5 w-3.5" />
            <span>{currentPreset.name}</span>
            <span className="text-white/50">W:{currentPreset.w} L:{currentPreset.l}</span>
            <ChevronDown className="h-3 w-3 text-white/50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-slate-900 border-slate-700 w-64">
          <DropdownMenuLabel className="text-white/50 text-xs">CT Window Presets</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />

          {windowPresets.map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={cn(
                'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer text-xs flex flex-col items-start gap-1',
                activePreset === preset.id && 'bg-primary text-white'
              )}
            >
              <div className="flex justify-between w-full">
                <span>{preset.name}</span>
                <span className="text-white/50 text-xs">W:{preset.w} L:{preset.l}</span>
              </div>
              {preset.description && (
                <span className="text-white/40 text-xs">{preset.description}</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* HU Value Display (mock) */}
      <div className="px-3 py-1 bg-black/40 rounded border border-white/10">
        <div className="text-xs text-white/50">HU: <span className="text-white font-mono">42</span></div>
      </div>
    </>
  );
}
