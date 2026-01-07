import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DeliveryType } from "@/hooks/useBowlingGame";

interface BowlingControlsProps {
  onBowl: (deliveryType: DeliveryType) => void;
  disabled: boolean;
  batsmanMood: "aggressive" | "defensive" | "normal";
  className?: string;
}

const deliveries: { name: DeliveryType; icon: string; description: string }[] = [
  { name: "Yorker", icon: "⬇️", description: "Toe-crusher" },
  { name: "Bouncer", icon: "⬆️", description: "Short & fast" },
  { name: "Spin", icon: "🌀", description: "Turn & flight" },
  { name: "Outswinger", icon: "↗️", description: "Away swing" },
  { name: "Inswinger", icon: "↙️", description: "Into pads" },
  { name: "Slower", icon: "🐢", description: "Change of pace" },
];

export const BowlingControls = ({
  onBowl,
  disabled,
  batsmanMood,
  className,
}: BowlingControlsProps) => {
  const getMoodDisplay = () => {
    switch (batsmanMood) {
      case "aggressive":
        return { emoji: "🔥", text: "Aggressive", color: "text-accent" };
      case "defensive":
        return { emoji: "🛡️", text: "Defensive", color: "text-primary" };
      default:
        return { emoji: "😐", text: "Normal", color: "text-muted-foreground" };
    }
  };

  const mood = getMoodDisplay();

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider">
          Choose Your Delivery
        </h3>
        <div className={cn("flex items-center gap-2 text-sm", mood.color)}>
          <span>{mood.emoji}</span>
          <span className="font-body">Batsman: {mood.text}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {deliveries.map((delivery) => (
          <Button
            key={delivery.name}
            onClick={() => onBowl(delivery.name)}
            disabled={disabled}
            variant="secondary"
            className={cn(
              "h-auto py-3 flex flex-col gap-1 transition-all hover:scale-105",
              "border-2 border-primary/30 hover:border-primary/60"
            )}
          >
            <span className="text-2xl">{delivery.icon}</span>
            <span className="text-xs font-body font-semibold">{delivery.name}</span>
            <span className="text-[10px] font-body text-muted-foreground">{delivery.description}</span>
          </Button>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground">
        🎯 Watch the batsman's mood and pick your delivery wisely!
      </p>
    </div>
  );
};
