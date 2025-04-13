import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export function Loading({ 
  fullScreen = false, 
  message = "Đang tải...",
  onComplete,
  duration = 3000
}: LoadingProps) {
  useEffect(() => {
    if (onComplete && duration) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [onComplete, duration]);
  
  return (
    <div className={cn(
      "flex justify-center items-center",
      fullScreen ? "fixed inset-0 bg-white/90 dark:bg-gray-900/90 z-50 h-screen" : "h-full w-full"
    )}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center p-6"
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-gray-700 dark:text-gray-300 font-medium">{message}</span>
      </motion.div>
    </div>
  );
}