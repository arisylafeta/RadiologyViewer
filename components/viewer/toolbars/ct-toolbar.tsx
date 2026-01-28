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

interface CTToolbarProps {
  activePreset: string;
  onPresetChange: (preset: string) => void;
}

const windowPresets = [
  { id: 'brain', name: 'Brain', w: 80, l: 40 },
  { id: 'subdural', name: 'Subdural', w: 200, l: 75 },
  { id: 'stroke', name: 'Stroke', w: 8, l: 32 },
  { id: 'bone', name: 'Bone', w: 2500, l: 480 },
  { id: 'lung', name: 'Lung', w: 1500, l: -600 },
  { id: 'mediastinum', name: 'Mediastinum', w: 350, l: 50 },
  { id: 'abdomen', name: 'Abdomen', w: 350, l: 40 },
  { id: 'liver', name: 'Liver', w: 150, l: 30 },
];

export function CTToolbar({ activePreset, onPresetChange }: CTToolbarProps) {
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

          <DropdownMenuLabel className="text-white/70 text-xs font-semibold">Head</DropdownMenuLabel>
          {windowPresets.slice(0, 4).map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={cn(
                'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer text-xs flex justify-between',
                activePreset === preset.id && 'bg-primary text-white'
              )}
            >
              <span>{preset.name}</span>
              <span className="text-white/50 text-xs">W:{preset.w} L:{preset.l}</span>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuLabel className="text-white/70 text-xs font-semibold">Chest</DropdownMenuLabel>
          {windowPresets.slice(4, 6).map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={cn(
                'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer text-xs flex justify-between',
                activePreset === preset.id && 'bg-primary text-white'
              )}
            >
              <span>{preset.name}</span>
              <span className="text-white/50 text-xs">W:{preset.w} L:{preset.l}</span>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuLabel className="text-white/70 text-xs font-semibold">Abdomen</DropdownMenuLabel>
          {windowPresets.slice(6, 8).map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={cn(
                'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer text-xs flex justify-between',
                activePreset === preset.id && 'bg-primary text-white'
              )}
            >
              <span>{preset.name}</span>
              <span className="text-white/50 text-xs">W:{preset.w} L:{preset.l}</span>
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
