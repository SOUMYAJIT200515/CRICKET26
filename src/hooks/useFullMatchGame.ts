import { useState, useCallback } from "react";

export type DeliveryType = "Yorker" | "Bouncer" | "Spin" | "Outswinger" | "Inswinger" | "Slower";
export type ShotType = "Defensive" | "Drive" | "Pull" | "Cut" | "Sweep" | "Slog";

export interface BallTrajectory {
  direction: "straight" | "cover" | "midwicket" | "point" | "square-leg" | "long-on" | "long-off" | "fine-leg" | "third-man";
  distance: "close" | "boundary" | "six";
  x: number; // percentage from center
  y: number; // percentage from center
}

interface InningsState {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  fours: number;
  sixes: number;
}

interface FullMatchState {
  phase: "batting-first" | "bowling-second" | "bowling-first" | "batting-second" | "complete";
  playerBattingFirst: boolean;
  firstInnings: InningsState;
  secondInnings: InningsState;
  currentInnings: 1 | 2;
  isBowling: boolean;
  lastResult: string | null;
  lastDelivery: DeliveryType | null;
  incomingDelivery: DeliveryType | null;
  ballTrajectory: BallTrajectory | null;
  commentary: string[];
  gameOver: boolean;
  result: "win" | "loss" | "draw" | null;
  batsmanMood: "aggressive" | "defensive" | "normal";
}

const emptyInnings: InningsState = {
  runs: 0,
  wickets: 0,
  overs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
};

const initialState: FullMatchState = {
  phase: "batting-first",
  playerBattingFirst: true,
  firstInnings: { ...emptyInnings },
  secondInnings: { ...emptyInnings },
  currentInnings: 1,
  isBowling: false,
  lastResult: null,
  lastDelivery: null,
  incomingDelivery: null,
  ballTrajectory: null,
  commentary: [],
  gameOver: false,
  result: null,
  batsmanMood: "normal",
};

// Shot outcomes for batting
const shotOutcomes: Record<ShotType, Record<DeliveryType, { weights: number[]; outcomes: number[] }>> = {
  Defensive: {
    Yorker: { weights: [40, 30, 15, 5, 2, 8], outcomes: [0, 1, 2, 4, 6, -1] },
    Bouncer: { weights: [50, 25, 15, 5, 2, 3], outcomes: [0, 1, 2, 4, 6, -1] },
    Spin: { weights: [45, 30, 15, 5, 2, 3], outcomes: [0, 1, 2, 4, 6, -1] },
    Outswinger: { weights: [40, 30, 15, 5, 2, 8], outcomes: [0, 1, 2, 4, 6, -1] },
    Inswinger: { weights: [42, 28, 15, 5, 2, 8], outcomes: [0, 1, 2, 4, 6, -1] },
    Slower: { weights: [35, 35, 18, 5, 2, 5], outcomes: [0, 1, 2, 4, 6, -1] },
  },
  Drive: {
    Yorker: { weights: [25, 20, 18, 15, 7, 15], outcomes: [0, 1, 2, 4, 6, -1] },
    Bouncer: { weights: [30, 20, 15, 10, 5, 20], outcomes: [0, 1, 2, 4, 6, -1] },
    Spin: { weights: [20, 25, 25, 18, 7, 5], outcomes: [0, 1, 2, 4, 6, -1] },
    Outswinger: { weights: [20, 25, 20, 20, 8, 7], outcomes: [0, 1, 2, 4, 6, -1] },
    Inswinger: { weights: [25, 25, 20, 15, 5, 10], outcomes: [0, 1, 2, 4, 6, -1] },
    Slower: { weights: [15, 25, 25, 18, 10, 7], outcomes: [0, 1, 2, 4, 6, -1] },
  },
  Pull: {
    Yorker: { weights: [35, 20, 15, 10, 5, 15], outcomes: [0, 1, 2, 4, 6, -1] },
    Bouncer: { weights: [10, 15, 20, 20, 25, 10], outcomes: [0, 1, 2, 4, 6, -1] },
    Spin: { weights: [25, 25, 20, 15, 8, 7], outcomes: [0, 1, 2, 4, 6, -1] },
    Outswinger: { weights: [20, 20, 20, 20, 12, 8], outcomes: [0, 1, 2, 4, 6, -1] },
    Inswinger: { weights: [15, 20, 20, 20, 15, 10], outcomes: [0, 1, 2, 4, 6, -1] },
    Slower: { weights: [20, 20, 18, 18, 15, 9], outcomes: [0, 1, 2, 4, 6, -1] },
  },
  Cut: {
    Yorker: { weights: [40, 20, 15, 10, 3, 12], outcomes: [0, 1, 2, 4, 6, -1] },
    Bouncer: { weights: [15, 20, 25, 25, 8, 7], outcomes: [0, 1, 2, 4, 6, -1] },
    Spin: { weights: [30, 25, 20, 15, 5, 5], outcomes: [0, 1, 2, 4, 6, -1] },
    Outswinger: { weights: [15, 20, 22, 25, 10, 8], outcomes: [0, 1, 2, 4, 6, -1] },
    Inswinger: { weights: [30, 25, 18, 12, 5, 10], outcomes: [0, 1, 2, 4, 6, -1] },
    Slower: { weights: [25, 25, 20, 18, 7, 5], outcomes: [0, 1, 2, 4, 6, -1] },
  },
  Sweep: {
    Yorker: { weights: [35, 20, 15, 10, 5, 15], outcomes: [0, 1, 2, 4, 6, -1] },
    Bouncer: { weights: [40, 15, 10, 10, 5, 20], outcomes: [0, 1, 2, 4, 6, -1] },
    Spin: { weights: [10, 15, 20, 25, 20, 10], outcomes: [0, 1, 2, 4, 6, -1] },
    Outswinger: { weights: [25, 20, 18, 18, 10, 9], outcomes: [0, 1, 2, 4, 6, -1] },
    Inswinger: { weights: [20, 20, 20, 20, 12, 8], outcomes: [0, 1, 2, 4, 6, -1] },
    Slower: { weights: [15, 18, 22, 22, 15, 8], outcomes: [0, 1, 2, 4, 6, -1] },
  },
  Slog: {
    Yorker: { weights: [15, 10, 10, 15, 20, 30], outcomes: [0, 1, 2, 4, 6, -1] },
    Bouncer: { weights: [10, 10, 10, 15, 30, 25], outcomes: [0, 1, 2, 4, 6, -1] },
    Spin: { weights: [8, 12, 15, 20, 30, 15], outcomes: [0, 1, 2, 4, 6, -1] },
    Outswinger: { weights: [10, 12, 13, 20, 25, 20], outcomes: [0, 1, 2, 4, 6, -1] },
    Inswinger: { weights: [10, 12, 13, 18, 22, 25], outcomes: [0, 1, 2, 4, 6, -1] },
    Slower: { weights: [5, 10, 15, 22, 28, 20], outcomes: [0, 1, 2, 4, 6, -1] },
  },
};

// Delivery outcomes when computer bats
const deliveryOutcomes: Record<DeliveryType, { weights: number[]; outcomes: number[] }> = {
  Yorker: { weights: [25, 20, 15, 10, 10, 20], outcomes: [0, 1, 2, 4, 6, -1] },
  Bouncer: { weights: [20, 15, 15, 15, 20, 15], outcomes: [0, 1, 2, 4, 6, -1] },
  Spin: { weights: [30, 25, 20, 10, 5, 10], outcomes: [0, 1, 2, 4, 6, -1] },
  Outswinger: { weights: [25, 20, 18, 12, 7, 18], outcomes: [0, 1, 2, 4, 6, -1] },
  Inswinger: { weights: [22, 22, 18, 15, 8, 15], outcomes: [0, 1, 2, 4, 6, -1] },
  Slower: { weights: [20, 18, 15, 20, 15, 12], outcomes: [0, 1, 2, 4, 6, -1] },
};

const deliveryTypes: DeliveryType[] = ["Yorker", "Bouncer", "Spin", "Outswinger", "Inswinger", "Slower"];

const getRandomDelivery = (): DeliveryType => {
  return deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)];
};

const getBallTrajectory = (outcome: number, shotType?: ShotType): BallTrajectory => {
  const directions: BallTrajectory["direction"][] = [
    "straight", "cover", "midwicket", "point", "square-leg", "long-on", "long-off", "fine-leg", "third-man"
  ];
  
  // Shot type influences direction
  const directionByShot: Record<ShotType, BallTrajectory["direction"][]> = {
    Defensive: ["straight", "cover", "midwicket"],
    Drive: ["cover", "long-off", "straight"],
    Pull: ["midwicket", "square-leg", "long-on"],
    Cut: ["point", "third-man", "cover"],
    Sweep: ["fine-leg", "square-leg", "midwicket"],
    Slog: ["long-on", "long-off", "midwicket"],
  };
  
  const possibleDirs = shotType ? directionByShot[shotType] : directions;
  const direction = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
  
  const distance: BallTrajectory["distance"] = 
    outcome === 6 ? "six" : 
    outcome === 4 ? "boundary" : "close";
  
  // Calculate position based on direction
  const positionMap: Record<BallTrajectory["direction"], { x: number; y: number }> = {
    "straight": { x: 0, y: -45 },
    "cover": { x: 30, y: -35 },
    "midwicket": { x: -30, y: -35 },
    "point": { x: 40, y: -15 },
    "square-leg": { x: -40, y: -15 },
    "long-on": { x: -20, y: -45 },
    "long-off": { x: 20, y: -45 },
    "fine-leg": { x: -35, y: 30 },
    "third-man": { x: 35, y: 30 },
  };
  
  const basePos = positionMap[direction];
  const distanceMultiplier = distance === "six" ? 1 : distance === "boundary" ? 0.85 : 0.4;
  
  return {
    direction,
    distance,
    x: basePos.x * distanceMultiplier,
    y: basePos.y * distanceMultiplier,
  };
};

const getMoodModifier = (mood: "aggressive" | "defensive" | "normal"): number[] => {
  switch (mood) {
    case "aggressive": return [0.7, 0.8, 1, 1.3, 1.5, 1.3];
    case "defensive": return [1.5, 1.2, 0.9, 0.6, 0.4, 0.7];
    default: return [1, 1, 1, 1, 1, 1];
  }
};

const getRandomOutcome = (
  weights: number[],
  outcomes: number[],
  moodModifier?: number[]
): number => {
  const adjustedWeights = moodModifier 
    ? weights.map((w, i) => w * moodModifier[i])
    : weights;
  const totalWeight = adjustedWeights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < adjustedWeights.length; i++) {
    random -= adjustedWeights[i];
    if (random <= 0) return outcomes[i];
  }
  return outcomes[0];
};

export const useFullMatchGame = () => {
  const [state, setState] = useState<FullMatchState>(initialState);

  const prepareDelivery = useCallback(() => {
    const delivery = getRandomDelivery();
    setState(prev => ({
      ...prev,
      incomingDelivery: delivery,
    }));
  }, []);

  const playShot = useCallback((shotType: ShotType) => {
    setState(prev => {
      if (!prev.incomingDelivery) return prev;
      
      return {
        ...prev,
        isBowling: true,
        lastResult: null,
        ballTrajectory: null,
        lastDelivery: prev.incomingDelivery,
      };
    });

    setTimeout(() => {
      setState(prev => {
        if (!prev.lastDelivery) return prev;
        
        const { weights, outcomes } = shotOutcomes[shotType][prev.lastDelivery];
        const outcome = getRandomOutcome(weights, outcomes);
        const trajectory = getBallTrajectory(outcome, shotType);
        
        const currentKey = prev.currentInnings === 1 ? "firstInnings" : "secondInnings";
        const innings = { ...prev[currentKey] };
        
        let newRuns = innings.runs;
        let newWickets = innings.wickets;
        let newBalls = innings.balls + 1;
        let newOvers = innings.overs;
        let resultText = "";
        
        if (outcome === -1) {
          newWickets += 1;
          resultText = "WICKET!";
        } else if (outcome === 6) {
          newRuns += 6;
          innings.sixes += 1;
          resultText = "SIX!";
        } else if (outcome === 4) {
          newRuns += 4;
          innings.fours += 1;
          resultText = "FOUR!";
        } else {
          newRuns += outcome;
          resultText = outcome === 0 ? "DOT" : `${outcome} RUN${outcome > 1 ? "S" : ""}`;
        }
        
        if (newBalls === 6) {
          newOvers += 1;
          newBalls = 0;
        }
        
        innings.runs = newRuns;
        innings.wickets = newWickets;
        innings.balls = newBalls;
        innings.overs = newOvers;
        
        let gameOver = false;
        let result: "win" | "loss" | "draw" | null = null;
        let newPhase = prev.phase;
        let newCurrentInnings = prev.currentInnings;
        let newCommentary = [...prev.commentary];
        
        const oversText = `${newOvers}.${newBalls}`;
        newCommentary.push(`${oversText} - ${shotType} vs ${prev.lastDelivery}: ${resultText}`);
        
        // Check innings end
        if (prev.currentInnings === 1) {
          if (newWickets >= 10 || newOvers >= 10) {
            newPhase = prev.playerBattingFirst ? "bowling-second" : "batting-second";
            newCurrentInnings = 2;
            newCommentary.push(`--- First innings ends: ${newRuns}/${newWickets} ---`);
            newCommentary.push(`Target: ${newRuns + 1} runs to win!`);
          }
        } else {
          const target = prev.firstInnings.runs + 1;
          if (newRuns >= target) {
            gameOver = true;
            result = prev.playerBattingFirst ? "loss" : "win";
          } else if (newWickets >= 10 || newOvers >= 10) {
            gameOver = true;
            if (newRuns < prev.firstInnings.runs) {
              result = prev.playerBattingFirst ? "win" : "loss";
            } else if (newRuns === prev.firstInnings.runs) {
              result = "draw";
            }
          }
        }
        
        return {
          ...prev,
          [currentKey]: innings,
          currentInnings: newCurrentInnings as 1 | 2,
          phase: newPhase,
          isBowling: false,
          lastResult: resultText,
          ballTrajectory: trajectory,
          incomingDelivery: null,
          commentary: newCommentary,
          gameOver,
          result,
        };
      });
    }, 800);
  }, []);

  const bowl = useCallback((deliveryType: DeliveryType) => {
    setState(prev => ({
      ...prev,
      isBowling: true,
      lastResult: null,
      ballTrajectory: null,
      lastDelivery: deliveryType,
    }));

    setTimeout(() => {
      setState(prev => {
        const { weights, outcomes } = deliveryOutcomes[deliveryType];
        const moodMod = getMoodModifier(prev.batsmanMood);
        const outcome = getRandomOutcome(weights, outcomes, moodMod);
        const trajectory = getBallTrajectory(outcome);
        
        const currentKey = prev.currentInnings === 1 ? "firstInnings" : "secondInnings";
        const innings = { ...prev[currentKey] };
        
        let newRuns = innings.runs;
        let newWickets = innings.wickets;
        let newBalls = innings.balls + 1;
        let newOvers = innings.overs;
        let resultText = "";
        let newMood = prev.batsmanMood;
        
        if (outcome === -1) {
          newWickets += 1;
          resultText = "WICKET!";
          newMood = "normal";
        } else if (outcome === 6) {
          newRuns += 6;
          innings.sixes += 1;
          resultText = "SIX!";
          newMood = "aggressive";
        } else if (outcome === 4) {
          newRuns += 4;
          innings.fours += 1;
          resultText = "FOUR!";
          newMood = Math.random() > 0.5 ? "aggressive" : "normal";
        } else {
          newRuns += outcome;
          resultText = outcome === 0 ? "DOT" : `${outcome} RUN${outcome > 1 ? "S" : ""}`;
          newMood = outcome === 0 ? (Math.random() > 0.7 ? "aggressive" : "defensive") : "normal";
        }
        
        if (newBalls === 6) {
          newOvers += 1;
          newBalls = 0;
        }
        
        innings.runs = newRuns;
        innings.wickets = newWickets;
        innings.balls = newBalls;
        innings.overs = newOvers;
        
        let gameOver = false;
        let result: "win" | "loss" | "draw" | null = null;
        let newPhase = prev.phase;
        let newCurrentInnings = prev.currentInnings;
        let newCommentary = [...prev.commentary];
        
        const oversText = `${newOvers}.${newBalls}`;
        newCommentary.push(`${oversText} - ${deliveryType}: ${resultText}`);
        
        // Check innings end
        if (prev.currentInnings === 1) {
          if (newWickets >= 10 || newOvers >= 10) {
            newPhase = prev.playerBattingFirst ? "batting-second" : "bowling-second";
            newCurrentInnings = 2;
            newCommentary.push(`--- First innings ends: ${newRuns}/${newWickets} ---`);
            newCommentary.push(`Target: ${newRuns + 1} runs to win!`);
          }
        } else {
          const target = prev.firstInnings.runs + 1;
          if (newRuns >= target) {
            gameOver = true;
            result = prev.playerBattingFirst ? "win" : "loss";
          } else if (newWickets >= 10 || newOvers >= 10) {
            gameOver = true;
            if (newRuns < prev.firstInnings.runs) {
              result = prev.playerBattingFirst ? "loss" : "win";
            } else if (newRuns === prev.firstInnings.runs) {
              result = "draw";
            }
          }
        }
        
        return {
          ...prev,
          [currentKey]: innings,
          currentInnings: newCurrentInnings as 1 | 2,
          phase: newPhase,
          isBowling: false,
          lastResult: resultText,
          ballTrajectory: trajectory,
          batsmanMood: newMood,
          commentary: newCommentary,
          gameOver,
          result,
        };
      });
    }, 1000);
  }, []);

  const startGame = useCallback((battingFirst: boolean) => {
    const startPhase = battingFirst ? "batting-first" : "bowling-first";
    setState({
      ...initialState,
      phase: startPhase,
      playerBattingFirst: battingFirst,
      commentary: [
        battingFirst 
          ? "You won the toss and chose to bat first!" 
          : "You won the toss and chose to bowl first!",
        "10 overs per side. Let's go!"
      ],
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  // Get current innings data
  const currentInningsData = state.currentInnings === 1 ? state.firstInnings : state.secondInnings;
  const isPlayerBatting = 
    (state.phase === "batting-first" && state.playerBattingFirst) ||
    (state.phase === "batting-second" && !state.playerBattingFirst);
  const isPlayerBowling = 
    (state.phase === "bowling-first" && !state.playerBattingFirst) ||
    (state.phase === "bowling-second" && state.playerBattingFirst);

  return {
    ...state,
    currentInningsData,
    isPlayerBatting,
    isPlayerBowling,
    target: state.currentInnings === 2 ? state.firstInnings.runs + 1 : null,
    playShot,
    bowl,
    prepareDelivery,
    startGame,
    resetGame,
  };
};
