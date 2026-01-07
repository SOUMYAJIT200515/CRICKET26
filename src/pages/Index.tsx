import { useState, useEffect } from "react";
import { Scoreboard } from "@/components/Scoreboard";
import { CricketPitch } from "@/components/CricketPitch";
import { BattingControls } from "@/components/BattingControls";
import { BowlingControls } from "@/components/BowlingControls";
import { Commentary } from "@/components/Commentary";
import { GameOver } from "@/components/GameOver";
import { StartScreen } from "@/components/StartScreen";
import { useCricketGame } from "@/hooks/useCricketGame";
import { useBowlingGame, DeliveryType } from "@/hooks/useBowlingGame";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<"batting" | "bowling">("batting");
  
  const battingGame = useCricketGame();
  const bowlingGame = useBowlingGame();
  const sounds = useSoundEffects();

  // Current game state based on mode
  const currentGame = gameMode === "batting" ? battingGame : bowlingGame;
  const { runs, wickets, overs, balls, target, isBowling, lastResult, commentary, gameOver, result } = currentGame;

  // Play sounds on result changes
  useEffect(() => {
    if (lastResult) {
      if (lastResult === "WICKET!") {
        sounds.playWicketSound();
      } else if (lastResult === "SIX!") {
        sounds.playSixSound();
      } else if (lastResult === "FOUR!") {
        sounds.playBoundarySound();
      } else if (lastResult === "DOT") {
        sounds.playDotBallSound();
      } else {
        sounds.playBatHitSound();
      }
    }
  }, [lastResult, sounds]);

  // Play bowl sound when bowling starts
  useEffect(() => {
    if (isBowling) {
      sounds.playBowlSound();
    }
  }, [isBowling, sounds]);

  // Play crowd cheer on game over win
  useEffect(() => {
    if (gameOver && result === "win") {
      setTimeout(() => sounds.playCrowdCheer(), 500);
    }
  }, [gameOver, result, sounds]);

  const handleStart = (mode: "batting" | "bowling") => {
    setGameMode(mode);
    if (mode === "batting") {
      battingGame.startGame();
    } else {
      bowlingGame.startGame();
    }
    setGameStarted(true);
  };

  const handlePlayAgain = () => {
    if (gameMode === "batting") {
      battingGame.resetGame();
    } else {
      bowlingGame.resetGame();
    }
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  if (!gameStarted) {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen field-gradient">
      <div className="container max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="font-display text-2xl text-foreground tracking-wider">
            🏏 CRICKET SIMULATOR
          </h1>
          <p className="text-sm text-muted-foreground">
            {gameMode === "batting" ? "Batting Mode" : "Bowling Mode"}
          </p>
        </div>

        {/* Scoreboard */}
        <Scoreboard
          runs={runs}
          wickets={wickets}
          overs={overs}
          balls={balls}
          target={target || undefined}
          battingTeam={gameMode === "batting" ? "Your Team" : "Computer"}
          className="mb-6"
        />

        {/* Cricket Pitch */}
        <CricketPitch
          isBowling={isBowling}
          lastResult={lastResult}
          deliveryType={gameMode === "bowling" ? (bowlingGame as any).lastDelivery : undefined}
          mode={gameMode}
          className="mb-6"
        />

        {/* Controls */}
        {gameMode === "batting" ? (
          <BattingControls
            onPlayShot={battingGame.playShot}
            disabled={isBowling || gameOver}
            className="mb-6"
          />
        ) : (
          <BowlingControls
            onBowl={(d: DeliveryType) => bowlingGame.bowl(d)}
            disabled={isBowling || gameOver}
            batsmanMood={(bowlingGame as any).batsmanMood}
            className="mb-6"
          />
        )}

        {/* Commentary */}
        <Commentary entries={commentary} />
      </div>

      {/* Game Over Modal */}
      {gameOver && result && (
        <GameOver
          result={result}
          runs={runs}
          wickets={wickets}
          overs={overs}
          balls={balls}
          target={target || undefined}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
          mode={gameMode}
        />
      )}
    </div>
  );
};

export default Index;
