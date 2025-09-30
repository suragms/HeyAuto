import { cn } from "@/lib/utils";

/**
 * Skeleton component for loading placeholders
 * Provides animated loading state with pulse animation
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Skeleton props
 * @returns {JSX.Element} The skeleton component
 * 
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-[250px]" />
 * <Skeleton className="h-4 w-[200px]" />
 * ```
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };
