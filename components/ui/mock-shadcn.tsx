import * as React from "react"
import { cn } from "@/lib/utils"

// --- Button ---
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' }>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-slate-900 text-white hover:bg-slate-800",
      outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
      ghost: "hover:bg-slate-100 text-slate-700"
    }
    return (
      <button
        ref={ref}
        className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2", variants[variant], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// --- Input ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// --- Card ---
export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn("rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm", className)}>{children}</div>
}

// --- Badge ---
export function Badge({ children, active }: { children: React.ReactNode, active?: boolean }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2", 
      active ? "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-800" : "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200")}>
      {children}
    </span>
  )
}