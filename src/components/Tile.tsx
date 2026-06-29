import React from 'react';
import { motion } from 'motion/react';
import { Tile as TileType } from '../types';
import { Bomb, Snowflake, Sparkles } from 'lucide-react';

interface TileProps {
  tile: TileType;
  activeThemeId: string;
  onClick?: () => void;
  hasActiveTargeting?: boolean;
  key?: React.Key;
}

// Custom theme style generator for tiles
function getThemedTileStyles(value: number, themeId: string) {
  if (themeId === 'neon') {
    switch (value) {
      case 2: return { bg: 'bg-[#120723]/80 border border-fuchsia-500/40 shadow-[0_0_5px_rgba(217,70,239,0.3)]', text: 'text-fuchsia-400', sizeClass: 'text-2xl md:text-3xl font-extrabold' };
      case 4: return { bg: 'bg-[#190933]/80 border border-violet-500/40 shadow-[0_0_5px_rgba(139,92,246,0.3)]', text: 'text-violet-400', sizeClass: 'text-2xl md:text-3xl font-extrabold' };
      case 8: return { bg: 'bg-[#FF007F]/20 border border-[#FF007F] shadow-[0_0_10px_rgba(255,0,127,0.5)]', text: 'text-white font-extrabold', sizeClass: 'text-2xl md:text-3xl font-extrabold' };
      case 16: return { bg: 'bg-[#00F5D4]/20 border border-[#00F5D4] shadow-[0_0_10px_rgba(0,245,212,0.5)]', text: 'text-white font-extrabold', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 32: return { bg: 'bg-[#7B2CBF] border border-[#9D4EDD] shadow-[0_0_12px_rgba(157,78,221,0.6)]', text: 'text-white', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 64: return { bg: 'bg-[#FF5400] border border-[#FF6D00] shadow-[0_0_12px_rgba(255,109,0,0.6)]', text: 'text-white', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 128: return { bg: 'bg-[#F15BB5] border border-[#F15BB5] shadow-[0_0_15px_rgba(241,91,181,0.7)]', text: 'text-white', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 256: return { bg: 'bg-[#00BBF9] border border-[#00BBF9] shadow-[0_0_15px_rgba(0,187,249,0.7)]', text: 'text-white', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 512: return { bg: 'bg-[#00F5D4] border border-[#00F5D4] shadow-[0_0_18px_rgba(0,245,212,0.8)]', text: 'text-slate-950', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 1024: return { bg: 'bg-[#9B5DE5] border border-[#9B5DE5] shadow-[0_0_20px_rgba(155,93,229,0.8)]', text: 'text-white', sizeClass: 'text-lg md:text-xl font-bold' };
      case 2048: return { bg: 'bg-gradient-to-r from-fuchsia-500 to-violet-500 animate-pulse shadow-[0_0_25px_rgba(217,70,239,0.9)]', text: 'text-white font-black', sizeClass: 'text-lg md:text-xl font-black' };
      default: return { bg: 'bg-slate-900 border border-fuchsia-500', text: 'text-white', sizeClass: 'text-base md:text-lg font-bold' };
    }
  }

  if (themeId === 'cyberpunk') {
    switch (value) {
      case 2: return { bg: 'bg-cyan-950/40 border border-cyan-500/50', text: 'text-cyan-400 font-mono', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 4: return { bg: 'bg-yellow-950/40 border border-yellow-500/50', text: 'text-yellow-400 font-mono', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 8: return { bg: 'bg-[#E3005C]/20 border border-[#E3005C]', text: 'text-[#E3005C] font-mono font-bold', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 16: return { bg: 'bg-[#05F194]/20 border border-[#05F194]', text: 'text-[#05F194] font-mono font-bold', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 32: return { bg: 'bg-cyan-500 text-black', text: 'text-slate-950 font-bold', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 64: return { bg: 'bg-[#FF0055] text-white', text: 'text-white font-bold', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 128: return { bg: 'bg-yellow-400 text-black', text: 'text-black font-bold', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 256: return { bg: 'bg-[#7000FF] text-white border border-[#9E00FF]', text: 'text-white font-bold', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 512: return { bg: 'bg-emerald-500 text-slate-950', text: 'text-slate-950 font-bold', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 1024: return { bg: 'bg-fuchsia-500 text-white', text: 'text-white font-bold', sizeClass: 'text-lg md:text-xl font-bold' };
      case 2048: return { bg: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-cyan-500 animate-pulse', text: 'text-slate-950 font-black', sizeClass: 'text-lg md:text-xl font-black' };
      default: return { bg: 'bg-[#0B1528] border-2 border-cyan-400', text: 'text-cyan-400', sizeClass: 'text-base md:text-lg font-bold' };
    }
  }

  if (themeId === 'forest') {
    switch (value) {
      case 2: return { bg: 'bg-[#ADC178]/30', text: 'text-[#3E4A21]', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 4: return { bg: 'bg-[#ADC178]/50', text: 'text-[#3E4A21]', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 8: return { bg: 'bg-[#6C584C]/80', text: 'text-[#F5ebe0]', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 16: return { bg: 'bg-[#DDA15E]', text: 'text-white', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 32: return { bg: 'bg-[#BC6C25]', text: 'text-white', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 64: return { bg: 'bg-[#31572C]', text: 'text-[#F5EBE0]', sizeClass: 'text-2xl md:text-3xl font-bold' };
      case 128: return { bg: 'bg-[#4F772D]', text: 'text-[#F5EBE0]', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 256: return { bg: 'bg-[#90A955]', text: 'text-white', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 512: return { bg: 'bg-[#ECF39E]', text: 'text-[#31572C]', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 1024: return { bg: 'bg-[#132A13]', text: 'text-white', sizeClass: 'text-lg md:text-xl font-bold' };
      case 2048: return { bg: 'bg-gradient-to-b from-[#132A13] to-[#4F772D] animate-bounce', text: 'text-[#ECF39E] font-black', sizeClass: 'text-lg md:text-xl font-bold' };
      default: return { bg: 'bg-[#3E4A21]', text: 'text-[#ECF39E]', sizeClass: 'text-base md:text-lg font-bold' };
    }
  }

  if (themeId === 'retro') {
    const commonClass = 'border-2 border-[#4AF626] bg-black text-[#4AF626] font-mono';
    switch (value) {
      case 2: return { bg: 'bg-black border border-[#4AF626]/40', text: 'text-[#4AF626]/70', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 4: return { bg: 'bg-black border border-[#4AF626]/70', text: 'text-[#4AF626]/90', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 8: return { bg: 'bg-black border-2 border-[#4AF626]', text: 'text-[#4AF626]', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 16: return { bg: 'bg-black border-2 border-dotted border-[#4AF626]', text: 'text-[#4AF626]', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 32: return { bg: 'bg-[#4AF626]/10 border-2 border-[#4AF626]', text: 'text-[#4AF626]', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 64: return { bg: 'bg-[#4AF626]/20 border-2 border-[#4AF626]', text: 'text-black bg-[#4AF626]', sizeClass: 'text-xl md:text-2xl font-bold' };
      case 128: return { bg: 'bg-black border-4 border-[#4AF626]', text: 'text-[#4AF626]', sizeClass: 'text-lg md:text-xl font-bold' };
      case 256: return { bg: 'bg-[#4AF626]/40 border-2 border-dashed border-[#4AF626]', text: 'text-[#4AF626]', sizeClass: 'text-lg md:text-xl font-bold' };
      case 512: return { bg: 'bg-black border-double border-4 border-[#4AF626]', text: 'text-[#4AF626]', sizeClass: 'text-lg md:text-xl font-bold' };
      case 1024: return { bg: 'bg-[#4AF626] text-black border-4 border-black', text: 'text-black', sizeClass: 'text-md md:text-lg font-bold' };
      case 2048: return { bg: 'bg-[#4AF626] text-black border-4 border-[#4AF626] animate-pulse', text: 'text-black', sizeClass: 'text-md md:text-lg font-black' };
      default: return { bg: commonClass, text: 'text-[#4AF626]', sizeClass: 'text-sm md:text-base font-bold' };
    }
  }

  // Fallback to Classic styles
  switch (value) {
    case 2:
      return {
        bg: 'bg-[#EEE4DA]',
        text: 'text-[#776E65]',
        shadow: 'shadow-sm',
        sizeClass: 'text-2xl md:text-3xl font-bold',
      };
    case 4:
      return {
        bg: 'bg-[#EDE0C8]',
        text: 'text-[#776E65]',
        shadow: 'shadow-sm',
        sizeClass: 'text-2xl md:text-3xl font-bold',
      };
    case 8:
      return {
        bg: 'bg-[#F2B179]',
        text: 'text-[#F9F6F2]',
        shadow: 'shadow-md',
        sizeClass: 'text-2xl md:text-3xl font-bold',
      };
    case 16:
      return {
        bg: 'bg-[#F59563]',
        text: 'text-[#F9F6F2]',
        shadow: 'shadow-md',
        sizeClass: 'text-2xl md:text-3xl font-bold',
      };
    case 32:
      return {
        bg: 'bg-[#F67C5F]',
        text: 'text-[#F9F6F2]',
        shadow: 'shadow-md',
        sizeClass: 'text-2xl md:text-3xl font-bold',
      };
    case 64:
      return {
        bg: 'bg-[#F65E3B]',
        text: 'text-[#F9F6F2]',
        shadow: 'shadow-md',
        sizeClass: 'text-2xl md:text-3xl font-bold',
      };
    case 128:
      return {
        bg: 'bg-[#EDCF72]',
        text: 'text-[#F9F6F2]',
        shadow: 'shadow-lg',
        sizeClass: 'text-xl md:text-2xl font-bold',
      };
    case 256:
      return {
        bg: 'bg-[#EDCC61]',
        text: 'text-[#F9F6F2]',
        shadow: 'shadow-lg',
        sizeClass: 'text-xl md:text-2xl font-bold',
      };
    case 512:
      return {
        bg: 'bg-[#EDC850]',
        text: 'text-[#F9F6F2]',
        shadow: 'shadow-xl',
        sizeClass: 'text-xl md:text-2xl font-bold',
      };
    case 1024:
      return {
        bg: 'bg-[#EDC53F]',
        text: 'text-[#F9F6F2]',
        shadow: 'shadow-xl',
        sizeClass: 'text-lg md:text-xl font-bold',
      };
    case 2048:
      return {
        bg: 'bg-[#EDC22E] animate-pulse',
        text: 'text-[#F9F6F2]',
        shadow: 'shadow-2xl shadow-[0_0_20px_2px_rgba(237,194,46,0.5)]',
        sizeClass: 'text-lg md:text-xl font-bold',
      };
    default:
      return {
        bg: 'bg-[#1E293B]',
        text: 'text-[#F9F6F2]',
        shadow: 'shadow-2xl',
        sizeClass: 'text-base md:text-lg font-bold',
      };
  }
}

export default function Tile({ tile, activeThemeId, onClick, hasActiveTargeting = false }: TileProps) {
  const { bg, text, shadow = 'shadow-md', sizeClass } = getThemedTileStyles(tile.value, activeThemeId);

  // Custom visual overlay states
  const isObstacle = tile.isBlocked;
  const isWildcard = tile.isWildcard;
  const isFrozen = tile.isFrozen;

  // Set up animations using explicit translation percentages for guaranteed responsive alignment
  const initial = tile.isNew ? { scale: 0, opacity: 0 } : false;
  
  const animate = {
    x: `${tile.col * 100}%`,
    y: `${tile.row * 100}%`,
    scale: tile.isMergedOut ? 0 : tile.isMerged ? [0.8, 1.15, 1] : 1,
    opacity: tile.isMergedOut ? 0 : 1,
  };

  const transition = tile.isMergedOut
    ? { duration: 0.12, ease: 'easeIn' }
    : tile.isNew
    ? { type: 'spring', stiffness: 240, damping: 18 }
    : tile.isMerged
    ? { duration: 0.22, ease: 'easeOut' }
    : { type: 'spring', stiffness: 350, damping: 28 };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={`absolute w-1/4 h-1/4 p-1.5 md:p-2 select-none top-0 left-0 ${
        tile.isMergedOut ? 'z-0 pointer-events-none' : 'z-10'
      } ${
        hasActiveTargeting
          ? 'pointer-events-auto cursor-pointer active:scale-95 transition-transform z-40'
          : 'pointer-events-none'
      }`}
      id={`tile-container-${tile.id}`}
      onClick={onClick}
    >
      <div
        id={`tile-inner-${tile.id}`}
        className={`w-full h-full rounded-md md:rounded-[6px] flex flex-col items-center justify-center relative overflow-hidden transition-all ${
          isObstacle
            ? 'bg-slate-700 border-2 border-slate-900 text-slate-100 shadow-md font-mono'
            : isWildcard
            ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-[pulse_1.5s_infinite] text-white border border-white/50 shadow-lg'
            : bg
        } ${shadow} font-sans`}
      >
        {/* Ice Overlay */}
        {isFrozen && (
          <div className="absolute inset-0 bg-cyan-200/40 border-2 border-cyan-400 rounded-sm flex items-start justify-end p-1 z-20">
            <Snowflake className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          </div>
        )}

        {/* Bomb Overlays */}
        {tile.isBomb && (
          <div className="absolute inset-0 bg-rose-500/10 border-2 border-rose-500 rounded-sm flex items-center justify-center z-20 animate-[ping_1.5s_infinite]">
            <Bomb className="w-6 h-6 text-rose-500" />
          </div>
        )}

        {/* Content Render */}
        {isObstacle ? (
          <div className="text-center">
            <span className="text-[10px] font-black tracking-wider text-slate-300 block leading-none">ROCK</span>
            <span className="text-[8px] font-bold text-slate-400 block mt-0.5">BLOCK</span>
          </div>
        ) : isWildcard ? (
          <div className="flex flex-col items-center justify-center">
            <Sparkles className="w-5 h-5 text-white animate-spin" />
            <span className="text-[9px] font-black text-white mt-0.5">WILD</span>
          </div>
        ) : (
          <span
            id={`tile-text-${tile.id}`}
            className={`font-sans tracking-tight font-black select-none ${text} ${sizeClass}`}
          >
            {tile.value}
          </span>
        )}
      </div>
    </motion.div>
  );
}
