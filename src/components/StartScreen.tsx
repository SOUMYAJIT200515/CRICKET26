import { Button } from "@/components/ui/button";

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="min-h-screen field-gradient flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <div className="text-8xl mb-4">🏏</div>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-2">
          CRICKET
        </h1>
        <h2 className="font-display text-2xl md:text-3xl text-primary tracking-widest">
          SIMULATOR
        </h2>
      </div>

      <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mb-8 border border-border">
        <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider mb-4 text-center">
          How to Play
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground font-body">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Chase the target in 10 overs
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Choose your shots wisely - riskier shots = more runs but higher wicket chance
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            10 wickets and you're all out!
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Defensive shots are safe, Slog shots are risky but rewarding
          </li>
        </ul>
      </div>

      <Button
        onClick={onStart}
        size="lg"
        className="gold-gradient text-primary-foreground font-display text-xl px-12 py-6 animate-pulse-glow"
      >
        Start Match
      </Button>
    </div>
  );
};
