import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { DeliveryType } from "@/hooks/useFullMatchGame";
import { BallTrajectory } from "@/hooks/useFullMatchGame";

interface FielderPosition {
  id: string;
  name: string;
  x: number;
  y: number;
}

const fielderPositions: FielderPosition[] = [
  { id: "slip", name: "Slip", x: 30, y: 25 },
  { id: "gully", name: "Gully", x: 38, y: 18 },
  { id: "point", name: "Point", x: 42, y: 5 },
  { id: "cover", name: "Cover", x: 35, y: -15 },
  { id: "mid-off", name: "Mid Off", x: 15, y: -30 },
  { id: "mid-on", name: "Mid On", x: -15, y: -30 },
  { id: "midwicket", name: "Midwicket", x: -35, y: -15 },
  { id: "square-leg", name: "Square Leg", x: -42, y: 5 },
  { id: "fine-leg", name: "Fine Leg", x: -35, y: 25 },
  { id: "keeper", name: "Keeper", x: 0, y: 32 },
  { id: "long-on", name: "Long On", x: -25, y: -42 },
  { id: "long-off", name: "Long Off", x: 25, y: -42 },
];

interface EnhancedCricketPitchProps {
  isBowling: boolean;
  lastResult: string | null;
  deliveryType?: DeliveryType | null;
  incomingDelivery?: DeliveryType | null;
  ballTrajectory?: BallTrajectory | null;
  mode: "batting" | "bowling" | "full-match";
  isPlayerBatting?: boolean;
  className?: string;
}

export const EnhancedCricketPitch = ({
  isBowling,
  lastResult,
  deliveryType,
  incomingDelivery,
  ballTrajectory,
  mode,
  isPlayerBatting = true,
  className,
}: EnhancedCricketPitchProps) => {
  const [showBall, setShowBall] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showTrajectory, setShowTrajectory] = useState(false);
  const [ballAnimation, setBallAnimation] = useState<string>("");
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [movingFielder, setMovingFielder] = useState<string | null>(null);
  const [fielderTargetPosition, setFielderTargetPosition] = useState({ x: 0, y: 0 });
  const [showCatch, setShowCatch] = useState(false);
  const [catchPosition, setCatchPosition] = useState({ x: 0, y: 0 });
  const [showStumping, setShowStumping] = useState(false);
  const [showBowled, setShowBowled] = useState(false);

  useEffect(() => {
    if (isBowling) {
      setShowBall(true);
      setShowResult(false);
      setShowTrajectory(false);
      setShowCatch(false);

      const delivery = deliveryType || incomingDelivery;
      if (delivery) {
        const animationMap: Record<DeliveryType, string> = {
          Yorker: "animate-bowl-yorker",
          Bouncer: "animate-bowl-bouncer",
          Spin: "animate-bowl-spin",
          Outswinger: "animate-bowl-outswinger",
          Inswinger: "animate-bowl-inswinger",
          Slower: "animate-bowl-slower",
        };
        setBallAnimation(animationMap[delivery]);
      } else {
        setBallAnimation("animate-bowl");
      }
    }
  }, [isBowling, deliveryType, incomingDelivery]);

  useEffect(() => {
    if (lastResult && ballTrajectory) {
      const timer = setTimeout(() => {
        setShowResult(true);
        setShowBall(false);
        setShowTrajectory(true);
        setBallPosition({ x: ballTrajectory.x, y: ballTrajectory.y });

        // Check for bowled or stumping (ball very close to wicket and wicket result)
        const wicketDistance = Math.sqrt(
          Math.pow(ballTrajectory.x, 2) + Math.pow(ballTrajectory.y, 2)
        );
        if (lastResult === "WICKET!" && wicketDistance < 3) {
          setTimeout(() => {
            setShowBowled(true);
            setShowTrajectory(false);
          }, 500);
        } else if (lastResult === "WICKET!" && wicketDistance < 5) {
          setTimeout(() => {
            setShowStumping(true);
            setShowTrajectory(false);
          }, 500);
        }
      }, 800);
      return () => clearTimeout(timer);
    } else if (lastResult) {
      const timer = setTimeout(() => {
        setShowResult(true);
        setShowBall(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [lastResult, ballTrajectory]);

  useEffect(() => {
    if (showTrajectory && ballTrajectory) {
      // Trigger fielder movement towards the ball
      const nearestFielder = findNearestFielder(ballTrajectory.x, ballTrajectory.y);
      if (nearestFielder) {
        setMovingFielder(nearestFielder.id);
        setFielderTargetPosition({ x: ballTrajectory.x, y: ballTrajectory.y });

        // Check if catch should occur (fielder close enough to ball)
        const distance = Math.sqrt(
          Math.pow(nearestFielder.x - ballTrajectory.x, 2) +
          Math.pow(nearestFielder.y - ballTrajectory.y, 2)
        );

        // If fielder is within 10% distance of ball, trigger catch animation
        if (distance < 10) {
          setTimeout(() => {
            setShowCatch(true);
            setCatchPosition({ x: ballTrajectory.x, y: ballTrajectory.y });
            setShowTrajectory(false);
            setMovingFielder(null);
          }, 1000); // Show catch after 1 second of movement
        }
      }

      const timer = setTimeout(() => {
        setShowTrajectory(false);
        setMovingFielder(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showTrajectory, ballTrajectory]);

  useEffect(() => {
    if (showStumping) {
      const timer = setTimeout(() => {
        setShowStumping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showStumping]);

  useEffect(() => {
    if (showBowled) {
      const timer = setTimeout(() => {
        setShowBowled(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showBowled]);

  const findNearestFielder = (ballX: number, ballY: number) => {
    let nearestFielder = null;
    let minDistance = Infinity;

    fielderPositions.forEach((fielder) => {
      const distance = Math.sqrt(
        Math.pow(fielder.x - ballX, 2) + Math.pow(fielder.y - ballY, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestFielder = fielder;
      }
    });

    return nearestFielder;
  };

  const getResultColor = () => {
    if (!lastResult) return "";
    if (lastResult === "WICKET!") return isPlayerBatting ? "text-accent" : "text-primary";
    if (lastResult === "SIX!" || lastResult === "FOUR!") return isPlayerBatting ? "text-primary" : "text-accent";
    return "text-foreground";
  };

  const getDeliveryIndicator = () => {
    if (!incomingDelivery || !isPlayerBatting) return null;
    
    const deliveryInfo: Record<DeliveryType, { icon: string; tip: string }> = {
      Yorker: { icon: "⚡", tip: "Low & fast - Defensive or Drive" },
      Bouncer: { icon: "⬆️", tip: "Short & high - Pull or Duck" },
      Spin: { icon: "🌀", tip: "Turn expected - Sweep or Drive" },
      Outswinger: { icon: "↗️", tip: "Moving away - Cover drive" },
      Inswinger: { icon: "↙️", tip: "Coming in - Flick or Defend" },
      Slower: { icon: "🐢", tip: "Change of pace - Wait for it" },
    };
    
    const info = deliveryInfo[incomingDelivery];
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-card/95 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/50 animate-pulse">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{info.icon}</span>
          <div>
            <p className="font-display text-primary text-sm">{incomingDelivery}</p>
            <p className="text-xs text-muted-foreground">{info.tip}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-md mx-auto aspect-square rounded-full field-gradient overflow-hidden",
        className
      )}
    >
      {/* Field circles */}
      <div className="absolute inset-[10%] rounded-full border-2 border-pitch-stripe/30" />
      <div className="absolute inset-[30%] rounded-full border-2 border-pitch-stripe/20" />

      {/* Fielders */}
      {fielderPositions.map((fielder) => {
        const isMoving = movingFielder === fielder.id;
        return (
          <div
            key={fielder.id}
            className={cn(
              "absolute w-6 h-6 flex items-center justify-center transition-all duration-300",
              isMoving && "animate-fielder-move"
            )}
            style={{
              left: isMoving
                ? `calc(50% + ${fielderTargetPosition.x}%)`
                : `calc(50% + ${fielder.x}%)`,
              top: isMoving
                ? `calc(50% + ${fielderTargetPosition.y}%)`
                : `calc(50% + ${fielder.y}%)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative group">
              <div className="w-5 h-5 rounded-full bg-blue-500/80 border-2 border-white/50 flex items-center justify-center text-[8px] text-white font-bold shadow-lg">
                {fielder.id === "keeper" ? "🧤" : "👤"}
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {fielder.name}
              </div>
            </div>
          </div>
        );
      })}

      {/* Pitch strip */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-36 bg-pitch-stripe rounded-sm">
        <div className="absolute inset-0 flex flex-col justify-evenly">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-0.5 w-full",
                i % 2 === 0 ? "bg-pitch/50" : "bg-transparent"
              )}
            />
          ))}
        </div>

        {/* Creases */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-crease" />
        <div className="absolute bottom-3 left-0 right-0 h-0.5 bg-crease" />

        {/* Wickets */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-0.5 h-3 bg-wicket rounded-t-sm" />
          ))}
        </div>
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-0.5 h-3 bg-wicket rounded-b-sm" />
          ))}
        </div>
      </div>

      {/* Batsman */}
      <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 z-10">
        <div className="text-3xl">🏏</div>
      </div>

      {/* Bowler */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-6 rounded-full bg-ball ball-shadow flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
        </div>
      </div>

      {/* Incoming delivery indicator */}
      {getDeliveryIndicator()}

      {/* Ball animation */}
      {showBall && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className={cn("w-5 h-5 rounded-full bg-ball ball-shadow", ballAnimation)} />
        </div>
      )}

      {/* Ball trajectory visualization */}
      {showTrajectory && ballTrajectory && (
        <>
          {/* Trajectory line */}
          <svg className="absolute inset-0 w-full h-full z-15 pointer-events-none">
            <line
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${ballPosition.x}%)`}
              y2={`calc(50% + ${ballPosition.y}%)`}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-fade-in"
            />
          </svg>

          {/* Ball final position */}
          <div
            className="absolute w-4 h-4 rounded-full bg-ball ball-shadow z-20 animate-bounce"
            style={{
              left: `calc(50% + ${ballPosition.x}%)`,
              top: `calc(50% + ${ballPosition.y}%)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </>
      )}

      {/* Catch animation */}
      {showCatch && (
        <div
          className="absolute z-25 animate-bounce-ball"
          style={{
            left: `calc(50% + ${catchPosition.x}%)`,
            top: `calc(50% + ${catchPosition.y}%)`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Fielder catching */}
            <div className="w-8 h-8 rounded-full bg-blue-500/90 border-2 border-white/60 flex items-center justify-center text-sm text-white font-bold shadow-lg animate-pulse">
              🧤
            </div>
            {/* Ball in hand */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-ball ball-shadow animate-bounce" />
          </div>
        </div>
      )}

      {/* Stumping animation */}
      {showStumping && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-25">
          {/* Keeper breaking wicket */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30">
            <div className="w-6 h-6 rounded-full bg-blue-500/90 border-2 border-white/60 flex items-center justify-center text-xs text-white font-bold shadow-lg animate-pulse">
              🧤
            </div>
          </div>

          {/* Stamp scatter effect */}
          <div className="relative">
            {/* Top wicket stamp */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-3 bg-wicket rounded-b-sm animate-bounce origin-top animate-ping" />
            <div className="absolute -top-6 left-[calc(50%-2px)] w-1 h-3 bg-wicket rounded-b-sm animate-bounce origin-top animate-ping" style={{ animationDelay: '0.1s' }} />
            <div className="absolute -top-8 left-[calc(50%+2px)] w-1 h-3 bg-wicket rounded-b-sm animate-bounce origin-top animate-ping" style={{ animationDelay: '0.2s' }} />

            {/* Bottom wicket stamp */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-3 bg-wicket rounded-t-sm animate-bounce origin-bottom animate-ping" />
            <div className="absolute -bottom-6 left-[calc(50%-2px)] w-1 h-3 bg-wicket rounded-t-sm animate-bounce origin-bottom animate-ping" style={{ animationDelay: '0.1s' }} />
            <div className="absolute -bottom-8 left-[calc(50%+2px)] w-1 h-3 bg-wicket rounded-t-sm animate-bounce origin-bottom animate-ping" style={{ animationDelay: '0.2s' }} />

            {/* Side scatter stamps */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-6 w-1 h-3 bg-wicket rounded-sm animate-bounce origin-left animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute top-1/2 -translate-y-1/2 -right-6 w-1 h-3 bg-wicket rounded-sm animate-bounce origin-right animate-ping" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}

      {/* Bowled animation */}
      {showBowled && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-25">
          {/* Ball hitting wicket */}
          <div className="absolute left-1/2 -translate-x-1/2 z-30">
            <div className="w-5 h-5 rounded-full bg-ball ball-shadow animate-bounce" />
          </div>

          {/* Stamp scatter effect */}
          <div className="relative">
            {/* Top wicket stamp */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-3 bg-wicket rounded-b-sm animate-bounce origin-top animate-ping" />
            <div className="absolute -top-6 left-[calc(50%-2px)] w-1 h-3 bg-wicket rounded-b-sm animate-bounce origin-top animate-ping" style={{ animationDelay: '0.1s' }} />
            <div className="absolute -top-8 left-[calc(50%+2px)] w-1 h-3 bg-wicket rounded-b-sm animate-bounce origin-top animate-ping" style={{ animationDelay: '0.2s' }} />

            {/* Bottom wicket stamp */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-3 bg-wicket rounded-t-sm animate-bounce origin-bottom animate-ping" />
            <div className="absolute -bottom-6 left-[calc(50%-2px)] w-1 h-3 bg-wicket rounded-t-sm animate-bounce origin-bottom animate-ping" style={{ animationDelay: '0.1s' }} />
            <div className="absolute -bottom-8 left-[calc(50%+2px)] w-1 h-3 bg-wicket rounded-t-sm animate-bounce origin-bottom animate-ping" style={{ animationDelay: '0.2s' }} />

            {/* Side scatter stamps */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-6 w-1 h-3 bg-wicket rounded-sm animate-bounce origin-left animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute top-1/2 -translate-y-1/2 -right-6 w-1 h-3 bg-wicket rounded-sm animate-bounce origin-right animate-ping" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}

      {/* Result display */}
      {showResult && lastResult && (
        <div className="absolute inset-0 flex items-center justify-center z-25">
          <div
            className={cn(
              "font-display text-3xl font-bold animate-bounce-ball px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm",
              getResultColor()
            )}
          >
            {lastResult}
          </div>
        </div>
      )}
    </div>
  );
};
