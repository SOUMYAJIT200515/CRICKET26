import { useState, useEffect } from "react";
import { Scoreboard } from "@/components/Scoreboard";
import { CricketPitch } from "@/components/CricketPitch";
import { BattingControls } from "@/components/BattingControls";
import { BowlingControls } from "@/components/BowlingControls";
import { Commentary } from "@/components/Commentary";
import { GameOver } from "@/components/GameOver";
import { StartScreen } from "@/components/StartScreen";
import { StatsDisplay } from "@/components/StatsDisplay";
import { EnhancedCricketPitch } from "@/components/EnhancedCricketPitch";
import { FullMatchScoreboard } from "@/components/FullMatchScoreboard";
import { FullMatchControls } from "@/components/FullMatchControls";
import { useCricketGame } from "@/hooks/useCricketGame";
import { useBowlingGame, DeliveryType } from "@/hooks/useBowlingGame";
import { useFullMatchGame, ShotType } from "@/hooks/useFullMatchGame";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { usePlayerStats } from "@/hooks/usePlayerStats";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<"batting" | "bowling" | "full-match">("batting");
  const [showStats, setShowStats] = useState(false);
  
  const battingGame = useCricketGame();
  const bowlingGame = useBowlingGame();
  const fullMatchGame = useFullMatchGame();
  const sounds = useSoundEffects();
  const playerStats = usePlayerStats();

  const currentGame = gameMode === "full-match" ? fullMatchGame : gameMode === "batting" ? battingGame : bowlingGame;
  const { isBowling, lastResult, commentary, gameOver, result } = currentGame;

  useEffect(() => {
    if (lastResult) {
      if (lastResult === "WICKET!") sounds.playWicketSound();
      else if (lastResult === "SIX!") sounds.playSixSound();
      else if (lastResult === "FOUR!") sounds.playBoundarySound();
      else if (lastResult === "DOT") sounds.playDotBallSound();
      else sounds.playBatHitSound();
    }
  }, [lastResult, sounds]);

  useEffect(() => {
    if (isBowling) sounds.playBowlSound();
  }, [isBowling, sounds]);

  useEffect(() => {
    if (gameOver && result === "win") setTimeout(() => sounds.playCrowdCheer(), 500);
  }, [gameOver, result, sounds]);

  // Update stats on game over
  useEffect(() => {
    if (gameOver && result) {
      const won = result === "win";
      if (gameMode === "batting") {
        const g = battingGame;
        playerStats.updateBattingStats(g.runs, g.overs * 6 + g.balls, g.wickets >= 10, 0, 0, won);
      } else if (gameMode === "bowling") {
        const g = bowlingGame;
        playerStats.updateBowlingStats(g.runs, g.overs * 6 + g.balls, g.wickets, won);
      } else {
        playerStats.updateFullMatchStats(won);
      }
    }
  }, [gameOver, result, gameMode]);

  const handleStart = (mode: "batting" | "bowling" | "full-match", battingFirst?: boolean) => {
    setGameMode(mode);
    if (mode === "batting") battingGame.startGame();
    else if (mode === "bowling") bowlingGame.startGame();
    else fullMatchGame.startGame(battingFirst ?? true);
    setGameStarted(true);
  };

  const handlePlayAgain = () => {
    if (gameMode === "batting") battingGame.resetGame();
    else if (gameMode === "bowling") bowlingGame.resetGame();
    else fullMatchGame.resetGame();
  };

  const handleBackToMenu = () => setGameStarted(false);

  if (showStats) return <StatsDisplay onClose={() => setShowStats(false)} />;
  if (!gameStarted) return <StartScreen onStart={handleStart} onShowStats={() => setShowStats(true)} />;

  // Full match mode
  if (gameMode === "full-match") {
    return (
      <div className="min-h-screen field-gradient">
        <div className="container max-w-lg mx-auto px-4 py-6">
          <div className="text-center mb-4">
            <h1 className="font-display text-2xl text-foreground tracking-wider">🏏 FULL MATCH</h1>
            <p className="text-sm text-muted-foreground">
              {fullMatchGame.isPlayerBatting ? "Your Batting" : "Your Bowling"}
            </p>
          </div>
          <FullMatchScoreboard
            firstInnings={fullMatchGame.firstInnings}
            secondInnings={fullMatchGame.secondInnings}
            currentInnings={fullMatchGame.currentInnings}
            playerBattingFirst={fullMatchGame.playerBattingFirst}
            target={fullMatchGame.target}
            className="mb-4"
          />
          <EnhancedCricketPitch
            isBowling={isBowling}
            lastResult={lastResult}
            deliveryType={fullMatchGame.lastDelivery}
            incomingDelivery={fullMatchGame.incomingDelivery}
            ballTrajectory={fullMatchGame.ballTrajectory}
            mode="full-match"
            isPlayerBatting={fullMatchGame.isPlayerBatting}
            className="mb-4"
          />
          <FullMatchControls
            isPlayerBatting={fullMatchGame.isPlayerBatting}
            isPlayerBowling={fullMatchGame.isPlayerBowling}
            incomingDelivery={fullMatchGame.incomingDelivery}
            batsmanMood={fullMatchGame.batsmanMood}
            onPlayShot={(s: ShotType) => fullMatchGame.playShot(s)}
            onBowl={(d: DeliveryType) => fullMatchGame.bowl(d)}
            onPrepareDelivery={fullMatchGame.prepareDelivery}
            disabled={isBowling || gameOver}
            className="mb-4"
          />
          <Commentary entries={commentary} />
        </div>
        {gameOver && result && (
          <GameOver
            result={result}
            runs={fullMatchGame.secondInnings.runs}
            wickets={fullMatchGame.secondInnings.wickets}
            overs={fullMatchGame.secondInnings.overs}
            balls={fullMatchGame.secondInnings.balls}
            target={fullMatchGame.firstInnings.runs + 1}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={handleBackToMenu}
            mode="full-match"
          />
        )}
      </div>
    );
  }

  // Batting/Bowling modes
  const runs = gameMode === "batting" ? battingGame.runs : bowlingGame.runs;
  const wickets = gameMode === "batting" ? battingGame.wickets : bowlingGame.wickets;
  const overs = gameMode === "batting" ? battingGame.overs : bowlingGame.overs;
  const balls = gameMode === "batting" ? battingGame.balls : bowlingGame.balls;
  const target = gameMode === "batting" ? battingGame.target : bowlingGame.target;

  return (
    <div className="min-h-screen field-gradient">
      <div className="container max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-4">
          <h1 className="font-display text-2xl text-foreground tracking-wider">🏏 CRICKET SIMULATOR</h1>
          <p className="text-sm text-muted-foreground">{gameMode === "batting" ? "Batting Mode" : "Bowling Mode"}</p>
        </div>
        <Scoreboard runs={runs} wickets={wickets} overs={overs} balls={balls} target={target || undefined} battingTeam={gameMode === "batting" ? "Your Team" : "Computer"} className="mb-6" />
        <CricketPitch isBowling={isBowling} lastResult={lastResult} deliveryType={gameMode === "bowling" ? (bowlingGame as any).lastDelivery : undefined} mode={gameMode} className="mb-6" />
        {gameMode === "batting" ? (
          <BattingControls onPlayShot={battingGame.playShot} disabled={isBowling || gameOver} className="mb-6" />
        ) : (
          <BowlingControls onBowl={(d: DeliveryType) => bowlingGame.bowl(d)} disabled={isBowling || gameOver} batsmanMood={(bowlingGame as any).batsmanMood} className="mb-6" />
        )}
        <Commentary entries={commentary} />
      </div>
      {gameOver && result && (
        <GameOver result={result} runs={runs} wickets={wickets} overs={overs} balls={balls} target={target || undefined} onPlayAgain={handlePlayAgain} onBackToMenu={handleBackToMenu} mode={gameMode} />
      )}
    </div>
  );
};

export default Index;
