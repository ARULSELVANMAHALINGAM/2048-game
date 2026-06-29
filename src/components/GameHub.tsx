import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, Lock, Check, Coins, Bomb, Shuffle, 
  Snowflake, Sparkles, Zap, BarChart4, Trophy, 
  CalendarRange, CheckCircle2, Circle, Flame, 
  Star, AlertCircle, ShieldCheck 
} from 'lucide-react';
import { GameTheme } from '../utils/gameData';
import { GameStats, Achievement, DailyChallenge } from '../types';
export const POWERUPS_CONFIG = [
  {
    id: 'bomb' as const,
    name: 'Bomb Tile',
    description: 'Deletes any tile from the board to free up critical space.',
    cost: 50,
    icon: Bomb,
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30',
  },
  {
    id: 'shuffle' as const,
    name: 'Shuffle Board',
    description: 'Instantly rearranges all current tiles on the grid.',
    cost: 40,
    icon: Shuffle,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30',
  },
  {
    id: 'wildcard' as const,
    name: 'Wildcard Tile',
    description: 'Transform a tile to merge with any other value.',
    cost: 75,
    icon: Sparkles,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/30',
  },
  {
    id: 'freeze' as const,
    name: 'Freeze Tile',
    description: 'Lock a tile in place so it does not slide on the next move.',
    cost: 30,
    icon: Snowflake,
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30',
  },
  {
    id: 'double' as const,
    name: '2X Score',
    description: 'Earn double points on all merges for your next 5 moves.',
    cost: 60,
    icon: Zap,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30',
  }
];

interface GameHubProps {
  // Common
  coins: number;
  accentColor: string;
  activeTheme: GameTheme;

  // Themes
  themes: GameTheme[];
  activeThemeId: string;
  onSelectTheme: (themeId: string) => void;
  onUnlockTheme: (themeId: string, cost: number) => void;

  // Powerups
  activePowerup: 'bomb' | 'shuffle' | 'wildcard' | 'freeze' | 'double' | null;
  doubleMovesLeft: number;
  onSelectPowerup: (powerup: 'bomb' | 'shuffle' | 'wildcard' | 'freeze' | 'double') => void;

  // Dashboard
  stats: GameStats;
  achievements: Achievement[];
  challenges: DailyChallenge[];
}

type TabType = 'tactics' | 'themes' | 'progress';

export default function GameHub({
  coins,
  accentColor,
  activeTheme,
  themes,
  activeThemeId,
  onSelectTheme,
  onUnlockTheme,
  activePowerup,
  doubleMovesLeft,
  onSelectPowerup,
  stats,
  achievements,
  challenges,
}: GameHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>('tactics');

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    if (mins === 0) return `${rs}s`;
    return `${mins}m ${rs}s`;
  };

  const getAchievementIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'Trophy':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'Medal':
        return <Star className="w-4 h-4 text-yellow-500 fill-current" />;
      case 'Zap':
        return <Flame className="w-4 h-4 text-orange-500 animate-pulse" />;
      case 'Palette':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'Coins':
        return <Coins className="w-4 h-4 text-amber-500" />;
      case 'ShieldAlert':
        return <ShieldCheck className="w-4 h-4 text-rose-500" />;
      default:
        return <Trophy className="w-4 h-4 text-amber-500" />;
    }
  };

  // Determine container styling based on theme mode to fit visually
  const isDarkTheme = activeTheme.id === 'neon' || activeTheme.id === 'cyberpunk' || activeTheme.id === 'retro';
  
  const containerStyle = isDarkTheme 
    ? 'bg-slate-950/70 border-slate-800/80 text-slate-100 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-md' 
    : 'bg-white/95 border-slate-200/80 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md';

  const tabActiveStyle = isDarkTheme
    ? 'text-white border-b-2'
    : 'text-slate-900 border-b-2 font-bold';

  const tabInactiveStyle = 'text-slate-400 hover:text-slate-300';

  return (
    <div 
      id="game-hub-container" 
      className={`border rounded-2xl p-5 select-none w-full max-w-md lg:max-w-none mx-auto transition-all duration-300 ${containerStyle}`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-500/10">
        <div>
          <h2 className="text-sm font-black tracking-widest uppercase flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Grandmaster Hub</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
            Upgrades, custom styles & your live statistics
          </p>
        </div>
        
        {/* Unified Wallet HUD */}
        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-500 font-bold text-xs shadow-sm">
          <Coins className="w-3.5 h-3.5 fill-current" />
          <span className="font-mono">{coins}</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-500/10 mb-4 gap-1">
        <button
          id="hub-tab-tactics"
          onClick={() => setActiveTab('tactics')}
          className={`flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer`}
          style={{ 
            color: activeTab === 'tactics' ? accentColor : undefined,
            borderBottomColor: activeTab === 'tactics' ? accentColor : 'transparent',
            borderBottomWidth: activeTab === 'tactics' ? '2px' : '0px'
          }}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Tactics Shop</span>
        </button>

        <button
          id="hub-tab-themes"
          onClick={() => setActiveTab('themes')}
          className={`flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer`}
          style={{ 
            color: activeTab === 'themes' ? accentColor : undefined,
            borderBottomColor: activeTab === 'themes' ? accentColor : 'transparent',
            borderBottomWidth: activeTab === 'themes' ? '2px' : '0px'
          }}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Skins</span>
        </button>

        <button
          id="hub-tab-progress"
          onClick={() => setActiveTab('progress')}
          className={`flex-1 pb-3 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer`}
          style={{ 
            color: activeTab === 'progress' ? accentColor : undefined,
            borderBottomColor: activeTab === 'progress' ? accentColor : 'transparent',
            borderBottomWidth: activeTab === 'progress' ? '2px' : '0px'
          }}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>
      </div>

      {/* Content Panels */}
      <div className="min-h-[340px] max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence mode="wait">
          {activeTab === 'tactics' && (
            <motion.div
              key="tactics"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-[10px] text-slate-400 leading-relaxed mb-1">
                Deploy tactical operations to break blockades and secure maximum multipliers.
              </p>
              
              <div className="grid grid-cols-1 gap-2.5">
                {POWERUPS_CONFIG.map((p) => {
                  const Icon = p.icon;
                  const isActive = activePowerup === p.id;
                  const canAfford = coins >= p.cost;
                  const isDoubleActive = p.id === 'double' && doubleMovesLeft > 0;

                  return (
                    <div
                      key={p.id}
                      id={`hub-powerup-card-${p.id}`}
                      className={`flex items-center justify-between p-3 border rounded-xl transition-all duration-150 ${
                        isActive
                          ? 'border-2 ring-2 scale-[1.01] bg-amber-500/5'
                          : isDarkTheme ? 'border-slate-800/60 hover:border-slate-700/60' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={{
                        borderColor: isActive ? accentColor : undefined,
                        boxShadow: isActive ? `0 0 12px 1px ${accentColor}25` : undefined
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg flex-shrink-0 ${p.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs">{p.name}</span>
                            {isDoubleActive && (
                              <span className="bg-emerald-500 text-white font-black text-[8px] px-1.5 py-0.5 rounded uppercase animate-pulse">
                                {doubleMovesLeft} Moves Left
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5 max-w-[180px] md:max-w-[240px]">
                            {p.description}
                          </p>
                        </div>
                      </div>

                      <button
                        id={`hub-btn-buy-${p.id}`}
                        onClick={() => onSelectPowerup(p.id)}
                        disabled={!canAfford && !isActive}
                        className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase flex items-center gap-1 transition duration-150 active:scale-95 cursor-pointer ${
                          isActive
                            ? 'bg-rose-500 hover:bg-rose-600 text-white'
                            : canAfford
                            ? 'bg-slate-700 hover:bg-slate-600 text-white dark:bg-slate-800 dark:hover:bg-slate-700'
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        {isActive ? (
                          <span>Cancel</span>
                        ) : (
                          <>
                            <Coins className="w-3 h-3 fill-current text-amber-500" />
                            <span>{p.cost}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'themes' && (
            <motion.div
              key="themes"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-[10px] text-slate-400 leading-relaxed mb-1">
                Customize your playing field with high-fidelity sensory visual themes.
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {themes.map((theme) => {
                  const isActive = activeThemeId === theme.id;
                  const isUnlocked = theme.unlocked;
                  const canAfford = coins >= theme.price;

                  return (
                    <div
                      key={theme.id}
                      id={`hub-theme-card-${theme.id}`}
                      className={`flex items-center justify-between p-3 border rounded-xl transition-all duration-150 ${
                        isActive
                          ? 'border-2 shadow-md bg-amber-500/5'
                          : isDarkTheme ? 'border-slate-800/60 hover:border-slate-700/60' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={{
                        borderColor: isActive ? accentColor : undefined,
                        boxShadow: isActive ? `0 0 12px 1px ${accentColor}15` : undefined
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Visual palette indicator */}
                        <div className={`w-10 h-10 rounded-lg ${theme.bgClass} border border-slate-500/10 flex items-center justify-center relative overflow-hidden flex-shrink-0`}>
                          <div className={`absolute inset-1.5 rounded-md ${theme.gridBgClass} flex items-center justify-center`}>
                            <span className="text-[8px] font-black text-white tracking-tighter">2048</span>
                          </div>
                        </div>

                        <div>
                          <span className="font-extrabold text-xs flex items-center gap-1">
                            {theme.name}
                          </span>
                          <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                            {theme.description}
                          </p>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <button
                          id={`hub-btn-select-theme-${theme.id}`}
                          onClick={() => onSelectTheme(theme.id)}
                          className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase flex items-center gap-1 transition duration-150 active:scale-95 cursor-pointer ${
                            isActive
                              ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-default'
                              : 'bg-slate-700 hover:bg-slate-600 text-white dark:bg-slate-800 dark:hover:bg-slate-700'
                          }`}
                          disabled={isActive}
                        >
                          {isActive ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3px]" />
                              <span>Active</span>
                            </>
                          ) : (
                            <span>Apply</span>
                          )}
                        </button>
                      ) : (
                        <button
                          id={`hub-btn-unlock-theme-${theme.id}`}
                          onClick={() => onUnlockTheme(theme.id, theme.price)}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase flex items-center gap-1.5 transition duration-150 active:scale-95 cursor-pointer ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
                              : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3 h-3" />
                          <span>Unlock {theme.price}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Profile Overview Stats */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <BarChart4 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Permanent Record</span>
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-500/5 border border-slate-500/10 p-2.5 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Highest Score</span>
                    <span className="block text-base font-black font-mono mt-0.5">{stats.highestScore}</span>
                  </div>
                  <div className="bg-slate-500/5 border border-slate-500/10 p-2.5 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Highest Tile</span>
                    <span className="block text-base font-black font-mono mt-0.5">{stats.highestTile || 2}</span>
                  </div>
                  <div className="bg-slate-500/5 border border-slate-500/10 p-2.5 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Games Played</span>
                    <span className="block text-base font-black font-mono mt-0.5">{stats.gamesPlayed}</span>
                  </div>
                  <div className="bg-slate-500/5 border border-slate-500/10 p-2.5 rounded-xl">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Play Time</span>
                    <span className="block text-base font-black font-mono mt-0.5">{formatTime(stats.totalPlayTime)}</span>
                  </div>
                </div>
              </div>

              {/* Achievements Track */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Grandmaster Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})</span>
                </h3>
                <div className="space-y-2">
                  {achievements.map((a) => {
                    const isCompleted = a.unlocked;
                    const percentage = Math.min(100, Math.floor((a.progressCurrent / a.progressTarget) * 100));

                    return (
                      <div
                        key={a.id}
                        id={`hub-achievement-${a.id}`}
                        className={`p-2.5 border rounded-xl flex items-start gap-2.5 transition ${
                          isCompleted
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : isDarkTheme ? 'border-slate-800/60 bg-transparent' : 'border-slate-100 bg-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/5 text-slate-400'}`}>
                          {getAchievementIcon(a.icon)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-extrabold text-xs truncate">{a.title}</span>
                            <span className="text-[9px] font-black text-amber-500 flex items-center gap-0.5 flex-shrink-0">
                              <Coins className="w-2.5 h-2.5 fill-current" />
                              +{a.rewardCoins}
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400 leading-tight mb-1.5">
                            {a.description}
                          </p>

                          {/* Satisfying progress tracking */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-slate-500/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-[8px] font-black text-slate-400 font-mono flex-shrink-0">
                              {a.progressCurrent}/{a.progressTarget}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Goals */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <CalendarRange className="w-3.5 h-3.5 text-blue-500" />
                  <span>Daily Target Challenges</span>
                </h3>
                <div className="space-y-2">
                  {challenges.map((c) => {
                    const isCompleted = c.completed;
                    const percentage = Math.min(100, Math.floor((c.progress / c.targetValue) * 100));

                    return (
                      <div
                        key={c.id}
                        id={`hub-daily-${c.id}`}
                        className={`p-2.5 border rounded-xl flex items-center justify-between transition ${
                          isCompleted
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : isDarkTheme ? 'border-slate-800/60 bg-transparent' : 'border-slate-100 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 mr-3 min-w-0">
                          <div className="mt-0.5 flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`font-extrabold text-xs block truncate ${isCompleted ? 'text-slate-400 line-through' : ''}`}>
                              {c.title}
                            </span>
                            <p className="text-[9px] text-slate-400 leading-tight mb-1">{c.description}</p>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-slate-500/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-[8px] font-black text-slate-400 font-mono flex-shrink-0">{c.progress}/{c.targetValue}</span>
                            </div>
                          </div>
                        </div>

                        <span className="bg-amber-500/10 text-amber-500 font-black text-[8px] px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-0.5 uppercase flex-shrink-0">
                          <Coins className="w-2.5 h-2.5 fill-current" />
                          +{c.rewardCoins}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
