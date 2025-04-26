"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const DarkModeSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {

  // Start with a null state to avoid hydration mismatch
  const [isDark, setIsDark] = useState<boolean | null>(null);

  // Initialize the state on the client side only
  useEffect(() => {
    // Check if dark mode is already enabled in HTML element
    const isDarkMode = document.documentElement.classList.contains("dark");
    const savedTheme = Cookies.get("theme");
    
    // Initialize state based on current document state or cookie
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      // Default to system preference if no cookie exists
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemPrefersDark);
      Cookies.set("theme", systemPrefersDark ? "dark" : "light");
      
      // Update HTML class if needed
      if (systemPrefersDark && !isDarkMode) {
        document.documentElement.classList.add("dark");
      } else if (!systemPrefersDark && isDarkMode) {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark === null) return;
    
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    // Update cookie
    Cookies.set("theme", newIsDark ? "dark" : "light");
    
    // Update HTML class
    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Don't render the switch until client-side initialization is complete
  if (isDark === null) {
    return <div className={cn("h-6 w-11", className)} />;
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-yellow-500" />
      <SwitchPrimitives.Root
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          isDark 
            ? "bg-blue-600" 
            : "bg-yellow-400/90",
          className
        )}
        {...props}
        ref={ref}
        onClick={toggleDarkMode}
        checked={isDark}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
            isDark 
              ? "translate-x-5" 
              : "translate-x-0"
          )}
        />
      </SwitchPrimitives.Root>
      <Moon className="h-4 w-4 text-blue-500" />
    </div>
  );
});
DarkModeSwitch.displayName = SwitchPrimitives.Root.displayName;

export { DarkModeSwitch };
