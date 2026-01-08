import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePlayerStats } from "@/hooks/usePlayerStats";

interface StatsDisplayProps {
  onClose: () => void;
  className?: string;
}

export const StatsDisplay = ({ onClose, className }: StatsDisplayProps) => {
  const {
    stats,
    battingAverage,
    strikeRate,
    bowlingEconomy,
    bowlingAverage,
    resetStats,
  } = usePlayerStats();

  return (
    <div
      className={cn(
        "fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50",
        className
      )}
    >
      <div className="bg-card rounded-xl p-6 shadow-2xl border border-border max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-bold text-primary mb-2">
            📊 Player Statistics
          </h1>
          <p className="text-muted-foreground text-sm">Your career stats saved locally</p>
        </div>

        {/* Batting Stats */}
        <div className="bg-scoreboard rounded-lg p-4 mb-4">
          <h2 className="font-display text-lg text-primary mb-3 flex items-center gap-2">
            🏏 Batting Stats
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Innings</p>
              <p className="scoreboard-value text-xl">{stats.battingInnings}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Runs</p>
              <p className="scoreboard-value text-xl">{stats.totalRunsScored}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Highest Score</p>
              <p className="scoreboard-value text-xl">{stats.highestScore}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Average</p>
              <p className="scoreboard-value text-xl">{battingAverage}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Strike Rate</p>
              <p className="scoreboard-value text-xl">{strikeRate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Times Out</p>
              <p className="scoreboard-value text-xl">{stats.timesOut}</p>
            </div>
            <div>
              <p className="text-muted-foreground">4s / 6s</p>
              <p className="scoreboard-value text-xl">{stats.fours} / {stats.sixes}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Win/Loss</p>
              <p className="scoreboard-value text-xl text-primary">{stats.battingWins}<span className="text-muted-foreground">/</span><span className="text-accent">{stats.battingLosses}</span></p>
            </div>
          </div>
        </div>

        {/* Bowling Stats */}
        <div className="bg-scoreboard rounded-lg p-4 mb-4">
          <h2 className="font-display text-lg text-accent mb-3 flex items-center gap-2">
            🎾 Bowling Stats
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Innings</p>
              <p className="scoreboard-value text-xl">{stats.bowlingInnings}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Wickets</p>
              <p className="scoreboard-value text-xl">{stats.totalWicketsTaken}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Runs Conceded</p>
              <p className="scoreboard-value text-xl">{stats.totalRunsConceded}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Economy</p>
              <p className="scoreboard-value text-xl">{bowlingEconomy}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Average</p>
              <p className="scoreboard-value text-xl">{bowlingAverage}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Best Bowling</p>
              <p className="scoreboard-value text-xl">
                {stats.bestBowling.wickets > 0 
                  ? `${stats.bestBowling.wickets}/${stats.bestBowling.runs}` 
                  : "-"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Win/Loss</p>
              <p className="scoreboard-value text-xl text-primary">{stats.bowlingWins}<span className="text-muted-foreground">/</span><span className="text-accent">{stats.bowlingLosses}</span></p>
            </div>
          </div>
        </div>

        {/* Full Match Stats */}
        <div className="bg-scoreboard rounded-lg p-4 mb-6">
          <h2 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
            🏆 Full Match Stats
          </h2>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Played</p>
              <p className="scoreboard-value text-xl">{stats.fullMatchesPlayed}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Won</p>
              <p className="scoreboard-value text-xl text-primary">{stats.fullMatchWins}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Lost</p>
              <p className="scoreboard-value text-xl text-accent">{stats.fullMatchLosses}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={onClose}
            className="w-full gold-gradient text-primary-foreground font-display"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              if (confirm("Are you sure you want to reset all stats?")) {
                resetStats();
              }
            }}
            variant="outline"
            className="w-full font-display text-accent border-accent/30"
          >
            Reset Stats
          </Button>
        </div>
      </div>
    </div>
  );
};
