import { useState } from "react";
import { Scoreboard } from "@/components/Scoreboard";
import { CricketPitch } from "@/components/CricketPitch";
import { BattingControls } from "@/components/BattingControls";
import { Commentary } from "@/components/Commentary";
import { GameOver } from "@/components/GameOver";
import { StartScreen } from "@/components/StartScreen";
import { useCricketGame } from "@/hooks/useCricketGame";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const {
    runs,
    wickets,
    overs,
    balls,
    target,
    isBowling,
    lastResult,
    commentary,
    gameOver,
    result,
    playShot,
    resetGame,
    startGame,
  } = useCricketGame();

  const handleStart = () => {
    startGame();
    setGameStarted(true);
  };

  const handlePlayAgain = () => {
    resetGame();
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
        </div>

        {/* Scoreboard */}
        <Scoreboard
          runs={runs}
          wickets={wickets}
          overs={overs}
          balls={balls}
          target={target || undefined}
          battingTeam="Your Team"
          className="mb-6"
        />

        {/* Cricket Pitch */}
        <CricketPitch
          isBowling={isBowling}
          lastResult={lastResult}
          className="mb-6"
        />

        {/* Batting Controls */}
        <BattingControls
          onPlayShot={playShot}
          disabled={isBowling || gameOver}
          className="mb-6"
        />

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
        />
      )}
    </div>
  );
};

export default Index;
