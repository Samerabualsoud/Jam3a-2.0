import * as React from "react"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

// Create a simplified version that doesn't rely on the external input-otp package
const InputOTP = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    value?: string;
    maxLength?: number;
    onChange?: (value: string) => void;
  }
>(({ className, containerClassName, value = "", maxLength = 6, onChange, ...props }, ref) => {
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName
      )}
      {...props}
    >
      <InputOTPGroup>
        {Array.from({ length: maxLength }).map((_, i) => (
          <React.Fragment key={i}>
            <InputOTPSlot index={i} char={value[i] || ""} isActive={false} />
            {i !== maxLength - 1 && <InputOTPSeparator />}
          </React.Fragment>
        ))}
      </InputOTPGroup>
    </div>
  );
});
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { 
    index: number;
    char: string;
    isActive: boolean;
  }
>(({ index, className, char, isActive, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
