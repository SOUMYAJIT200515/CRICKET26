import { cn } from "@/lib/utils";

interface ScoreboardProps {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  target?: number;
  battingTeam: string;
  className?: string;
}

export const Scoreboard = ({
  runs,
  wickets,
  overs,
  balls,
  target,
  battingTeam,
  className,
}: ScoreboardProps) => {
  return (
    <div
      className={cn(
        "bg-scoreboard rounded-lg p-4 shadow-lg border border-border/50",
        className
      )}
    >
      <div className="text-center mb-3">
        <h2 className="font-display text-lg text-muted-foreground uppercase tracking-wider">
          {battingTeam}
        </h2>
      </div>

      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="scoreboard-value text-5xl">{runs}</span>
        <span className="text-muted-foreground text-3xl">/</span>
        <span className="scoreboard-value text-4xl">{wickets}</span>
      </div>

      <div className="text-center">
        <span className="text-muted-foreground text-sm">Overs: </span>
        <span className="scoreboard-value text-xl">
          {overs}.{balls}
        </span>
        <span className="text-muted-foreground text-sm"> / 10</span>
      </div>

      {target && (
        <div className="mt-3 pt-3 border-t border-border/50 text-center">
          <span className="text-muted-foreground text-sm">Target: </span>
          <span className="scoreboard-value text-xl">{target}</span>
          <div className="text-xs text-muted-foreground mt-1">
            Need {target - runs} from {60 - overs * 6 - balls} balls
          </div>
        </div>
      )}
    </div>
  );
};
