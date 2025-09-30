import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Card component for displaying content in a bordered container
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Component props
 * @returns {JSX.Element} The card component
 * 
 * @example
 * ```tsx
 * <Card className="p-4">
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     Card content goes here
 *   </CardContent>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

/**
 * Card header component for card titles and descriptions
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Component props
 * @returns {JSX.Element} The card header component
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

/**
 * Card title component for card headings
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - Component props
 * @returns {JSX.Element} The card title component
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

/**
 * Card description component for card subtitles
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Component props
 * @returns {JSX.Element} The card description component
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

/**
 * Card content component for main card content
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Component props
 * @returns {JSX.Element} The card content component
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

/**
 * Card footer component for card actions and additional content
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Component props
 * @returns {JSX.Element} The card footer component
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
