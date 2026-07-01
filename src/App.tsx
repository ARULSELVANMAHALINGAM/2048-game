import React from 'react';
import { motion } from 'motion/react';
import { use2048 } from './hooks/use2048';
import ScoreBoard from './components/ScoreBoard';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import ModeSelector from './components/ModeSelector';
import GameHub from './components/GameHub';
import { HelpCircle, Sparkles, Coins, Zap } from 'lucide-react';

export default function App() {
  const {
    tiles,
    score,
    bestScore,
    gameOver,
    gameWon,
    hasContinued,
    isMuted,
    isMusicMuted,
    history,
    moveCount,
    coins,
    gameMode,
    activePowerup,
    doubleScoreMovesLeft,
    timeRemaining,
    stats,
    achievements,
    dailyChallenges,
    activeTheme,
    themes,
    move,
    restart,
    restartGame,
    undo,
    continueGame,
    toggleMute,
    toggleMusicMute,
    selectTheme,
    unlockTheme,
    selectPowerup,
    onTileClick,
  } = use2048();

  return (
    <div
      id="app-container"
      className={`min-h-screen text-[#1E293B] flex flex-col items-center justify-between p-3 md:p-6 transition-colors duration-500 relative overflow-x-hidden ${activeTheme.bgClass}`}
    >
      {/* Background visual atmosphere glows */}
      <div id="bg-glow-1" className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full bg-slate-200/20 blur-3xl pointer-events-none" />
      <div id="bg-glow-2" className="absolute -bottom-[10%] -right-[10%] w-[45%] h-[45%] rounded-full bg-slate-300/10 blur-3xl pointer-events-none" />

      {/* Main Container Wrapper */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between z-10 relative">
        
        {/* Top Header Section */}
        <header id="game-header" className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 select-none pb-3 border-b border-slate-200/50">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <img src="/logo.png" alt="2048 Game Logo" className="w-12 h-12 rounded-xl shadow-md border border-slate-200/20" />
            <div className="text-left">
              <h1
                id="app-title"
                className={`text-4xl md:text-5xl font-black tracking-tighter leading-none select-none ${activeTheme.titleColor}`}
              >
                2048
              </h1>
              <p className="text-[#94A3B8] text-[10px] font-bold tracking-widest uppercase mt-1">
                GRANDMASTER PREMIUM EDITION
              </p>
            </div>
          </div>

          {/* User Coin Balance HUD */}
          <div 
            id="coin-hud" 
            className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full shadow-sm"
          >
            <Coins className="w-4 h-4 text-amber-500 animate-[bounce_3s_infinite]" />
            <span className="text-xs font-black text-amber-600 font-mono">{coins}</span>
            <span className="text-[9px] font-extrabold text-[#94A3B8] uppercase">COINS</span>
          </div>
        </header>

        {/* Responsive Balanced Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-auto py-2">
          
          {/* COLUMN 1: Mode Selector (Left on PC) */}
          <div className="lg:col-span-3 w-full">
            <ModeSelector
              activeMode={gameMode}
              onSelectMode={(m) => restartGame(m)}
              accentColor={activeTheme.accentColor}
              activeTheme={activeTheme}
            />
          </div>

          {/* COLUMN 2: The Core Board Game Area (Center on PC) */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="w-full max-w-md">
              {/* Score HUD row */}
              <ScoreBoard 
                score={score} 
                bestScore={bestScore} 
                moveCount={moveCount} 
                gameMode={gameMode}
                timeRemaining={timeRemaining}
                activeTheme={activeTheme}
              />

              {/* Time Attack Countdown Progress Bar */}
              {gameMode === 'timeattack' && (
                <div id="timeattack-bar-wrapper" className="w-full max-w-md mx-auto mb-3 px-1 select-none">
                  <div className="flex justify-between items-center mb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                      <span className={timeRemaining <= 30 ? 'text-rose-400 font-bold' : ''}>Time Blitz Running</span>
                    </span>
                    <span className={timeRemaining <= 30 ? 'text-rose-500 font-bold animate-pulse' : 'text-slate-500'}>
                      {timeRemaining}s remaining
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-[1px] border border-slate-300/30">
                    <motion.div
                      id="timeattack-bar-progress"
                      className={`h-full rounded-full ${
                        timeRemaining <= 30 
                          ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                          : 'bg-gradient-to-r from-amber-400 to-amber-500'
                      }`}
                      initial={{ width: '100%' }}
                      animate={{ width: `${Math.max(0, Math.min(100, (timeRemaining / 120) * 100))}%` }}
                      transition={{ duration: 0.3, ease: 'linear' }}
                    />
                  </div>
                </div>
              )}

              {/* Interactive Stage grid */}
              <GameBoard
                tiles={tiles}
                gameOver={gameOver}
                gameWon={gameWon}
                hasContinued={hasContinued}
                move={move}
                restart={() => restart()}
                continueGame={continueGame}
                score={score}
                activeTheme={activeTheme}
                activePowerup={activePowerup}
                onTileClick={onTileClick}
              />

              {/* Interactive bottom console (Undo, Reset, volume) */}
              <GameControls
                onRestart={() => restart()}
                onUndo={undo}
                onToggleMute={toggleMute}
                onToggleMusic={toggleMusicMute}
                isMuted={isMuted}
                isMusicMuted={isMusicMuted}
                canUndo={history.length > 0 && (gameMode === 'zen' || coins >= 10)}
                historyLength={history.length}
                accentColor={activeTheme.accentColor}
                activeTheme={activeTheme}
              />
            </div>
          </div>

          {/* COLUMN 3: Unified Grandmaster Hub (Right on PC) */}
          <div className="lg:col-span-4 w-full">
            <GameHub
              coins={coins}
              accentColor={activeTheme.accentColor}
              activeTheme={activeTheme}
              themes={themes}
              activeThemeId={activeTheme.id}
              onSelectTheme={selectTheme}
              onUnlockTheme={unlockTheme}
              activePowerup={activePowerup}
              doubleMovesLeft={doubleScoreMovesLeft}
              onSelectPowerup={selectPowerup}
              stats={stats}
              achievements={achievements}
              challenges={dailyChallenges}
            />
          </div>

        </div>

        {/* Instruction Footer row */}
        <footer id="game-footer" className="w-full max-w-4xl mx-auto text-center mt-6 select-none border-t border-slate-200/50 pt-4">
          <div
            id="instructions-panel"
            className={`border rounded-2xl p-4 text-left flex gap-3 text-[11px] shadow-sm backdrop-blur-sm max-w-xl mx-auto ${
              activeTheme.id === 'neon' || activeTheme.id === 'cyberpunk' || activeTheme.id === 'retro'
                ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                : 'bg-white/90 border-slate-200/80 text-slate-600'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <HelpCircle className="w-4 h-4" style={{ color: activeTheme.accentColor }} />
            </div>
            <div>
              <h3 className={`font-black uppercase tracking-wider flex items-center gap-1 ${
                activeTheme.id === 'neon' || activeTheme.id === 'cyberpunk' || activeTheme.id === 'retro' ? 'text-white' : 'text-slate-800'
              }`}>
                <span>Quick Playbook</span>
              </h3>
              <p className="mt-1 leading-relaxed">
                Slide matching numbers together with your <strong className="font-bold">Arrow keys / WASD</strong> on desktop or <strong className="font-bold">Swipes</strong> on mobile.
              </p>
              <p className="mt-1 leading-relaxed">
                Use tactical powerups in the <strong className="font-bold">Grandmaster Hub</strong> to survive blockades, double score gains, or blow up blocking cells! Earn bonus coins on every merge.
              </p>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 mt-4 tracking-wider font-mono uppercase">
            © 2026 • Premium Edition • Developed by arulselvanmahalingam
          </p>
        </footer>

      </div>
    </div>
  );
}
