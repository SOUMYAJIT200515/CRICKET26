import { useState, useCallback, useEffect } from "react";

export interface PlayerStats {
  // Batting stats
  battingInnings: number;
  totalRunsScored: number;
  totalBallsFaced: number;
  highestScore: number;
  timesOut: number;
  fours: number;
  sixes: number;
  battingWins: number;
  battingLosses: number;
  
  // Bowling stats
  bowlingInnings: number;
  totalRunsConceded: number;
  totalBallsBowled: number;
  totalWicketsTaken: number;
  bestBowling: { wickets: number; runs: number };
  bowlingWins: number;
  bowlingLosses: number;
  
  // Full match stats
  fullMatchesPlayed: number;
  fullMatchWins: number;
  fullMatchLosses: number;
}

const defaultStats: PlayerStats = {
  battingInnings: 0,
  totalRunsScored: 0,
  totalBallsFaced: 0,
  highestScore: 0,
  timesOut: 0,
  fours: 0,
  sixes: 0,
  battingWins: 0,
  battingLosses: 0,
  
  bowlingInnings: 0,
  totalRunsConceded: 0,
  totalBallsBowled: 0,
  totalWicketsTaken: 0,
  bestBowling: { wickets: 0, runs: 999 },
  bowlingWins: 0,
  bowlingLosses: 0,
  
  fullMatchesPlayed: 0,
  fullMatchWins: 0,
  fullMatchLosses: 0,
};

const STORAGE_KEY = "cricket-player-stats";

export const usePlayerStats = () => {
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    } catch {
      return defaultStats;
    }
  });

  // Save to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const updateBattingStats = useCallback((
    runs: number,
    ballsFaced: number,
    isOut: boolean,
    foursHit: number,
    sixesHit: number,
    won: boolean
  ) => {
    setStats(prev => ({
      ...prev,
      battingInnings: prev.battingInnings + 1,
      totalRunsScored: prev.totalRunsScored + runs,
      totalBallsFaced: prev.totalBallsFaced + ballsFaced,
      highestScore: Math.max(prev.highestScore, runs),
      timesOut: prev.timesOut + (isOut ? 1 : 0),
      fours: prev.fours + foursHit,
      sixes: prev.sixes + sixesHit,
      battingWins: prev.battingWins + (won ? 1 : 0),
      battingLosses: prev.battingLosses + (won ? 0 : 1),
    }));
  }, []);

  const updateBowlingStats = useCallback((
    runsConceded: number,
    ballsBowled: number,
    wicketsTaken: number,
    won: boolean
  ) => {
    setStats(prev => {
      const isBestBowling = 
        wicketsTaken > prev.bestBowling.wickets ||
        (wicketsTaken === prev.bestBowling.wickets && runsConceded < prev.bestBowling.runs);
      
      return {
        ...prev,
        bowlingInnings: prev.bowlingInnings + 1,
        totalRunsConceded: prev.totalRunsConceded + runsConceded,
        totalBallsBowled: prev.totalBallsBowled + ballsBowled,
        totalWicketsTaken: prev.totalWicketsTaken + wicketsTaken,
        bestBowling: isBestBowling 
          ? { wickets: wicketsTaken, runs: runsConceded }
          : prev.bestBowling,
        bowlingWins: prev.bowlingWins + (won ? 1 : 0),
        bowlingLosses: prev.bowlingLosses + (won ? 0 : 1),
      };
    });
  }, []);

  const updateFullMatchStats = useCallback((won: boolean) => {
    setStats(prev => ({
      ...prev,
      fullMatchesPlayed: prev.fullMatchesPlayed + 1,
      fullMatchWins: prev.fullMatchWins + (won ? 1 : 0),
      fullMatchLosses: prev.fullMatchLosses + (won ? 0 : 1),
    }));
  }, []);

  const resetStats = useCallback(() => {
    setStats(defaultStats);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Computed stats
  const battingAverage = stats.timesOut > 0 
    ? (stats.totalRunsScored / stats.timesOut).toFixed(2) 
    : stats.totalRunsScored.toFixed(2);
    
  const strikeRate = stats.totalBallsFaced > 0 
    ? ((stats.totalRunsScored / stats.totalBallsFaced) * 100).toFixed(2) 
    : "0.00";
    
  const bowlingEconomy = stats.totalBallsBowled > 0 
    ? ((stats.totalRunsConceded / stats.totalBallsBowled) * 6).toFixed(2) 
    : "0.00";
    
  const bowlingAverage = stats.totalWicketsTaken > 0 
    ? (stats.totalRunsConceded / stats.totalWicketsTaken).toFixed(2) 
    : "-";

  return {
    stats,
    battingAverage,
    strikeRate,
    bowlingEconomy,
    bowlingAverage,
    updateBattingStats,
    updateBowlingStats,
    updateFullMatchStats,
    resetStats,
  };
};
