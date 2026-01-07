import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BattingControlsProps {
  onPlayShot: (shotType: string) => void;
  disabled: boolean;
  className?: string;
}

const shots = [
  { name: "Defensive", icon: "🛡️", risk: "low" },
  { name: "Drive", icon: "➡️", risk: "medium" },
  { name: "Pull", icon: "⬅️", risk: "medium" },
  { name: "Cut", icon: "↗️", risk: "medium" },
  { name: "Sweep", icon: "↙️", risk: "high" },
  { name: "Slog", icon: "💥", risk: "high" },
];

export const BattingControls = ({
  onPlayShot,
  disabled,
  className,
}: BattingControlsProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-display text-lg text-center text-muted-foreground uppercase tracking-wider">
        Choose Your Shot
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {shots.map((shot) => (
          <Button
            key={shot.name}
            onClick={() => onPlayShot(shot.name)}
            disabled={disabled}
            variant="secondary"
            className={cn(
              "h-auto py-3 flex flex-col gap-1 transition-all hover:scale-105",
              shot.risk === "low" && "border-2 border-primary/30",
              shot.risk === "medium" && "border-2 border-scoreboard-text/30",
              shot.risk === "high" && "border-2 border-accent/30"
            )}
          >
            <span className="text-2xl">{shot.icon}</span>
            <span className="text-xs font-body">{shot.name}</span>
          </Button>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground">
        🟢 Low Risk | 🟡 Medium Risk | 🔴 High Risk
      </p>
    </div>
  );
};
