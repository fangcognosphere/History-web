import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  centered?: boolean;
}

export function LoadingSpinner({ 
  size = "md", 
  text,
  centered = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  
  return (
    <div className={cn(
      "flex flex-col items-center",
      centered && "justify-center w-full"
    )}>
      <Loader2 className={cn(
        "animate-spin text-primary",
        sizeClasses[size]
      )} />
      
      {text && (
        <span className={cn(
          "mt-2 text-gray-600 dark:text-gray-400",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base"
        )}>
          {text}
        </span>
      )}
    </div>
  );
}