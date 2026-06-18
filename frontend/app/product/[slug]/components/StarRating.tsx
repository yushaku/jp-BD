import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  max = 5,
  size = "md",
  className,
}: {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass =
    size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`${value.toFixed(1)} trên ${max} sao`}
    >
      {Array.from({ length: max }).map((_, index) => {
        const filled = value >= index + 1;
        const half = !filled && value >= index + 0.5;

        return (
          <Star
            key={index}
            className={cn(
              sizeClass,
              filled || half
                ? "fill-jp-gold text-jp-gold"
                : "fill-jp-border text-jp-border",
              half && "opacity-70",
            )}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

export function InteractiveStarRating({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Chọn số sao">
      {Array.from({ length: 5 }).map((_, index) => {
        const star = index + 1;
        const active = star <= value;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${star} sao`}
            disabled={disabled}
            onClick={() => onChange(star)}
            className="rounded p-0.5 transition hover:scale-110 disabled:opacity-50"
          >
            <Star
              className={cn(
                "size-6",
                active ? "fill-jp-gold text-jp-gold" : "text-jp-border",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
