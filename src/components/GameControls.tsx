import { RotateCcw, Undo2, Volume2, VolumeX, Music } from 'lucide-react';
import { GameTheme } from '../utils/gameData';

interface GameControlsProps {
  onRestart: () => void;
  onUndo: () => void;
  onToggleMute: () => void;
  onToggleMusic: () => void;
  isMuted: boolean;
  isMusicMuted: boolean;
  canUndo: boolean;
  historyLength: number;
  accentColor: string;
  activeTheme: GameTheme;
}

export default function GameControls({
  onRestart,
  onUndo,
  onToggleMute,
  onToggleMusic,
  isMuted,
  isMusicMuted,
  canUndo,
  historyLength,
  accentColor,
  activeTheme,
}: GameControlsProps) {
  const isDarkTheme = activeTheme.id === 'neon' || activeTheme.id === 'cyberpunk' || activeTheme.id === 'retro';

  // Dynamic style bindings to keep theme coordination pristine
  const buttonStyle = {
    borderColor: canUndo ? accentColor : `${accentColor}40`,
    color: canUndo ? accentColor : `${accentColor}40`,
  };

  const activeToggleStyle = {
    borderColor: accentColor,
    color: accentColor,
  };

  const restartBtnStyle = {
    backgroundColor: accentColor,
  };

  return (
    <div id="game-controls" className="w-full max-w-md mx-auto flex items-center justify-between gap-2.5 mt-4 select-none">
      {/* Undo Button */}
      <button
        id="btn-undo"
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase border-2 transition duration-150 active:scale-95 cursor-pointer bg-transparent`}
        style={buttonStyle}
        title="Undo last move"
      >
        <Undo2 className="w-3.5 h-3.5" />
        <span>Undo</span>
        {historyLength > 0 && (
          <span 
            className="ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-black font-mono"
            style={{ 
              backgroundColor: `${accentColor}15`, 
              color: accentColor 
            }}
          >
            {historyLength}
          </span>
        )}
      </button>

      {/* Mute/Volume Toggle Button */}
      <button
        id="btn-toggle-mute"
        onClick={onToggleMute}
        className="flex items-center justify-center p-2.5 rounded-xl border-2 bg-transparent transition duration-150 active:scale-95 cursor-pointer"
        style={activeToggleStyle}
        title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-rose-500" />
        ) : (
          <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse" />
        )}
      </button>

      {/* Music Toggle Button */}
      <button
        id="btn-toggle-music"
        onClick={onToggleMusic}
        className="flex items-center justify-center p-2.5 rounded-xl border-2 bg-transparent transition duration-150 active:scale-95 cursor-pointer"
        style={activeToggleStyle}
        title={isMusicMuted ? 'Unmute background music' : 'Mute background music'}
      >
        {isMusicMuted || isMuted ? (
          <Music className="w-4 h-4 text-rose-500 opacity-60" />
        ) : (
          <Music className="w-4 h-4 text-amber-500 animate-[bounce_2s_infinite]" />
        )}
      </button>

      {/* New Game Button */}
      <button
        id="btn-restart"
        onClick={onRestart}
        className="flex items-center justify-center gap-1.5 px-4 py-2.5 hover:opacity-90 text-white font-black rounded-xl text-xs uppercase transition duration-150 active:scale-95 cursor-pointer shadow-sm"
        style={restartBtnStyle}
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Restart</span>
      </button>
    </div>
  );
}
