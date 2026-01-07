import { useState, useCallback } from "react";

interface GameState {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  target: number | null;
  isFirstInnings: boolean;
  isBowling: boolean;
  lastResult: string | null;
  commentary: string[];
  gameOver: boolean;
  result: "win" | "loss" | "draw" | null;
}

const initialState: GameState = {
  runs: 0,
  wickets: 0,
  overs: 0,
  balls: 0,
  target: null,
  isFirstInnings: true,
  isBowling: false,
  lastResult: null,
  commentary: [],
  gameOver: false,
  result: null,
};

const shotOutcomes: Record<string, { weights: number[]; outcomes: number[] }> = {
  Defensive: {
    weights: [40, 35, 15, 5, 3, 2],
    outcomes: [0, 1, 2, 3, 4, -1], // -1 = wicket
  },
  Drive: {
    weights: [20, 25, 25, 10, 15, 5],
    outcomes: [0, 1, 2, 4, 4, -1],
  },
  Pull: {
    weights: [15, 20, 25, 15, 15, 10],
    outcomes: [0, 1, 2, 4, 6, -1],
  },
  Cut: {
    weights: [20, 25, 20, 15, 12, 8],
    outcomes: [0, 1, 2, 4, 4, -1],
  },
  Sweep: {
    weights: [10, 15, 20, 15, 20, 20],
    outcomes: [0, 1, 2, 4, 6, -1],
  },
  Slog: {
    weights: [5, 10, 10, 15, 30, 30],
    outcomes: [0, 1, 2, 4, 6, -1],
  },
};

const getRandomOutcome = (shotType: string): number => {
  const { weights, outcomes } = shotOutcomes[shotType] || shotOutcomes.Defensive;
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return outcomes[i];
    }
  }
  return outcomes[0];
};

const generateCommentary = (shotType: string, outcome: number): string => {
  const shotCommentary: Record<string, Record<number, string[]>> = {
    Defensive: {
      0: ["Solid defense!", "Well blocked!", "Safe shot there."],
      1: ["Quick single taken!", "Good running between the wickets!"],
      2: ["Pushed for two!", "Excellent running!"],
      [-1]: ["Caught behind! The defensive prod didn't work.", "Trapped LBW!"],
    },
    Drive: {
      0: ["Drives, but straight to the fielder.", "Good shot, no run."],
      1: ["Lovely drive for one!", "Elegant stroke!"],
      2: ["Driven through the gap for two!"],
      4: ["FOUR! Beautiful cover drive!", "FOUR! Timing was impeccable!"],
      [-1]: ["Edged and caught! The drive was too early.", "Clean bowled!"],
    },
    Pull: {
      0: ["Pulls, but can't beat the fielder."],
      1: ["Pulled away for a single."],
      2: ["Pulled through midwicket for two!"],
      4: ["FOUR! Powerful pull shot!"],
      6: ["SIX! Massive pull into the stands!", "HUGE SIX over midwicket!"],
      [-1]: ["Top edge! Caught at fine leg!", "Mistimed pull, caught!"],
    },
    Cut: {
      0: ["Cut shot finds the fielder."],
      1: ["Late cut for one."],
      2: ["Cut through point for two!"],
      4: ["FOUR! Slashed hard past point!", "FOUR! Square cut races away!"],
      [-1]: ["Sliced to gully! Poor shot selection.", "Caught at slip!"],
    },
    Sweep: {
      0: ["Sweeps but can't find the gap."],
      1: ["Sweep for a single."],
      2: ["Swept fine for two runs."],
      4: ["FOUR! Swept powerfully!", "FOUR! Fine sweep!"],
      6: ["SIX! Slog swept into the crowd!", "HUGE SIX over long leg!"],
      [-1]: ["Swept in the air and caught!", "Top edge, keeper takes it!"],
    },
    Slog: {
      0: ["Big swing, misses completely!"],
      1: ["Mistimed slog, just a single."],
      2: ["Slogged for two."],
      4: ["FOUR! Slogged over the infield!"],
      6: ["SIX! Slogged out of the ground!", "MASSIVE SIX! What a hit!"],
      [-1]: ["Caught at long-on! The slog didn't pay off.", "Bowled! Huge swing and a miss!"],
    },
  };

  const comments = shotCommentary[shotType]?.[outcome] || [`${shotType} for ${outcome} run${outcome !== 1 ? "s" : ""}`];
  return comments[Math.floor(Math.random() * comments.length)];
};

export const useCricketGame = () => {
  const [state, setState] = useState<GameState>(initialState);

  const playShot = useCallback((shotType: string) => {
    setState((prev) => ({
      ...prev,
      isBowling: true,
      lastResult: null,
    }));

    setTimeout(() => {
      const outcome = getRandomOutcome(shotType);
      const commentary = generateCommentary(shotType, outcome);

      setState((prev) => {
        let newRuns = prev.runs;
        let newWickets = prev.wickets;
        let newBalls = prev.balls + 1;
        let newOvers = prev.overs;
        let resultText = "";

        if (outcome === -1) {
          newWickets += 1;
          resultText = "WICKET!";
        } else if (outcome === 6) {
          newRuns += 6;
          resultText = "SIX!";
        } else if (outcome === 4) {
          newRuns += 4;
          resultText = "FOUR!";
        } else {
          newRuns += outcome;
          resultText = outcome === 0 ? "DOT" : `${outcome} RUN${outcome > 1 ? "S" : ""}`;
        }

        if (newBalls === 6) {
          newOvers += 1;
          newBalls = 0;
        }

        // Check for game over conditions
        let gameOver = false;
        let result: "win" | "loss" | "draw" | null = null;

        // All out
        if (newWickets >= 10) {
          gameOver = true;
          if (prev.target && newRuns >= prev.target) {
            result = "win";
          } else if (prev.target) {
            result = "loss";
          }
        }

        // Overs finished
        if (newOvers >= 10) {
          gameOver = true;
          if (prev.target) {
            if (newRuns >= prev.target) result = "win";
            else if (newRuns < prev.target) result = "loss";
            else result = "draw";
          }
        }

        // Target achieved
        if (prev.target && newRuns >= prev.target) {
          gameOver = true;
          result = "win";
        }

        const oversText = `${newOvers}.${newBalls}`;
        const fullCommentary = `${oversText} - ${commentary}`;

        return {
          ...prev,
          runs: newRuns,
          wickets: newWickets,
          balls: newBalls,
          overs: newOvers,
          isBowling: false,
          lastResult: resultText,
          commentary: [...prev.commentary, fullCommentary],
          gameOver,
          result,
        };
      });
    }, 800);
  }, []);

  const resetGame = useCallback(() => {
    // Generate a random target between 80-150 for a 10 over game
    const target = Math.floor(Math.random() * 71) + 80;
    setState({
      ...initialState,
      target,
      isFirstInnings: false,
      commentary: [`Target: ${target} runs to win in 10 overs. Let's go!`],
    });
  }, []);

  const startGame = useCallback(() => {
    const target = Math.floor(Math.random() * 71) + 80;
    setState({
      ...initialState,
      target,
      isFirstInnings: false,
      commentary: [`Target: ${target} runs to win in 10 overs. Good luck!`],
    });
  }, []);

  return {
    ...state,
    playShot,
    resetGame,
    startGame,
  };
};
