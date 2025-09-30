import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

/**
 * Scroll area component for custom scrollbars
 * Built on top of Radix UI ScrollArea primitive for accessibility
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>} props - Scroll area props
 * @returns {JSX.Element} The scroll area component
 * 
 * @example
 * ```tsx
 * <ScrollArea className="h-72 w-48 rounded-md border">
 *   <div className="p-4">
 *     <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
 *     {tags.map((tag) => (
 *       <div key={tag} className="text-sm">
 *         {tag}
 *       </div>
 *     ))}
 *   </div>
 * </ScrollArea>
 * ```
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">{children}</ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

/**
 * Scroll bar component for scroll area
 * Custom scrollbar with consistent styling
 * 
 * @component
 * @param {React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>} props - Scroll bar props
 * @returns {JSX.Element} The scroll bar component
 */
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
