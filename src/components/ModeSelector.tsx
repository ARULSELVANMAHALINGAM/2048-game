import React from 'react';
import { GameMode } from '../types';
import { Flame, ShieldAlert, Award, Compass, Timer } from 'lucide-react';
import { GameTheme } from '../utils/gameData';

interface ModeSelectorProps {
  activeMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  accentColor: string;
  activeTheme: GameTheme;
}

const MODES = [
  {
    id: 'classic' as GameMode,
    name: 'Classic',
    description: 'The standard 2048 strategic tile-sliding experience.',
    icon: Award,
    badge: 'Standard',
    badgeColor: 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
  },
  {
    id: 'zen' as GameMode,
    name: 'Zen Play',
    description: 'Unlimited relaxation. No defeat, free undo options, play forever.',
    icon: Compass,
    badge: 'Relax',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
  },
  {
    id: 'timeattack' as GameMode,
    name: 'Time Attack',
    description: '2-Minute countdown blitz! Reach highest score before time limits end.',
    icon: Timer,
    badge: '120s Blitz',
    badgeColor: 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
  },
  {
    id: 'survival' as GameMode,
    name: 'Survival',
    description: 'Stone obstacles block slots. Consolidate around static boulders!',
    icon: ShieldAlert,
    badge: 'Hardcore',
    badgeColor: 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
  }
];

export default function ModeSelector({
  activeMode,
  onSelectMode,
  accentColor,
  activeTheme,
}: ModeSelectorProps) {
  const isDarkTheme = activeTheme.id === 'neon' || activeTheme.id === 'cyberpunk' || activeTheme.id === 'retro';

  const containerStyle = isDarkTheme 
    ? 'bg-slate-950/70 border-slate-800/80 text-slate-100 backdrop-blur-md shadow-lg' 
    : 'bg-white/95 border-slate-200/80 text-slate-800 shadow-sm';

  return (
    <div id="mode-selector-container" className={`border rounded-2xl p-4 select-none mb-3.5 transition-all duration-300 ${containerStyle}`}>
      <h3 className="font-bold uppercase tracking-wider text-[10px] mb-2.5 flex items-center gap-1.5 opacity-80">
        <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <span>Select Game Mode</span>
      </h3>
      <div className="flex flex-col gap-2.5">
        {MODES.map((m) => {
          const Icon = m.icon;
          const isActive = activeMode === m.id;

          const buttonBorderClass = isActive
            ? 'border-2 scale-[1.01]'
            : isDarkTheme 
              ? 'border-slate-800/60 hover:border-slate-700/60 hover:bg-white/5' 
              : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50';

          return (
            <button
              key={m.id}
              id={`mode-btn-${m.id}`}
              onClick={() => onSelectMode(m.id)}
              className={`flex flex-col items-start p-2.5 border rounded-xl text-left transition duration-150 cursor-pointer ${buttonBorderClass}`}
              style={{
                borderColor: isActive ? accentColor : undefined,
                boxShadow: isActive ? `0 0 10px ${accentColor}20` : undefined
              }}
            >
              <div className="flex items-center justify-between w-full gap-1">
                <span className="font-black text-[10px] flex items-center gap-1 uppercase truncate">
                  <Icon className="w-3.5 h-3.5" style={{ color: isActive ? accentColor : '#94A3B8' }} />
                  {m.name}
                </span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase flex-shrink-0 ${m.badgeColor}`}>
                  {m.badge}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight mt-1.5">
                {m.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
