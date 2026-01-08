import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface StartScreenProps {
  onStart: (mode: "batting" | "bowling" | "full-match", battingFirst?: boolean) => void;
  onShowStats: () => void;
}

export const StartScreen = ({ onStart, onShowStats }: StartScreenProps) => {
  const [selectedMode, setSelectedMode] = useState<"batting" | "bowling" | "full-match" | null>(null);
  const [tossState, setTossState] = useState<"none" | "flipping" | "result">("none");
  const [tossWinner, setTossWinner] = useState<"player" | "computer" | null>(null);
  const [computerChoice, setComputerChoice] = useState<"bat" | "bowl" | null>(null);
  const [playerChoice, setPlayerChoice] = useState<"bat" | "bowl" | null>(null);

  const handleToss = () => {
    setTossState("flipping");
    
    // Simulate coin flip animation
    setTimeout(() => {
      const winner = Math.random() > 0.5 ? "player" : "computer";
      setTossWinner(winner);
      
      if (winner === "computer") {
        // Computer randomly chooses
        const choice = Math.random() > 0.5 ? "bat" : "bowl";
        setComputerChoice(choice);
      }
      
      setTossState("result");
    }, 1500);
  };

  const handlePlayerChoice = (choice: "bat" | "bowl") => {
    setPlayerChoice(choice);
  };

  const handleStartMatch = () => {
    if (tossWinner === "player" && playerChoice) {
      onStart("full-match", playerChoice === "bat");
    } else if (tossWinner === "computer" && computerChoice) {
      // If computer chose to bat, player bowls first (battingFirst = false)
      // If computer chose to bowl, player bats first (battingFirst = true)
      onStart("full-match", computerChoice === "bowl");
    }
  };

  const resetToss = () => {
    setTossState("none");
    setTossWinner(null);
    setComputerChoice(null);
    setPlayerChoice(null);
    setSelectedMode(null);
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
      ) : selectedMode === "full-match" ? (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mb-8 border border-border">
          {/* Toss not started */}
          {tossState === "none" && (
            <>
              <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider mb-4 text-center">
                Time for the Toss!
              </h3>
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">🪙</div>
                <p className="text-muted-foreground text-sm">Click to flip the coin</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setSelectedMode(null)} variant="outline" className="flex-1">Back</Button>
                <Button onClick={handleToss} className="flex-1 gold-gradient text-primary-foreground font-display">Flip Coin</Button>
              </div>
            </>
          )}

          {/* Coin flipping animation */}
          {tossState === "flipping" && (
            <div className="text-center py-8">
              <div className="text-8xl animate-bounce mb-4">🪙</div>
              <p className="font-display text-xl text-primary animate-pulse">Flipping...</p>
            </div>
          )}

          {/* Toss result */}
          {tossState === "result" && (
            <>
              <h3 className="font-display text-lg text-center mb-4">
                {tossWinner === "player" ? (
                  <span className="text-primary">🎉 You won the toss!</span>
                ) : (
                  <span className="text-accent">Computer won the toss</span>
                )}
              </h3>

              {/* Player won - let them choose */}
              {tossWinner === "player" && !playerChoice && (
                <>
                  <p className="text-center text-muted-foreground mb-4">What do you want to do?</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Button onClick={() => handlePlayerChoice("bat")} variant="secondary" className="h-auto py-6 flex flex-col gap-2 border-2 border-primary/30 hover:border-primary">
                      <span className="text-4xl">🏏</span>
                      <span className="font-display">BAT FIRST</span>
                    </Button>
                    <Button onClick={() => handlePlayerChoice("bowl")} variant="secondary" className="h-auto py-6 flex flex-col gap-2 border-2 border-accent/30 hover:border-accent">
                      <span className="text-4xl">🎾</span>
                      <span className="font-display">BOWL FIRST</span>
                    </Button>
                  </div>
                </>
              )}

              {/* Player chose - show confirmation */}
              {tossWinner === "player" && playerChoice && (
                <div className="text-center mb-4">
                  <p className="text-muted-foreground mb-2">You chose to</p>
                  <p className="font-display text-2xl text-primary">
                    {playerChoice === "bat" ? "🏏 BAT FIRST" : "🎾 BOWL FIRST"}
                  </p>
                </div>
              )}

              {/* Computer won - show their choice */}
              {tossWinner === "computer" && computerChoice && (
                <div className="text-center mb-4">
                  <p className="text-muted-foreground mb-2">Computer chose to</p>
                  <p className="font-display text-2xl text-accent">
                    {computerChoice === "bat" ? "🏏 BAT FIRST" : "🎾 BOWL FIRST"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    You will {computerChoice === "bat" ? "bowl" : "bat"} first
                  </p>
                </div>
              )}

              {/* Start button */}
              {(tossWinner === "computer" || playerChoice) && (
                <div className="flex gap-2">
                  <Button onClick={resetToss} variant="outline" className="flex-1">Back</Button>
                  <Button onClick={handleStartMatch} className="flex-1 gold-gradient text-primary-foreground font-display">
                    Start Match
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mb-8 border border-border">
          <h3 className="font-display text-lg text-muted-foreground uppercase tracking-wider mb-4 text-center">
            {selectedMode === "batting" ? "Batting Mode" : "Bowling Mode"}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground font-body mb-4">
            {selectedMode === "batting" ? (
              <>
                <li className="flex items-start gap-2"><span className="text-primary">•</span>Chase the target in 10 overs</li>
                <li className="flex items-start gap-2"><span className="text-primary">•</span>Choose shots wisely - riskier shots = more runs but higher wicket chance</li>
                <li className="flex items-start gap-2"><span className="text-primary">•</span>Watch ball trajectory after each shot</li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2"><span className="text-accent">•</span>Defend your target in 10 overs</li>
                <li className="flex items-start gap-2"><span className="text-accent">•</span>Choose delivery types wisely</li>
                <li className="flex items-start gap-2"><span className="text-accent">•</span>Watch batsman mood and exploit it!</li>
              </>
            )}
          </ul>
          <div className="flex gap-2">
            <Button onClick={() => setSelectedMode(null)} variant="outline" className="flex-1">Back</Button>
            <Button onClick={() => onStart(selectedMode)} className="flex-1 gold-gradient text-primary-foreground font-display">Start Match</Button>
          </div>
        </div>
      )}
    </div>
  );
};
