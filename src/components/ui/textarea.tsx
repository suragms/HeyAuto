import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Props for the Textarea component
 * @interface TextareaProps
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea component for multi-line text input
 * Styled textarea with consistent design and accessibility features
 * 
 * @component
 * @param {TextareaProps} props - Textarea props
 * @returns {JSX.Element} The textarea component
 * 
 * @example
 * ```tsx
 * <Textarea
 *   placeholder="Enter your message..."
 *   value={message}
 *   onChange={(e) => setMessage(e.target.value)}
 * />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
