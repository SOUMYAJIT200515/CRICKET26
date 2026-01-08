import { Button } from "@/components/ui/button";
import { useState } from "react";

interface StartScreenProps {
  onStart: (mode: "batting" | "bowling" | "full-match", battingFirst?: boolean) => void;
  onShowStats: () => void;
}

export const StartScreen = ({ onStart, onShowStats }: StartScreenProps) => {
  const [selectedMode, setSelectedMode] = useState<"batting" | "bowling" | "full-match" | null>(null);
  const [tossChoice, setTossChoice] = useState<"bat" | "bowl" | null>(null);

  const handleStart = () => {
    if (selectedMode === "full-match") {
      onStart(selectedMode, tossChoice === "bat");
    } else if (selectedMode) {
      onStart(selectedMode);
    }
  };

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
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mb-4 border border-border">
            <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider mb-4 text-center">
              Choose Your Mode
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => setSelectedMode("batting")}
                variant="secondary"
                className="h-auto py-4 flex flex-col gap-2 border-2 border-primary/30 hover:border-primary/60"
              >
                <span className="text-3xl">🏏</span>
                <span className="font-display text-sm">BATTING</span>
              </Button>
              <Button
                onClick={() => setSelectedMode("bowling")}
                variant="secondary"
                className="h-auto py-4 flex flex-col gap-2 border-2 border-accent/30 hover:border-accent/60"
              >
                <span className="text-3xl">🎾</span>
                <span className="font-display text-sm">BOWLING</span>
              </Button>
              <Button
                onClick={() => setSelectedMode("full-match")}
                variant="secondary"
                className="h-auto py-4 flex flex-col gap-2 border-2 border-scoreboard-text/30 hover:border-scoreboard-text/60"
              >
                <span className="text-3xl">🏆</span>
                <span className="font-display text-sm">FULL MATCH</span>
              </Button>
            </div>
          </div>
          <Button onClick={onShowStats} variant="outline" className="mb-4">
            📊 View Stats
          </Button>
        </>
      ) : selectedMode === "full-match" && !tossChoice ? (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mb-8 border border-border">
          <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider mb-4 text-center">
            You won the toss!
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button onClick={() => setTossChoice("bat")} variant="secondary" className="h-auto py-6 flex flex-col gap-2 border-2 border-primary/30">
              <span className="text-4xl">🏏</span>
              <span className="font-display">BAT FIRST</span>
            </Button>
            <Button onClick={() => setTossChoice("bowl")} variant="secondary" className="h-auto py-6 flex flex-col gap-2 border-2 border-accent/30">
              <span className="text-4xl">🎾</span>
              <span className="font-display">BOWL FIRST</span>
            </Button>
          </div>
          <Button onClick={() => setSelectedMode(null)} variant="outline" className="w-full">Back</Button>
        </div>
      ) : (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mb-8 border border-border">
          <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider mb-4 text-center">
            {selectedMode === "batting" ? "Batting Mode" : selectedMode === "bowling" ? "Bowling Mode" : "Full Match"}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground font-body mb-4">
            {selectedMode === "full-match" ? (
              <>
                <li className="flex items-start gap-2"><span className="text-primary">•</span>Bat AND bowl - 10 overs each side</li>
                <li className="flex items-start gap-2"><span className="text-primary">•</span>See incoming delivery type when batting</li>
                <li className="flex items-start gap-2"><span className="text-primary">•</span>Watch ball trajectory after shots</li>
                <li className="flex items-start gap-2"><span className="text-primary">•</span>Stats tracked automatically!</li>
              </>
            ) : selectedMode === "batting" ? (
              <>
                <li className="flex items-start gap-2"><span className="text-primary">•</span>Chase the target in 10 overs</li>
                <li className="flex items-start gap-2"><span className="text-primary">•</span>Choose shots wisely</li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2"><span className="text-accent">•</span>Defend your target in 10 overs</li>
                <li className="flex items-start gap-2"><span className="text-accent">•</span>Watch batsman mood!</li>
              </>
            )}
          </ul>
          <div className="flex gap-2">
            <Button onClick={() => { setSelectedMode(null); setTossChoice(null); }} variant="outline" className="flex-1">Back</Button>
            <Button onClick={handleStart} className="flex-1 gold-gradient text-primary-foreground font-display">Start Match</Button>
          </div>
        </div>
      )}
    </div>
  );
};
