import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Tile as TileType } from '../types';
import Tile from './Tile';
import { RotateCcw, Play, CheckCircle2, Zap } from 'lucide-react';
import { GameTheme } from '../utils/gameData';

interface GameBoardProps {
  tiles: TileType[];
  gameOver: boolean;
  gameWon: boolean;
  hasContinued: boolean;
  move: (direction: 'up' | 'down' | 'left' | 'right') => void;
  restart: () => void;
  continueGame: () => void;
  score: number;
  activeTheme: GameTheme;
  activePowerup: 'bomb' | 'shuffle' | 'wildcard' | 'freeze' | 'double' | null;
  onTileClick: (tile: TileType) => void;
}

export default function GameBoard({
  tiles,
  gameOver,
  gameWon,
  hasContinued,
  move,
  restart,
  continueGame,
  score,
  activeTheme,
  activePowerup,
  onTileClick,
}: GameBoardProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const mouseStartRef = useRef<{ x: number; y: number } | null>(null);

  // Monitor keyboard inputs (arrows, WASD)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is typing in inputs or search, don't hijack keyboard
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      const code = e.code;
      const key = e.key.toLowerCase();
      
      const gameCodes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'];
      const gameKeys = ['w', 'a', 's', 'd'];
      
      if (gameCodes.includes(code) || gameKeys.includes(key)) {
        e.preventDefault(); // Lock default browser viewport scrolling
      }

      switch (key) {
        case 'arrowup':
        case 'w':
          move('up');
          break;
        case 'arrowdown':
        case 's':
          move('down');
          break;
        case 'arrowleft':
        case 'a':
          move('left');
          break;
        case 'arrowright':
        case 'd':
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Touch handlers for mobile swipe compatibility
  const handleTouchStart = (e: React.TouchEvent) => {
    if (activePowerup) return; // Disable swipe while using power-ups
    if (e.touches.length > 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const minSwipeDistance = 35;
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (Math.abs(dx) > minSwipeDistance) {
        move(dx > 0 ? 'right' : 'left');
      }
    } else {
      // Vertical swipe
      if (Math.abs(dy) > minSwipeDistance) {
        move(dy > 0 ? 'down' : 'up');
      }
    }
  };

  // Mouse drag gesture handlers for immersive desktop controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activePowerup) return; // Disable swipe while using power-ups
    if (e.button !== 0) return; // Allow left clicks only
    mouseStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseStartRef.current) return;
    
    const dx = e.clientX - mouseStartRef.current.x;
    const dy = e.clientY - mouseStartRef.current.y;
    mouseStartRef.current = null;

    const minSwipeDistance = 40;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipeDistance) {
        move(dx > 0 ? 'right' : 'left');
      }
    } else {
      if (Math.abs(dy) > minSwipeDistance) {
        move(dy > 0 ? 'down' : 'up');
      }
    }
  };

  const backgroundCells = Array.from({ length: 16 }, (_, i) => i);

  // Powerup cursor adjustments
  const hasActiveTargeting = activePowerup && ['bomb', 'wildcard', 'freeze'].includes(activePowerup);

  return (
    <div
      id="game-board-container"
      className={`relative w-full max-w-md aspect-square rounded-xl p-3 shadow-xl overflow-hidden touch-none select-none transition-all duration-300 ${
        activeTheme.gridBgClass
      } ${
        hasActiveTargeting
          ? 'cursor-crosshair ring-4 ring-offset-2 animate-[pulse_2s_infinite]'
          : 'cursor-grab active:cursor-grabbing'
      }`}
      style={{
        outlineColor: hasActiveTargeting ? activeTheme.accentColor : undefined
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* 4x4 Empty Grid Cells underneath */}
      <div id="grid-background" className="grid grid-cols-4 grid-rows-4 gap-3 w-full h-full">
        {backgroundCells.map(index => (
          <div
            key={index}
            id={`grid-cell-${index}`}
            className={`w-full h-full rounded-[6px] transition-colors duration-300 ${activeTheme.emptyCellClass}`}
          />
        ))}
      </div>

      {/* Floating Active Tiles */}
      <div 
        id="grid-tiles-layer" 
        className={`absolute inset-0 p-3 pointer-events-none ${
          hasActiveTargeting ? 'pointer-events-auto z-30' : ''
        }`}
      >
        <AnimatePresence>
          {tiles.map(tile => (
            <Tile
              key={tile.id}
              tile={tile}
              activeThemeId={activeTheme.id}
              hasActiveTargeting={hasActiveTargeting}
              onClick={() => {
                if (hasActiveTargeting) {
                  onTileClick(tile);
                }
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Target Active Banner Overlay */}
      {hasActiveTargeting && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full z-50 flex items-center gap-1 shadow-md border border-white/10 animate-bounce">
          <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>Click a Tile to Apply {activePowerup}</span>
        </div>
      )}

      {/* Victory Overlay Screen */}
      <AnimatePresence>
        {gameWon && !hasContinued && (
          <motion.div
            id="victory-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-50 rounded-xl"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 text-amber-500 shadow-md shadow-amber-500/10"
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>
            <h2 className="text-3xl font-black font-sans tracking-tight text-white uppercase drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              You Reached 2048!
            </h2>
            <p className="text-slate-300 mt-2 max-w-xs text-xs leading-relaxed">
              Incredible strategy! You assembled the legendary grid with a score of <strong className="font-mono text-amber-400">{score}</strong>. Join the grandmasters!
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 mt-6 w-full max-w-xs">
              <button
                id="btn-keep-playing"
                onClick={continueGame}
                className="flex items-center justify-center gap-1.5 flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-[6px] transition duration-150 active:scale-95 text-xs uppercase cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Keep Playing</span>
              </button>
              <button
                id="btn-victory-restart"
                onClick={restart}
                className="flex items-center justify-center gap-1.5 flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-[6px] transition duration-150 active:scale-95 text-xs uppercase cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Defeat Overlay Screen */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            id="defeat-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-50 rounded-xl"
          >
            <motion.div
              initial={{ rotate: -15, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4 text-rose-500 shadow-md shadow-rose-500/5"
            >
              <RotateCcw className="w-8 h-8" />
            </motion.div>
            <h2 className="text-3xl font-black font-sans tracking-tight text-white uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              Game Over!
            </h2>
            <p className="text-slate-300 mt-2 max-w-xs text-xs">
              No moves remaining. You finished with a final score of <strong className="font-mono text-rose-400">{score}</strong>. Try another round!
            </p>
            <button
              id="btn-defeat-restart"
              onClick={restart}
              className="flex items-center justify-center gap-1.5 mt-6 w-full max-w-xs bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-[6px] transition duration-150 active:scale-95 text-xs uppercase cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
