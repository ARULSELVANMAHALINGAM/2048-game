import { useState, useEffect, useCallback, useRef } from 'react';
import { Tile, GameHistory, GameState, GameMode, GameStats, Achievement, DailyChallenge } from '../types';
import { gameAudio } from '../utils/audio';
import { GAME_THEMES, INITIAL_ACHIEVEMENTS, GET_DAILY_CHALLENGES } from '../utils/gameData';

const STORAGE_KEY_V2 = 'game2048_state_v2';
const BEST_SCORE_KEY = 'game2048_best';
const MUTED_KEY = 'game2048_muted';
const STATS_KEY = 'game2048_player_stats';
const ACHIEVEMENTS_KEY = 'game2048_achievements';
const CHALLENGES_KEY = 'game2048_challenges';
const ACTIVE_THEME_KEY = 'game2048_active_theme';
const THEMES_UNLOCKED_KEY = 'game2048_themes_unlocked';

function checkGameOver(tiles: Tile[]): boolean {
  const activeTiles = tiles.filter(t => !t.isMergedOut);
  // Blocked obstacles also occupy cells, so we filter them in or out depending on count
  if (activeTiles.length < 16) return false;
  
  // Create 4x4 grid representation
  const grid: number[][] = Array(4).fill(null).map(() => Array(4).fill(0));
  const tileMap: { [key: string]: Tile } = {};
  
  activeTiles.forEach(tile => {
    grid[tile.row][tile.col] = tile.value || -1; // -1 represents a static obstacle block
    tileMap[`${tile.row},${tile.col}`] = tile;
  });
  
  // Check adjacent cells for merges
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = grid[r][c];
      if (val === -1) continue; // Obstacles cannot merge

      const currentTile = tileMap[`${r},${c}`];
      
      // Check right
      if (c < 3) {
        const rightVal = grid[r][c + 1];
        const rightTile = tileMap[`${r},${c + 1}`];
        if (rightVal !== -1 && (rightVal === val || (currentTile?.isWildcard || rightTile?.isWildcard))) {
          return false;
        }
      }
      // Check down
      if (r < 3) {
        const downVal = grid[r + 1][c];
        const downTile = tileMap[`${r + 1},${c}`];
        if (downVal !== -1 && (downVal === val || (currentTile?.isWildcard || downTile?.isWildcard))) {
          return false;
        }
      }
    }
  }
  
  return true;
}

function checkGameWon(tiles: Tile[]): boolean {
  return tiles.some(t => !t.isMergedOut && !t.isBlocked && t.value === 2048);
}

function getMovePositions(tile: Tile, vector: { r: number; c: number }, grid: (Tile | null)[][]) {
  let prev = { r: tile.row, c: tile.col };
  let curr = { r: tile.row + vector.r, c: tile.col + vector.c };
  
  while (curr.r >= 0 && curr.r < 4 && curr.c >= 0 && curr.c < 4 && !grid[curr.r][curr.c]) {
    prev = { r: curr.r, c: curr.c };
    curr = { r: curr.r + vector.r, c: curr.c + vector.c };
  }
  
  return {
    farthest: prev,
    next: (curr.r >= 0 && curr.r < 4 && curr.c >= 0 && curr.c < 4) ? curr : null
  };
}

function createRandomTile(tiles: Tile[], forceValue?: number): Tile {
  const occupied = new Set(tiles.filter(t => !t.isMergedOut).map(t => `${t.row},${t.col}`));
  const empty: { r: number; c: number }[] = [];
  
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!occupied.has(`${r},${c}`)) {
        empty.push({ r, c });
      }
    }
  }
  
  if (empty.length === 0) {
    throw new Error('No empty cells available to spawn a tile');
  }
  
  const randomCell = empty[Math.floor(Math.random() * empty.length)];
  const value = forceValue !== undefined ? forceValue : (Math.random() < 0.9 ? 2 : 4);
  const tileIdCounter = Math.max(0, ...tiles.map(t => t.id)) + 1;
  
  return {
    id: tileIdCounter,
    value,
    row: randomCell.r,
    col: randomCell.c,
    isNew: true
  };
}

export function use2048() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [hasContinued, setHasContinued] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(gameAudio.getMusicMuteStatus());
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [moveCount, setMoveCount] = useState<number>(0);

  // Premium Features state
  const [coins, setCoins] = useState<number>(100); // Initial welcome coins
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [activePowerup, setActivePowerup] = useState<'bomb' | 'shuffle' | 'wildcard' | 'freeze' | 'double' | null>(null);
  const [doubleScoreMovesLeft, setDoubleScoreMovesLeft] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(120); // 120 seconds for Time Attack

  const timeRemainingRef = useRef<number>(timeRemaining);
  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  // Dashboard state
  const [activeThemeId, setActiveThemeId] = useState<string>('classic');
  const [themes, setThemes] = useState<any[]>(GAME_THEMES);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS());
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(GET_DAILY_CHALLENGES(new Date().toDateString()));
  const [stats, setStats] = useState<GameStats>({
    highestScore: 0,
    highestTile: 2,
    gamesPlayed: 0,
    totalMerges: 0,
    totalCoinsEarned: 100,
    powerupsUsed: 0,
    totalMoves: 0,
    totalPlayTime: 0,
    lastUpdated: new Date().toDateString(),
  });

  const isTransitioningRef = useRef<boolean>(false);

  // Time tracking effect
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalPlayTime: prev.totalPlayTime + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time Attack Countdown Timer
  useEffect(() => {
    if (gameMode !== 'timeattack' || gameOver) return;
    
    if (timeRemaining <= 0) {
      setGameOver(true);
      gameAudio.playGameOver();
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameMode, timeRemaining, gameOver]);

  // Audio Auto-play background music setup
  useEffect(() => {
    const handleFirstInteraction = () => {
      gameAudio.startMusicLoop();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Save State and Stats helper
  const saveGameState = useCallback((
    currentTiles: Tile[],
    currentScore: number,
    currentBest: number,
    isOver: boolean,
    isWon: boolean,
    continued: boolean,
    moves: number,
    currentCoins: number,
    mode: GameMode,
    activePw: 'bomb' | 'shuffle' | 'wildcard' | 'freeze' | 'double' | null,
    doubleLeft: number
  ) => {
    try {
      const state: GameState = {
        tiles: currentTiles,
        score: currentScore,
        bestScore: currentBest,
        gameOver: isOver,
        gameWon: isWon,
        hasContinued: continued,
        moveCount: moves,
        coins: currentCoins,
        activePowerup: activePw,
        doubleScoreMovesLeft: doubleLeft,
        gameMode: mode,
        timeRemaining: mode === 'timeattack' ? timeRemainingRef.current : undefined
      };
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
    } catch (_) {}
  }, []);

  // Initialize/Load State on mount
  useEffect(() => {
    try {
      // Load best score
      const savedBest = localStorage.getItem(BEST_SCORE_KEY);
      if (savedBest) setBestScore(parseInt(savedBest, 10));

      // Load sound mute setting
      const savedMute = localStorage.getItem(MUTED_KEY);
      if (savedMute) {
        const parsedMuted = JSON.parse(savedMute);
        setIsMuted(parsedMuted);
        gameAudio.setMuted(parsedMuted);
      }

      // Load Stats
      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) setStats(JSON.parse(savedStats));

      // Load Achievements
      const savedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

      // Load Daily Goals
      const savedChallenges = localStorage.getItem(CHALLENGES_KEY);
      if (savedChallenges) setDailyChallenges(JSON.parse(savedChallenges));

      // Load Active Theme
      const savedTheme = localStorage.getItem(ACTIVE_THEME_KEY);
      if (savedTheme) setActiveThemeId(savedTheme);

      // Load Unlocked Themes
      const savedUnlocked = localStorage.getItem(THEMES_UNLOCKED_KEY);
      if (savedUnlocked) {
        const list = JSON.parse(savedUnlocked);
        setThemes(prev => prev.map(t => list.includes(t.id) ? { ...t, unlocked: true } : t));
      }

      // Load core game state
      const savedState = localStorage.getItem(STORAGE_KEY_V2);
      if (savedState) {
        const state: GameState = JSON.parse(savedState);
        
        // Self-healing: Deduplicate tiles by id to fix any historically corrupted states
        const uniqueTilesMap: { [key: number]: Tile } = {};
        if (Array.isArray(state.tiles)) {
          state.tiles.forEach(t => {
            if (t && typeof t.id === 'number') {
              uniqueTilesMap[t.id] = t;
            }
          });
        }
        
        setTiles(Object.values(uniqueTilesMap));
        setScore(state.score);
        setGameOver(state.gameOver);
        setGameWon(state.gameWon);
        setHasContinued(state.hasContinued);
        setMoveCount(state.moveCount || 0);
        setCoins(state.coins !== undefined ? state.coins : 100);
        setActivePowerup(state.activePowerup || null);
        setDoubleScoreMovesLeft(state.doubleScoreMovesLeft || 0);
        if (state.gameMode) {
          setGameMode(state.gameMode);
        }
        if (state.timeRemaining !== undefined) {
          setTimeRemaining(state.timeRemaining);
        }
        return;
      }
    } catch (_) {}

    // Fallback: Fresh Start
    restartGame('classic', true);
  }, []);

  // Save Stats & Achievements on change
  useEffect(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
      localStorage.setItem(CHALLENGES_KEY, JSON.stringify(dailyChallenges));
    } catch (_) {}
  }, [stats, achievements, dailyChallenges]);

  // Restart trigger
  const restartGame = useCallback((mode: GameMode = 'classic', preventSave = false) => {
    setGameMode(mode);
    setTimeRemaining(120);
    setActivePowerup(null);
    setDoubleScoreMovesLeft(0);

    let initialTiles: Tile[] = [];

    if (mode === 'survival') {
      // Spawn standard items AND 2 permanent stone rocks (blocked cells)
      const r1 = Math.floor(Math.random() * 4);
      const c1 = Math.floor(Math.random() * 4);
      let r2 = Math.floor(Math.random() * 4);
      let c2 = Math.floor(Math.random() * 4);
      while (r1 === r2 && c1 === c2) {
        r2 = Math.floor(Math.random() * 4);
        c2 = Math.floor(Math.random() * 4);
      }

      const block1: Tile = { id: -1, value: 0, row: r1, col: c1, isBlocked: true };
      const block2: Tile = { id: -2, value: 0, row: r2, col: c2, isBlocked: true };
      initialTiles.push(block1, block2);

      // Spawn two standard playing tiles
      const tile1 = createRandomTile(initialTiles);
      initialTiles.push(tile1);
      const tile2 = createRandomTile(initialTiles);
      initialTiles.push(tile2);
    } else {
      // Classic, Zen, Timeattack standard setup
      const tile1 = { id: 1, value: 2, row: Math.floor(Math.random() * 4), col: Math.floor(Math.random() * 4), isNew: true };
      let r2 = Math.floor(Math.random() * 4);
      let c2 = Math.floor(Math.random() * 4);
      while (r2 === tile1.row && c2 === tile1.col) {
        r2 = Math.floor(Math.random() * 4);
        c2 = Math.floor(Math.random() * 4);
      }
      const tile2 = { id: 2, value: Math.random() < 0.9 ? 2 : 4, row: r2, col: c2, isNew: true };
      initialTiles = [tile1, tile2];
    }

    setTiles(initialTiles);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setHasContinued(false);
    setHistory([]);
    setMoveCount(0);
    isTransitioningRef.current = false;

    // Increment Stats: Games Played
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1
    }));

    if (!preventSave) {
      saveGameState(initialTiles, 0, bestScore, false, false, false, 0, coins, mode, null, 0);
    }
  }, [bestScore, coins, saveGameState]);

  // Undo triggers
  const undoLastMove = useCallback(() => {
    if (history.length === 0 || isTransitioningRef.current) return;

    // Zen mode undo options are entirely free; other modes consume 10 coins
    if (gameMode !== 'zen' && coins < 10) return;

    const previous = history[history.length - 1];
    const updatedHistory = history.slice(0, -1);

    setTiles(previous.tiles);
    setScore(previous.score);
    setGameOver(previous.gameOver);
    setGameWon(previous.gameWon);
    setHasContinued(previous.hasContinued);
    setHistory(updatedHistory);
    setMoveCount(prev => Math.max(0, prev - 1));

    const nextCoins = gameMode === 'zen' ? coins : coins - 10;
    setCoins(nextCoins);

    saveGameState(
      previous.tiles,
      previous.score,
      bestScore,
      previous.gameOver,
      previous.gameWon,
      previous.hasContinued,
      Math.max(0, moveCount - 1),
      nextCoins,
      gameMode,
      activePowerup,
      doubleScoreMovesLeft
    );
    
    gameAudio.playMove();
  }, [history, bestScore, moveCount, saveGameState, coins, gameMode, activePowerup, doubleScoreMovesLeft]);

  // Continue Game
  const continueGamePlay = useCallback(() => {
    setHasContinued(true);
    setGameOver(false);
    saveGameState(tiles, score, bestScore, false, gameWon, true, moveCount, coins, gameMode, activePowerup, doubleScoreMovesLeft);
  }, [tiles, score, bestScore, gameWon, moveCount, coins, gameMode, activePowerup, doubleScoreMovesLeft, saveGameState]);

  // Mute configurations
  const toggleMuteOption = useCallback(() => {
    const status = gameAudio.toggleMute();
    setIsMuted(status);
  }, []);

  const toggleMusicOption = useCallback(() => {
    const status = gameAudio.toggleMusicMute();
    setIsMusicMuted(status);
  }, []);

  // Theme purchases
  const selectTheme = (themeId: string) => {
    setActiveThemeId(themeId);
    localStorage.setItem(ACTIVE_THEME_KEY, themeId);
  };

  const unlockTheme = (themeId: string, cost: number) => {
    if (coins < cost) return;
    const nextCoins = coins - cost;
    setCoins(nextCoins);

    setThemes(prev => prev.map(t => t.id === themeId ? { ...t, unlocked: true } : t));
    setActiveThemeId(themeId);

    // Persist unlock list
    const list = themes.filter(t => t.unlocked || t.id === themeId).map(t => t.id);
    localStorage.setItem(THEMES_UNLOCKED_KEY, JSON.stringify(list));
    localStorage.setItem(ACTIVE_THEME_KEY, themeId);

    // Award Achievement: Theme Unlocked
    triggerAchievementUnlock('buy_theme', 1);
  };

  // Tactical powerups selector
  const selectPowerupAction = (pw: 'bomb' | 'shuffle' | 'wildcard' | 'freeze' | 'double') => {
    if (activePowerup === pw) {
      setActivePowerup(null);
      return;
    }

    const price = { bomb: 50, shuffle: 40, wildcard: 75, freeze: 30, double: 60 }[pw];
    if (coins < price) return;

    if (pw === 'shuffle') {
      applyShuffleBoard();
    } else if (pw === 'double') {
      applyDoubleMultiplier();
    } else {
      // Enter targeting cursor mode
      setActivePowerup(pw);
    }
  };

  // Shuffle Board Powerup implementation
  const applyShuffleBoard = () => {
    if (coins < 40) return;
    setCoins(prev => prev - 40);

    setTiles(prev => {
      // Find normal sliding tiles (excluding stone rock obstacles)
      const playingTiles = prev.filter(t => !t.isBlocked && !t.isMergedOut);
      const obstacles = prev.filter(t => t.isBlocked);

      const positions: { r: number; c: number }[] = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const isOccupied = obstacles.some(o => o.row === r && o.col === c);
          if (!isOccupied) positions.push({ r, c });
        }
      }

      // Shuffle positions
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      const shuffledTiles = playingTiles.map((tile, idx) => ({
        ...tile,
        row: positions[idx].r,
        col: positions[idx].c,
        isNew: true
      }));

      return [...obstacles, ...shuffledTiles];
    });

    setStats(prev => ({ ...prev, powerupsUsed: prev.powerupsUsed + 1 }));
    gameAudio.playMerge();
    setActivePowerup(null);
  };

  // Double Multiplier Powerup implementation
  const applyDoubleMultiplier = () => {
    if (coins < 60) return;
    setCoins(prev => prev - 60);
    setDoubleScoreMovesLeft(5);
    setStats(prev => ({ ...prev, powerupsUsed: prev.powerupsUsed + 1 }));
    gameAudio.playWin();
    setActivePowerup(null);
  };

  // Click on tile to apply targeted power-up
  const handleTileClick = (target: Tile) => {
    if (!activePowerup) return;
    if (target.isBlocked) return; // Cannot alter rocky blockades

    const cost = { bomb: 50, wildcard: 75, freeze: 30 }[activePowerup as 'bomb' | 'wildcard' | 'freeze'] || 0;
    if (coins < cost) {
      setActivePowerup(null);
      return;
    }

    setCoins(prev => prev - cost);

    if (activePowerup === 'bomb') {
      // Delete the selected tile completely
      setTiles(prev => prev.filter(t => t.id !== target.id));
      gameAudio.playGameOver();
    } else if (activePowerup === 'wildcard') {
      // Transform target into a wildcard merge node
      setTiles(prev => prev.map(t => t.id === target.id ? { ...t, isWildcard: true } : t));
      gameAudio.playMerge();
    } else if (activePowerup === 'freeze') {
      // Lock target in place
      setTiles(prev => prev.map(t => t.id === target.id ? { ...t, isFrozen: true } : t));
      gameAudio.playWin();
    }

    setStats(prev => ({ ...prev, powerupsUsed: prev.powerupsUsed + 1 }));
    setActivePowerup(null);
  };

  // Helper: Increments progress on achievements
  const triggerAchievementUnlock = (id: string, progressAdd: number) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id && !a.unlocked) {
        const nextProgress = a.progressCurrent + progressAdd;
        const reached = nextProgress >= a.progressTarget;
        if (reached) {
          // Play win sound and give coins
          setTimeout(() => gameAudio.playWin(), 500);
          setCoins(c => c + a.rewardCoins);
          setStats(s => ({ ...s, totalCoinsEarned: s.totalCoinsEarned + a.rewardCoins }));
          return { ...a, progressCurrent: a.progressTarget, unlocked: true };
        }
        return { ...a, progressCurrent: nextProgress };
      }
      return a;
    }));
  };

  // Helper: Increments progress on Daily Goals
  const updateDailyGoals = (type: 'score' | 'tile' | 'merges' | 'moves', value: number) => {
    setDailyChallenges(prev => prev.map(c => {
      if (c.targetType === type && !c.completed) {
        let nextProgress = c.progress;
        if (type === 'tile') {
          nextProgress = Math.max(c.progress, value);
        } else if (type === 'score') {
          nextProgress = value; // total score
        } else {
          nextProgress = c.progress + value; // addition
        }

        const reached = nextProgress >= c.targetValue;
        if (reached) {
          setCoins(co => co + c.rewardCoins);
          setStats(s => ({ ...s, totalCoinsEarned: s.totalCoinsEarned + c.rewardCoins }));
          return { ...c, progress: c.targetValue, completed: true };
        }
        return { ...c, progress: nextProgress };
      }
      return c;
    }));
  };

  // Slide grid moves
  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || isTransitioningRef.current) return;

    isTransitioningRef.current = true;

    // Filter out sliding merged out nodes to avoid glitching positions
    const activeTiles = tiles.filter(t => !t.isMergedOut);

    const currentGrid: (Tile | null)[][] = Array(4).fill(null).map(() => Array(4).fill(null));
    activeTiles.forEach(tile => {
      currentGrid[tile.row][tile.col] = tile;
    });

    // Track state of moving/sliding in newGrid and mergedGrid
    const newGrid: (Tile | null)[][] = Array(4).fill(null).map(() => Array(4).fill(null));
    const mergedGrid: boolean[][] = Array(4).fill(null).map(() => Array(4).fill(false));
    const nextTiles: Tile[] = [];
    
    let scoreGain = 0;
    let moved = false;
    let tileIdCounter = Math.max(0, ...activeTiles.map(t => t.id)) + 1;
    let mergesCount = 0;

    const rows = direction === 'up' ? [0, 1, 2, 3] : direction === 'down' ? [3, 2, 1, 0] : [0, 1, 2, 3];
    const cols = direction === 'left' ? [0, 1, 2, 3] : direction === 'right' ? [3, 2, 1, 0] : [0, 1, 2, 3];
    const vector = {
      up: { r: -1, c: 0 },
      down: { r: 1, c: 0 },
      left: { r: 0, c: -1 },
      right: { r: 0, c: 1 }
    }[direction];

    rows.forEach(r => {
      cols.forEach(c => {
        const tile = currentGrid[r][c];
        if (tile) {
          // ROCK Obstacles remain strictly frozen where they are
          if (tile.isBlocked) {
            nextTiles.push(tile);
            newGrid[r][c] = tile;
            return;
          }

          // Frozen items melt but cannot shift during this action
          if (tile.isFrozen) {
            const meltedTile = { ...tile, isFrozen: false, isNew: false, isMerged: false };
            nextTiles.push(meltedTile);
            newGrid[r][c] = meltedTile;
            return;
          }

          const { farthest, next } = getMovePositions(tile, vector, newGrid);
          let merged = false;

          if (next) {
            const targetTile = newGrid[next.r][next.c];
            // Merge condition: Values are equal OR one of them is a Wildcard merge element
            const isMatch = targetTile && !targetTile.isBlocked && (targetTile.value === tile.value || tile.isWildcard || targetTile.isWildcard);
            
            if (isMatch && !mergedGrid[next.r][next.c]) {
              merged = true;
              moved = true;
              
              // Wildcard double-merger value resolution
              let newValue = tile.value * 2;
              if (tile.isWildcard && targetTile) newValue = targetTile.value * 2;
              else if (targetTile?.isWildcard) newValue = tile.value * 2;

              scoreGain += newValue;
              mergesCount++;

              // Reward Coins on Merge: Value / 8 (e.g., merge of 16 gives +2 coins)
              const coinGained = Math.max(1, Math.floor(newValue / 8));
              setCoins(prev => prev + coinGained);
              setStats(prev => ({
                ...prev,
                totalCoinsEarned: prev.totalCoinsEarned + coinGained
              }));

              // Slide source tile A to fusion point
              nextTiles.push({
                ...tile,
                row: next.r,
                col: next.c,
                isMergedOut: true,
                isNew: false,
                isMerged: false,
              });

              // Slide source tile B to fusion point (by updating the existing tile in nextTiles to isMergedOut)
              const targetIdx = nextTiles.findIndex(t => t.id === targetTile.id);
              if (targetIdx !== -1) {
                nextTiles[targetIdx] = {
                  ...nextTiles[targetIdx],
                  isMergedOut: true,
                  isNew: false,
                  isMerged: false,
                };
              }

              // Instantiate the new combined tile
              const combinedTile = {
                id: tileIdCounter++,
                value: newValue,
                row: next.r,
                col: next.c,
                isMerged: true,
                isNew: false
              };
              nextTiles.push(combinedTile);

              newGrid[next.r][next.c] = combinedTile;
              mergedGrid[next.r][next.c] = true;

              // Progress Achievement triggers
              triggerAchievementUnlock('first_merge', 1);
              if (newValue === 512) triggerAchievementUnlock('reach_512', 512);
              if (newValue === 1024) triggerAchievementUnlock('reach_1024', 1024);
              if (newValue === 2048) triggerAchievementUnlock('reach_2048', 2048);
            }
          }

          if (!merged) {
            const updatedTile = {
              ...tile,
              row: farthest.r,
              col: farthest.c,
              isNew: false,
              isMerged: false,
            };
            nextTiles.push(updatedTile);
            newGrid[farthest.r][farthest.c] = updatedTile;

            if (farthest.r !== tile.row || farthest.c !== tile.col) {
              moved = true;
            }
          }
        }
      });
    });

    if (!moved) {
      isTransitioningRef.current = false;
      return;
    }

    // Save state history (max 20)
    const prevHistoryEntry: GameHistory = {
      tiles: activeTiles.map(t => ({ ...t, isNew: false, isMerged: false })),
      score,
      gameOver,
      gameWon,
      hasContinued,
      coins
    };
    
    setHistory(prev => {
      const nextHistory = [...prev, prevHistoryEntry];
      return nextHistory.length > 20 ? nextHistory.slice(1) : nextHistory;
    });

    // Double multiplier power-up check
    if (doubleScoreMovesLeft > 0) {
      scoreGain *= 2;
      setDoubleScoreMovesLeft(prev => prev - 1);
    }

    // Apply score additions
    const newScore = score + scoreGain;
    let newBest = bestScore;
    if (newScore > bestScore) {
      newBest = newScore;
      setBestScore(newBest);
      try {
        localStorage.setItem(BEST_SCORE_KEY, newBest.toString());
      } catch (_) {}
    }
    setScore(newScore);
    const nextMovesCount = moveCount + 1;
    setMoveCount(nextMovesCount);

    // Increment Stats counters
    setStats(prev => {
      let maxTileOnBoard = prev.highestTile;
      nextTiles.forEach(t => {
        if (!t.isMergedOut && t.value > maxTileOnBoard) maxTileOnBoard = t.value;
      });

      return {
        ...prev,
        highestScore: Math.max(prev.highestScore, newScore),
        highestTile: maxTileOnBoard,
        totalMerges: prev.totalMerges + mergesCount,
        totalMoves: prev.totalMoves + 1
      };
    });

    // Update Daily challenges progress
    updateDailyGoals('moves', 1);
    if (scoreGain > 0) {
      updateDailyGoals('score', newScore);
      updateDailyGoals('merges', mergesCount);
    }
    nextTiles.forEach(t => {
      if (!t.isMergedOut && t.value) {
        updateDailyGoals('tile', t.value);
      }
    });

    if (gameMode === 'survival' && newScore >= 5000) {
      triggerAchievementUnlock('survival_master', 5000);
    }

    // Sound outputs
    if (scoreGain > 0) {
      gameAudio.playMerge();
    } else {
      gameAudio.playMove();
    }

    setTiles(nextTiles);

    // Finish intermediate slides and spawn random tiles
    setTimeout(() => {
      setTiles(prevTiles => {
        const stableTiles = prevTiles
          .filter(t => !t.isMergedOut)
          .map(t => ({ ...t, isNew: false, isMerged: false }));
        
        let finalTiles = stableTiles;
        try {
          const spawn = createRandomTile(stableTiles);
          finalTiles = [...stableTiles, spawn];
        } catch (_) {
          // Full Grid
        }

        const won = checkGameWon(finalTiles);
        const lost = checkGameOver(finalTiles);

        if (won && !gameWon && !hasContinued && gameMode !== 'zen') {
          setGameWon(true);
          gameAudio.playWin();
        } else if (lost && gameMode !== 'zen') {
          setGameOver(true);
          gameAudio.playGameOver();
        }

        saveGameState(
          finalTiles,
          newScore,
          newBest,
          lost && gameMode !== 'zen',
          (won || gameWon) && gameMode !== 'zen',
          hasContinued,
          nextMovesCount,
          coins,
          gameMode,
          activePowerup,
          doubleScoreMovesLeft
        );

        isTransitioningRef.current = false;
        return finalTiles;
      });
    }, 120);

  }, [tiles, score, bestScore, gameOver, gameWon, hasContinued, moveCount, coins, gameMode, activePowerup, doubleScoreMovesLeft, saveGameState]);

  return {
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
    activeTheme: themes.find(t => t.id === activeThemeId) || themes[0],
    themes,
    move,
    restart: () => restartGame(gameMode),
    restartGame,
    undo: undoLastMove,
    continueGame: continueGamePlay,
    toggleMute: toggleMuteOption,
    toggleMusicMute: toggleMusicOption,
    selectTheme,
    unlockTheme,
    selectPowerup: selectPowerupAction,
    onTileClick: handleTileClick,
  };
}
