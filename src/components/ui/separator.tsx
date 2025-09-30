import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

/**
 * Separator component for visual content separation
 * Built on top of Radix UI Separator primitive for accessibility
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>} props - Separator props
 * @returns {JSX.Element} The separator component
 * 
 * @example
 * ```tsx
 * <Separator orientation="horizontal" />
 * <Separator orientation="vertical" className="h-4" />
 * ```
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
