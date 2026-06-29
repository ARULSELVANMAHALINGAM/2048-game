import { Achievement, DailyChallenge } from '../types';

export interface GameTheme {
  id: string;
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  bgClass: string;
  containerClass: string;
  gridBgClass: string;
  emptyCellClass: string;
  textMutedClass: string;
  titleColor: string;
  badgeClass: string;
  accentColor: string;
}

export const GAME_THEMES: GameTheme[] = [
  {
    id: 'classic',
    name: 'Classic Clay',
    description: 'The elegant retro clay beige theme with natural tones.',
    price: 0,
    unlocked: true,
    bgClass: 'bg-[#F8FAFC]',
    containerClass: 'text-[#1E293B]',
    gridBgClass: 'bg-[#BBADA0]',
    emptyCellClass: 'bg-[rgba(238,228,218,0.35)]',
    textMutedClass: 'text-[#64748B]',
    titleColor: 'text-[#776E65]',
    badgeClass: 'bg-[#8F7A66] text-white',
    accentColor: '#8F7A66',
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Sizzling hot pinks, fluorescent greens, and deep cyber blues.',
    price: 150,
    unlocked: false,
    bgClass: 'bg-[#0F0C1B]',
    containerClass: 'text-[#E0E7FF]',
    gridBgClass: 'bg-[#1E1135] border-2 border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.2)]',
    emptyCellClass: 'bg-[#120723]/60 border border-fuchsia-950/40',
    textMutedClass: 'text-fuchsia-400',
    titleColor: 'text-fuchsia-500 font-extrabold tracking-widest uppercase drop-shadow-[0_0_8px_rgba(217,70,239,0.6)]',
    badgeClass: 'bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]',
    accentColor: '#D946EF',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    description: 'Synthwave yellow, laser cyan, and holographic wireframes.',
    price: 250,
    unlocked: false,
    bgClass: 'bg-[#020617]',
    containerClass: 'text-cyan-100',
    gridBgClass: 'bg-[#0B1528] border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.35)]',
    emptyCellClass: 'bg-[#030712] border border-cyan-950',
    textMutedClass: 'text-cyan-400 font-mono',
    titleColor: 'text-yellow-400 uppercase drop-shadow-[0_2px_4px_rgba(234,179,8,0.5)] font-black italic',
    badgeClass: 'bg-cyan-500 text-slate-950 font-black tracking-wider uppercase',
    accentColor: '#06B6D4',
  },
  {
    id: 'forest',
    name: 'Forest Oak',
    description: 'Earthy emerald greens, soft moss, and rich wooden textures.',
    price: 100,
    unlocked: false,
    bgClass: 'bg-[#F2F4F3]',
    containerClass: 'text-[#1B3B2B]',
    gridBgClass: 'bg-[#40513B]',
    emptyCellClass: 'bg-[#606C38]/20',
    textMutedClass: 'text-[#4F772D]',
    titleColor: 'text-[#31572C]',
    badgeClass: 'bg-[#4F772D] text-white',
    accentColor: '#31572C',
  },
  {
    id: 'retro',
    name: '8-Bit Monocrome',
    description: 'The green phosphor look of retro arcade terminals.',
    price: 200,
    unlocked: false,
    bgClass: 'bg-[#050B05]',
    containerClass: 'text-[#4AF626]',
    gridBgClass: 'bg-[#0D1B0D] border-2 border-[#4AF626]/50',
    emptyCellClass: 'bg-[#030603] border border-[#4AF626]/20',
    textMutedClass: 'text-[#4AF626]/70 font-mono',
    titleColor: 'text-[#4AF626] font-mono tracking-tighter blink',
    badgeClass: 'bg-[#4AF626] text-black font-mono font-bold',
    accentColor: '#4AF626',
  }
];

export const INITIAL_ACHIEVEMENTS = (): Achievement[] => [
  {
    id: 'first_merge',
    title: 'First Fusion',
    description: 'Merge two tiles together to create a higher value tile.',
    rewardCoins: 10,
    unlocked: false,
    progressCurrent: 0,
    progressTarget: 1,
    icon: 'Sparkles',
  },
  {
    id: 'reach_512',
    title: 'Tactical Mind',
    description: 'Unlock a 512 tile on your board.',
    rewardCoins: 25,
    unlocked: false,
    progressCurrent: 0,
    progressTarget: 512,
    icon: 'Trophy',
  },
  {
    id: 'reach_1024',
    title: 'Grand Champion',
    description: 'Unlock a 1024 tile on your board.',
    rewardCoins: 50,
    unlocked: false,
    progressCurrent: 0,
    progressTarget: 1024,
    icon: 'Medal',
  },
  {
    id: 'reach_2048',
    title: 'The Singularity',
    description: 'Assemble the mythic 2048 tile!',
    rewardCoins: 150,
    unlocked: false,
    progressCurrent: 0,
    progressTarget: 2048,
    icon: 'Zap',
  },
  {
    id: 'buy_theme',
    title: 'Art Collector',
    description: 'Unlock a premium theme in the shop.',
    rewardCoins: 30,
    unlocked: false,
    progressCurrent: 0,
    progressTarget: 1,
    icon: 'Palette',
  },
  {
    id: 'rich_gamer',
    title: 'Coin Tycoon',
    description: 'Earn a total of 500 game coins.',
    rewardCoins: 100,
    unlocked: false,
    progressCurrent: 0,
    progressTarget: 500,
    icon: 'Coins',
  },
  {
    id: 'survival_master',
    title: 'Obstacle Conqueror',
    description: 'Reach score 5,000 in Survival mode with obstacles.',
    rewardCoins: 75,
    unlocked: false,
    progressCurrent: 0,
    progressTarget: 5000,
    icon: 'ShieldAlert',
  }
];

export const GET_DAILY_CHALLENGES = (dateString: string): DailyChallenge[] => {
  // Use dates to seed challenges or generate deterministic daily tasks
  const days = new Date(dateString).getDate() || 1;

  return [
    {
      id: 'daily_score',
      title: 'High Score Goal',
      description: `Score ${3000 + (days % 5) * 500} points today.`,
      targetType: 'score',
      targetValue: 3000 + (days % 5) * 500,
      rewardCoins: 25,
      progress: 0,
      completed: false,
    },
    {
      id: 'daily_tile',
      title: 'Target Tile Challenge',
      description: `Unlock a ${512 + (days % 2) * 512} tile today.`,
      targetType: 'tile',
      targetValue: 512 + (days % 2) * 512,
      rewardCoins: 40,
      progress: 0,
      completed: false,
    },
    {
      id: 'daily_moves',
      title: 'Efficiency Goal',
      description: `Complete ${100 + (days % 4) * 50} total moves.`,
      targetType: 'moves',
      targetValue: 100 + (days % 4) * 50,
      rewardCoins: 15,
      progress: 0,
      completed: false,
    }
  ];
};
