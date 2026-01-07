import { cn } from "@/lib/utils";

interface CommentaryProps {
  entries: string[];
  className?: string;
}

export const Commentary = ({ entries, className }: CommentaryProps) => {
  return (
    <div className={cn("bg-card rounded-lg p-4 h-40 overflow-hidden", className)}>
      <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-2">
        Commentary
      </h3>
      <div className="space-y-1.5 overflow-y-auto h-28">
        {entries.slice(-5).reverse().map((entry, index) => (
          <p
            key={index}
            className={cn(
              "text-sm font-body",
              index === 0 ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {entry}
          </p>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            Waiting for first delivery...
          </p>
        )}
      </div>
    </div>
  );
};
