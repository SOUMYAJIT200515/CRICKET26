import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CricketPitchProps {
  isBowling: boolean;
  lastResult: string | null;
  className?: string;
}

export const CricketPitch = ({
  isBowling,
  lastResult,
  className,
}: CricketPitchProps) => {
  const [showBall, setShowBall] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isBowling) {
      setShowBall(true);
      setShowResult(false);
    }
  }, [isBowling]);

  useEffect(() => {
    if (lastResult) {
      const timer = setTimeout(() => {
        setShowResult(true);
        setShowBall(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [lastResult]);

  const getResultColor = () => {
    if (!lastResult) return "";
    if (lastResult === "WICKET!") return "text-accent";
    if (lastResult === "SIX!" || lastResult === "FOUR!") return "text-primary";
    return "text-foreground";
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-md mx-auto aspect-[2/3] rounded-[50%] field-gradient overflow-hidden",
        className
      )}
    >
      {/* Field circles */}
      <div className="absolute inset-[15%] rounded-full border-2 border-pitch-stripe/30" />
      <div className="absolute inset-[35%] rounded-full border-2 border-pitch-stripe/20" />

      {/* Pitch strip */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-48 bg-pitch-stripe rounded-sm">
        {/* Pitch stripes */}
        <div className="absolute inset-0 flex flex-col justify-evenly">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 w-full",
                i % 2 === 0 ? "bg-pitch/50" : "bg-transparent"
              )}
            />
          ))}
        </div>

        {/* Creases */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-crease" />
        <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-crease" />

        {/* Wickets */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-4 bg-wicket rounded-t-sm" />
          ))}
        </div>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-4 bg-wicket rounded-b-sm" />
          ))}
        </div>
      </div>

      {/* Ball animation */}
      {showBall && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-6 h-6 rounded-full bg-ball ball-shadow animate-bowl" />
        </div>
      )}

      {/* Result display */}
      {showResult && lastResult && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div
            className={cn(
              "font-display text-4xl font-bold animate-bounce-ball",
              getResultColor()
            )}
          >
            {lastResult}
          </div>
        </div>
      )}

      {/* Batsman silhouette */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <div className="text-4xl">🏏</div>
      </div>
    </div>
  );
};
