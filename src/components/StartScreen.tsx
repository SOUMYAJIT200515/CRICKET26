import { Button } from "@/components/ui/button";
import { useState } from "react";

interface StartScreenProps {
  onStart: (mode: "batting" | "bowling") => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  const [selectedMode, setSelectedMode] = useState<"batting" | "bowling" | null>(null);

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

      {!selectedMode ? (
        <>
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mb-8 border border-border">
            <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Choose Your Mode
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setSelectedMode("batting")}
                variant="secondary"
                className="h-auto py-6 flex flex-col gap-2 border-2 border-primary/30 hover:border-primary/60"
              >
                <span className="text-4xl">🏏</span>
                <span className="font-display text-lg">BATTING</span>
                <span className="text-xs text-muted-foreground">Chase the target</span>
              </Button>
              <Button
                onClick={() => setSelectedMode("bowling")}
                variant="secondary"
                className="h-auto py-6 flex flex-col gap-2 border-2 border-accent/30 hover:border-accent/60"
              >
                <span className="text-4xl">🎾</span>
                <span className="font-display text-lg">BOWLING</span>
                <span className="text-xs text-muted-foreground">Defend your total</span>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mb-8 border border-border">
          <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider mb-4 text-center">
            {selectedMode === "batting" ? "Batting Mode" : "Bowling Mode"}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground font-body mb-4">
            {selectedMode === "batting" ? (
              <>
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
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Defend your target in 10 overs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Choose delivery types: Yorker, Bouncer, Spin, Swing, Slower ball
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Watch the batsman's mood and exploit it!
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Take 10 wickets or restrict them below target to win
                </li>
              </>
            )}
          </ul>
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedMode(null)}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={() => onStart(selectedMode)}
              className="flex-1 gold-gradient text-primary-foreground font-display"
            >
              Start Match
            </Button>
          </div>
        </div>
      )}

      {!selectedMode && (
        <p className="text-sm text-muted-foreground text-center max-w-md">
          🔊 Sound effects included! Make sure your volume is on.
        </p>
      )}
    </div>
  );
};
