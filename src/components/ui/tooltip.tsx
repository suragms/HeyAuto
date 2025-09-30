import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

/**
 * Tooltip provider component for tooltip context
 * Must wrap the application to enable tooltip functionality
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip root component
 * Main tooltip component that manages tooltip state
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * Tooltip trigger component
 * Element that triggers the tooltip on hover or focus
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltip content component
 * The actual tooltip content that appears on hover
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>} props - Tooltip content props
 * @returns {JSX.Element} The tooltip content component
 * 
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipContent>
 *       <p>Tooltip content</p>
 *     </TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
