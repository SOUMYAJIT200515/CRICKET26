import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GameOverProps {
  result: "win" | "loss" | "draw";
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  target?: number;
  onPlayAgain: () => void;
  onBackToMenu?: () => void;
  mode?: "batting" | "bowling";
  className?: string;
}

export const GameOver = ({
  result,
  runs,
  wickets,
  overs,
  balls,
  target,
  onPlayAgain,
  onBackToMenu,
  mode = "batting",
  className,
}: GameOverProps) => {
  const getMessage = () => {
    if (target) {
      if (result === "win") return "You Won! 🎉";
      if (result === "loss") return "You Lost! 😢";
      return "Match Drawn";
    }
    return `Final Score: ${runs}/${wickets}`;
  };

  const getSubMessage = () => {
    if (target) {
      if (mode === "batting") {
        if (result === "win") return `Chased down ${target} with ${10 - wickets} wickets remaining!`;
        if (result === "loss") return `Fell short by ${target - runs} runs`;
      } else {
        if (result === "win") return `Defended ${target}! ${wickets === 10 ? "Bowled them out!" : `Restricted to ${runs}/${wickets}`}`;
        if (result === "loss") return `They chased ${target} with ${10 - wickets} wickets left!`;
      }
      return `Match ended in a draw`;
    }
    return `in ${overs}.${balls} overs`;
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50",
        className
      )}
    >
      <div className="bg-card rounded-xl p-8 shadow-2xl border border-border max-w-sm w-full mx-4 text-center">
        <div className="mb-6">
          <h1
            className={cn(
              "font-display text-4xl font-bold mb-2",
              result === "win" && "text-primary",
              result === "loss" && "text-accent",
              result === "draw" && "text-muted-foreground"
            )}
          >
            {getMessage()}
          </h1>
          <p className="text-muted-foreground">{getSubMessage()}</p>
        </div>

        <div className="bg-scoreboard rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="scoreboard-value text-5xl">{runs}</span>
            <span className="text-muted-foreground text-3xl">/</span>
            <span className="scoreboard-value text-4xl">{wickets}</span>
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            ({overs}.{balls} overs)
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={onPlayAgain}
            className="w-full gold-gradient text-primary-foreground font-display text-lg py-6 animate-pulse-glow"
          >
            Play Again
          </Button>
          {onBackToMenu && (
            <Button
              onClick={onBackToMenu}
              variant="outline"
              className="w-full font-display"
            >
              Back to Menu
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
