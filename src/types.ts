export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
  isMergedOut?: boolean;
  isBomb?: boolean;
  isWildcard?: boolean;
  isBlocked?: boolean; // Obstacles (rocks) in Survival mode
  isFrozen?: boolean;  // Frozen tile powerup
}

export type BoardGrid = (Tile | null)[][];

export type GameMode = 'classic' | 'zen' | 'timeattack' | 'survival';

export interface GameStats {
  highestScore: number;
  highestTile: number;
  gamesPlayed: number;
  totalMerges: number;
  totalCoinsEarned: number;
  powerupsUsed: number;
  totalMoves: number;
  totalPlayTime: number; // in seconds
  lastUpdated: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  unlocked: boolean;
  progressCurrent: number;
  progressTarget: number;
  icon: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  targetType: 'score' | 'tile' | 'merges' | 'moves';
  targetValue: number;
  rewardCoins: number;
  progress: number;
  completed: boolean;
}

export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  gameOver: boolean;
  gameWon: boolean;
  hasContinued: boolean; // True if player reached 2048 and chose to keep playing
  moveCount: number;
  coins: number;
  activePowerup: 'bomb' | 'shuffle' | 'wildcard' | 'freeze' | 'double' | null;
  doubleScoreMovesLeft: number;
  gameMode?: GameMode;
  timeRemaining?: number;
}

export interface GameHistory {
  tiles: Tile[];
  score: number;
  gameOver: boolean;
  gameWon: boolean;
  hasContinued: boolean;
  coins: number;
}
