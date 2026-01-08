import { cn } from "@/lib/utils";

interface InningsData {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  fours: number;
  sixes: number;
}

interface FullMatchScoreboardProps {
  firstInnings: InningsData;
  secondInnings: InningsData;
  currentInnings: 1 | 2;
  playerBattingFirst: boolean;
  target?: number | null;
  className?: string;
}

export const FullMatchScoreboard = ({
  firstInnings,
  secondInnings,
  currentInnings,
  playerBattingFirst,
  target,
  className,
}: FullMatchScoreboardProps) => {
  const getTeamLabel = (isFirst: boolean) => {
    if (playerBattingFirst) {
      return isFirst ? "You" : "Computer";
    }
    return isFirst ? "Computer" : "You";
  };

  const renderInnings = (innings: InningsData, label: string, isActive: boolean, inningsNum: number) => (
    <div
      className={cn(
        "rounded-lg p-3 transition-all",
        isActive ? "bg-card border-2 border-primary/50" : "bg-scoreboard/50"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={cn(
          "text-xs font-display uppercase",
          isActive ? "text-primary" : "text-muted-foreground"
        )}>
          {label} {inningsNum === currentInnings && "(Batting)"}
        </span>
        <span className="text-xs text-muted-foreground">
          {innings.overs}.{innings.balls} ov
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="scoreboard-value text-3xl">{innings.runs}</span>
        <span className="text-muted-foreground text-xl">/</span>
        <span className="scoreboard-value text-2xl">{innings.wickets}</span>
      </div>
      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
        <span>4s: {innings.fours}</span>
        <span>6s: {innings.sixes}</span>
      </div>
    </div>
  );

  return (
    <div className={cn("bg-scoreboard rounded-xl p-4 shadow-lg", className)}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-sm text-muted-foreground uppercase tracking-wider">
          Full Match
        </h2>
        {target && currentInnings === 2 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="font-display text-lg text-primary">{target}</p>
            <p className="text-xs text-muted-foreground">
              Need {Math.max(0, target - secondInnings.runs)} from {Math.max(0, 60 - (secondInnings.overs * 6 + secondInnings.balls))} balls
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {renderInnings(firstInnings, getTeamLabel(true), currentInnings === 1, 1)}
        {renderInnings(secondInnings, getTeamLabel(false), currentInnings === 2, 2)}
      </div>
    </div>
  );
};
