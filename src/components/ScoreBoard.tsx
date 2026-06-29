import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, Timer } from 'lucide-react';
import { GameTheme } from '../utils/gameData';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  moveCount: number;
  gameMode: string;
  timeRemaining: number;
  activeTheme: GameTheme;
}

interface FloatingPop {
  id: number;
  amount: number;
}

export default function ScoreBoard({
  score,
  bestScore,
  moveCount,
  gameMode,
  timeRemaining,
  activeTheme,
}: ScoreBoardProps) {
  const [scorePops, setScorePops] = useState<FloatingPop[]>([]);
  const prevScoreRef = useRef<number>(score);

  // Monitor score increases to spawn satisfying floating bubble indicators
  useEffect(() => {
    const prevScore = prevScoreRef.current;
    if (score > prevScore) {
      const diff = score - prevScore;
      const newPop: FloatingPop = {
        id: Date.now() + Math.random(),
        amount: diff,
      };
      setScorePops(prev => [...prev, newPop]);
    }
    prevScoreRef.current = score;
  }, [score]);

  const handlePopComplete = (id: number) => {
    setScorePops(prev => prev.filter(pop => pop.id !== id));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    return `${mins}:${rs.toString().padStart(2, '0')}`;
  };

  const isTimeAttack = gameMode === 'timeattack';

  return (
    <div id="scoreboard-root" className="grid grid-cols-3 gap-2.5 w-full max-w-md mx-auto mb-3 select-none">
      {/* Current Score Box */}
      <div
        id="score-box"
        className={`relative rounded-xl p-2 md:p-3 flex flex-col items-center justify-center transition-all duration-300 ${activeTheme.gridBgClass}`}
      >
        <div className="flex items-center gap-1 text-white/80 text-[10px] font-black tracking-wider uppercase">
          <Flame className="w-3 h-3 text-amber-400 animate-pulse fill-amber-400" />
          <span>Score</span>
        </div>
        <span
          id="score-value"
          className="text-lg md:text-xl font-black font-mono tracking-tight text-white mt-0.5"
        >
          {score}
        </span>

        {/* Floating Bubble Score Gains */}
        <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none z-30">
          <AnimatePresence>
            {scorePops.map(pop => (
              <motion.div
                key={pop.id}
                initial={{ opacity: 0, y: 15, scale: 0.6 }}
                animate={{ opacity: [0, 1, 1, 0], y: -50, scale: [0.6, 1.1, 1.1, 0.8] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                onAnimationComplete={() => handlePopComplete(pop.id)}
                className="absolute text-emerald-500 font-black font-mono text-xs md:text-sm bg-slate-900/90 border border-emerald-500 px-2 py-0.5 rounded-full shadow-lg"
              >
                +{pop.amount}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* High Score Box */}
      <div
        id="best-box"
        className={`rounded-xl p-2 md:p-3 flex flex-col items-center justify-center transition-all duration-300 ${activeTheme.gridBgClass}`}
      >
        <div className="flex items-center gap-1 text-white/80 text-[10px] font-black tracking-wider uppercase">
          <Trophy className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>Best</span>
        </div>
        <span
          id="best-value"
          className="text-lg md:text-xl font-black font-mono tracking-tight text-white mt-0.5"
        >
          {bestScore}
        </span>
      </div>

      {/* Mode Specific Dynamic Box: Moves or Time Clock */}
      <div
        id="moves-or-time-box"
        className={`rounded-xl p-2 md:p-3 flex flex-col items-center justify-center transition-all duration-300 ${
          isTimeAttack && timeRemaining <= 30
            ? 'bg-rose-950/40 border border-rose-500 animate-pulse'
            : activeTheme.gridBgClass
        }`}
      >
        {isTimeAttack ? (
          <>
            <div className="flex items-center gap-1 text-white/80 text-[10px] font-black tracking-wider uppercase">
              <Timer className={`w-3 h-3 ${timeRemaining <= 30 ? 'text-rose-500 animate-spin' : 'text-amber-400'}`} />
              <span className={timeRemaining <= 30 ? 'text-rose-400 font-bold' : ''}>Blitz</span>
            </div>
            <span
              id="time-value"
              className={`text-lg md:text-xl font-black font-mono tracking-tight mt-0.5 ${
                timeRemaining <= 30 ? 'text-rose-500' : 'text-white'
              }`}
            >
              {formatTime(timeRemaining)}
            </span>
          </>
        ) : (
          <>
            <span className="text-white/80 text-[10px] font-black tracking-wider uppercase">
              Moves
            </span>
            <span
              id="moves-value"
              className="text-lg md:text-xl font-black font-mono tracking-tight text-white mt-0.5"
            >
              {moveCount}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
