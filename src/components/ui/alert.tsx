import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Alert variant styles using class-variance-authority
 * Defines different alert styles and variants
 */
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Alert component for displaying important messages
 * Built with accessibility features and multiple variants
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>} props - Alert props
 * @returns {JSX.Element} The alert component
 * 
 * @example
 * ```tsx
 * <Alert variant="destructive">
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 * ```
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

/**
 * Alert title component for alert headings
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - Alert title props
 * @returns {JSX.Element} The alert title component
 */
const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

/**
 * Alert description component for alert content
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Alert description props
 * @returns {JSX.Element} The alert description component
 */
const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
