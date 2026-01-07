import { useState, useCallback } from "react";

export type DeliveryType = "Yorker" | "Bouncer" | "Spin" | "Outswinger" | "Inswinger" | "Slower";

interface BowlingGameState {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  target: number;
  isBowling: boolean;
  lastResult: string | null;
  lastDelivery: DeliveryType | null;
  commentary: string[];
  gameOver: boolean;
  result: "win" | "loss" | "draw" | null;
  batsmanMood: "aggressive" | "defensive" | "normal";
}

const initialState: BowlingGameState = {
  runs: 0,
  wickets: 0,
  overs: 0,
  balls: 0,
  target: 0,
  isBowling: false,
  lastResult: null,
  lastDelivery: null,
  commentary: [],
  gameOver: false,
  result: null,
  batsmanMood: "normal",
};

// Each delivery type has different outcomes based on batsman response
const deliveryOutcomes: Record<DeliveryType, { weights: number[]; outcomes: number[] }> = {
  Yorker: {
    weights: [25, 20, 15, 10, 10, 20], // High wicket chance
    outcomes: [0, 1, 2, 4, 6, -1],
  },
  Bouncer: {
    weights: [20, 15, 15, 15, 20, 15], // Can be hit for six but also wicket
    outcomes: [0, 1, 2, 4, 6, -1],
  },
  Spin: {
    weights: [30, 25, 20, 10, 5, 10], // Harder to score big
    outcomes: [0, 1, 2, 4, 6, -1],
  },
  Outswinger: {
    weights: [25, 20, 18, 12, 7, 18], // Good for edges/wickets
    outcomes: [0, 1, 2, 4, 6, -1],
  },
  Inswinger: {
    weights: [22, 22, 18, 15, 8, 15], // Tricky delivery
    outcomes: [0, 1, 2, 4, 6, -1],
  },
  Slower: {
    weights: [20, 18, 15, 20, 15, 12], // Can be hit if read
    outcomes: [0, 1, 2, 4, 6, -1],
  },
};

// Batsman mood affects outcomes
const getMoodModifier = (mood: "aggressive" | "defensive" | "normal"): number[] => {
  switch (mood) {
    case "aggressive":
      return [0.7, 0.8, 1, 1.3, 1.5, 1.3]; // More boundaries but more wickets
    case "defensive":
      return [1.5, 1.2, 0.9, 0.6, 0.4, 0.7]; // More dots, fewer boundaries
    default:
      return [1, 1, 1, 1, 1, 1];
  }
};

const getRandomOutcome = (
  deliveryType: DeliveryType,
  batsmanMood: "aggressive" | "defensive" | "normal"
): number => {
  const { weights, outcomes } = deliveryOutcomes[deliveryType];
  const moodMod = getMoodModifier(batsmanMood);
  const adjustedWeights = weights.map((w, i) => w * moodMod[i]);
  const totalWeight = adjustedWeights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < adjustedWeights.length; i++) {
    random -= adjustedWeights[i];
    if (random <= 0) {
      return outcomes[i];
    }
  }
  return outcomes[0];
};

const generateBowlingCommentary = (deliveryType: DeliveryType, outcome: number): string => {
  const commentary: Record<DeliveryType, Record<number, string[]>> = {
    Yorker: {
      0: ["Perfect yorker! Batsman can't get under it.", "Toe-crushing yorker, dot ball!"],
      1: ["Yorker dug out for a single.", "Just managed to squeeze it away."],
      2: ["Flicked off the toes for two!", "Smart work to get two off a yorker."],
      4: ["FOUR! Somehow got it away!", "FOUR! Incredible shot off the yorker!"],
      6: ["SIX! Scooped over the keeper!", "MASSIVE! Picked the yorker perfectly!"],
      [-1]: ["BOWLED! Yorker crashes into the stumps!", "CLEAN BOWLED! What a delivery!"],
    },
    Bouncer: {
      0: ["Bouncer! Ducked under it.", "Short ball, well evaded."],
      1: ["Pulled but found the fielder, just one.", "Glanced down to fine leg."],
      2: ["Pulled through square for two!", "Hooked away for a couple."],
      4: ["FOUR! Pulled powerfully!", "FOUR! Hooked in front of square!"],
      6: ["SIX! Hooked into the stands!", "HUGE SIX! Pulled over deep midwicket!"],
      [-1]: ["CAUGHT! Top edge off the bouncer!", "Hooked straight to fine leg!"],
    },
    Spin: {
      0: ["Good spin, defended back.", "Turn and bounce, well played out."],
      1: ["Worked away for one.", "Pushed into the gap for a single."],
      2: ["Swept fine for two runs.", "Driven through the covers for two."],
      4: ["FOUR! Swept powerfully!", "FOUR! Stepped out and drove!"],
      6: ["SIX! Danced down and launched!", "HUGE SIX over long-on!"],
      [-1]: ["STUMPED! Beaten by the turn!", "BOWLED! Through the gate!"],
    },
    Outswinger: {
      0: ["Outswinger, left alone.", "Shaped away, no shot offered."],
      1: ["Pushed through covers for one.", "Guided to third man."],
      2: ["Driven through the gap for two.", "Timing through the off side."],
      4: ["FOUR! Driven beautifully!", "FOUR! Timed through covers!"],
      6: ["SIX! Lofted over extra cover!", "Incredible six off an outswinger!"],
      [-1]: ["CAUGHT BEHIND! Nicked the outswinger!", "Edged and gone! Keeper takes it!"],
    },
    Inswinger: {
      0: ["Inswinger, played defensively.", "Good delivery, well blocked."],
      1: ["Tucked off the pads for one.", "Worked away to leg side."],
      2: ["Flicked through midwicket for two.", "Whipped through square leg."],
      4: ["FOUR! Flicked off the pads!", "FOUR! Through the leg side!"],
      6: ["SIX! Pulled over the infield!", "Massive six over midwicket!"],
      [-1]: ["LBW! Trapped in front!", "BOWLED through the gate! Beauty!"],
    },
    Slower: {
      0: ["Slower ball, mistimed into the ground.", "Fooled by the change of pace."],
      1: ["Pushed away for a single.", "Just about got bat on it."],
      2: ["Found the gap for two.", "Adjusted and got it through."],
      4: ["FOUR! Read it and hammered it!", "FOUR! Waited and punished it!"],
      6: ["SIX! Picked the slower ball perfectly!", "HUGE SIX! Destroyed that one!"],
      [-1]: ["CAUGHT! Mistimed the slower ball!", "Skied it! Easy catch for the fielder!"],
    },
  };

  const comments = commentary[deliveryType]?.[outcome] || [`${deliveryType} for ${outcome} run${outcome !== 1 ? "s" : ""}`];
  return comments[Math.floor(Math.random() * comments.length)];
};

export const useBowlingGame = () => {
  const [state, setState] = useState<BowlingGameState>(initialState);

  const bowl = useCallback((deliveryType: DeliveryType) => {
    setState((prev) => ({
      ...prev,
      isBowling: true,
      lastResult: null,
      lastDelivery: deliveryType,
    }));

    setTimeout(() => {
      setState((prev) => {
        const outcome = getRandomOutcome(deliveryType, prev.batsmanMood);
        const commentary = generateBowlingCommentary(deliveryType, outcome);

        let newRuns = prev.runs;
        let newWickets = prev.wickets;
        let newBalls = prev.balls + 1;
        let newOvers = prev.overs;
        let resultText = "";
        let newMood = prev.batsmanMood;

        if (outcome === -1) {
          newWickets += 1;
          resultText = "WICKET!";
          newMood = "normal"; // Reset mood on new batsman
        } else if (outcome === 6) {
          newRuns += 6;
          resultText = "SIX!";
          newMood = "aggressive"; // Gets more aggressive after six
        } else if (outcome === 4) {
          newRuns += 4;
          resultText = "FOUR!";
          newMood = Math.random() > 0.5 ? "aggressive" : "normal";
        } else {
          newRuns += outcome;
          resultText = outcome === 0 ? "DOT" : `${outcome} RUN${outcome > 1 ? "S" : ""}`;
          // Dot balls make batsman more aggressive, runs keep them normal
          if (outcome === 0) {
            newMood = Math.random() > 0.7 ? "aggressive" : "defensive";
          } else {
            newMood = "normal";
          }
        }

        if (newBalls === 6) {
          newOvers += 1;
          newBalls = 0;
        }

        let gameOver = false;
        let result: "win" | "loss" | "draw" | null = null;

        // All out - you win!
        if (newWickets >= 10) {
          gameOver = true;
          result = "win";
        }

        // Overs finished
        if (newOvers >= 10) {
          gameOver = true;
          if (newRuns < prev.target) result = "win";
          else if (newRuns >= prev.target) result = "loss";
        }

        // Target achieved - you lose
        if (newRuns >= prev.target) {
          gameOver = true;
          result = "loss";
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
          batsmanMood: newMood,
        };
      });
    }, 1200);
  }, []);

  const resetGame = useCallback(() => {
    const target = Math.floor(Math.random() * 71) + 80;
    setState({
      ...initialState,
      target,
      commentary: [`You set a target of ${target} runs. Now defend it in 10 overs!`],
    });
  }, []);

  const startGame = useCallback(() => {
    const target = Math.floor(Math.random() * 71) + 80;
    setState({
      ...initialState,
      target,
      commentary: [`You set a target of ${target} runs. Bowl them out or restrict them!`],
    });
  }, []);

  return {
    ...state,
    bowl,
    resetGame,
    startGame,
  };
};
