import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

/**
 * Progress component for displaying progress bars
 * Built on top of Radix UI Progress primitive for accessibility
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>} props - Progress props
 * @returns {JSX.Element} The progress component
 * 
 * @example
 * ```tsx
 * <Progress value={33} className="w-[60%]" />
 * <Progress value={66} className="w-[60%]" />
 * <Progress value={100} className="w-[60%]" />
 * ```
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
