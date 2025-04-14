import * as React from "react"
import { selectDarkMode } from '@/store/darkModeSlice';
import { useSelector } from "react-redux"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const isDarkMode = useSelector(selectDarkMode);
    return (
      <input
  type={type}
  className={cn(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    isDarkMode 
      ? "dark:border-[#374151] dark:bg-[#1F2937] dark:text-[#E5E7EB] dark:placeholder:text-[#9CA3AF] dark:focus-visible:ring-[#818CF8]"
      : "",
    className
  )}
  ref={ref}
  {...props}
/>
    )
  }
)
Input.displayName = "Input"

export { Input }
