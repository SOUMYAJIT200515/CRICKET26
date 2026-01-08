import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DeliveryType, ShotType } from "@/hooks/useFullMatchGame";

interface FullMatchControlsProps {
  isPlayerBatting: boolean;
  isPlayerBowling: boolean;
  incomingDelivery?: DeliveryType | null;
  batsmanMood?: "aggressive" | "defensive" | "normal";
  onPlayShot: (shotType: ShotType) => void;
  onBowl: (deliveryType: DeliveryType) => void;
  onPrepareDelivery: () => void;
  disabled: boolean;
  className?: string;
}

const shots: { name: ShotType; icon: string; risk: "low" | "medium" | "high"; tip: string }[] = [
  { name: "Defensive", icon: "🛡️", risk: "low", tip: "Safe against all" },
  { name: "Drive", icon: "➡️", risk: "medium", tip: "Good vs full balls" },
  { name: "Pull", icon: "⬅️", risk: "medium", tip: "Best vs bouncers" },
  { name: "Cut", icon: "↗️", risk: "medium", tip: "For wide deliveries" },
  { name: "Sweep", icon: "↙️", risk: "high", tip: "Spin killer" },
  { name: "Slog", icon: "💥", risk: "high", tip: "High risk, high reward" },
];

const deliveries: { name: DeliveryType; icon: string; effect: string }[] = [
  { name: "Yorker", icon: "⚡", effect: "Toe-crusher" },
  { name: "Bouncer", icon: "⬆️", effect: "Intimidator" },
  { name: "Spin", icon: "🌀", effect: "Turn & bounce" },
  { name: "Outswinger", icon: "↗️", effect: "Edge seeker" },
  { name: "Inswinger", icon: "↙️", effect: "LBW trap" },
  { name: "Slower", icon: "🐢", effect: "Surprise" },
];

export const FullMatchControls = ({
  isPlayerBatting,
  isPlayerBowling,
  incomingDelivery,
  batsmanMood = "normal",
  onPlayShot,
  onBowl,
  onPrepareDelivery,
  disabled,
  className,
}: FullMatchControlsProps) => {
  // Batting controls
  if (isPlayerBatting) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider">
            Your Batting
          </h3>
          {!incomingDelivery && (
            <Button
              onClick={onPrepareDelivery}
              disabled={disabled}
              className="gold-gradient text-primary-foreground font-display animate-pulse"
            >
              Face Delivery
            </Button>
          )}
        </div>
        
        {incomingDelivery && (
          <>
            <div className="bg-card/80 rounded-lg p-3 border border-primary/30 text-center">
              <p className="text-sm text-muted-foreground">Incoming delivery:</p>
              <p className="font-display text-xl text-primary">{incomingDelivery}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
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
                  <span className="text-xl">{shot.icon}</span>
                  <span className="text-xs font-body">{shot.name}</span>
                  <span className="text-[10px] text-muted-foreground">{shot.tip}</span>
                </Button>
              ))}
            </div>
          </>
        )}
        
        <p className="text-xs text-center text-muted-foreground">
          🟢 Low Risk | 🟡 Medium Risk | 🔴 High Risk
        </p>
      </div>
    );
  }

  // Bowling controls
  if (isPlayerBowling) {
    const moodColors = {
      aggressive: "text-accent",
      defensive: "text-primary",
      normal: "text-muted-foreground",
    };

    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider">
            Your Bowling
          </h3>
          <div className="text-sm">
            <span className="text-muted-foreground">Batsman: </span>
            <span className={cn("font-display capitalize", moodColors[batsmanMood])}>
              {batsmanMood}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {deliveries.map((delivery) => (
            <Button
              key={delivery.name}
              onClick={() => onBowl(delivery.name)}
              disabled={disabled}
              variant="secondary"
              className="h-auto py-3 flex flex-col gap-1 transition-all hover:scale-105 border-2 border-accent/30"
            >
              <span className="text-xl">{delivery.icon}</span>
              <span className="text-xs font-body">{delivery.name}</span>
              <span className="text-[10px] text-muted-foreground">{delivery.effect}</span>
            </Button>
          ))}
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          🎯 Target the batsman's weakness based on their mood!
        </p>
      </div>
    );
  }

  return null;
};
