import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineLoadingProps {
  fullScreen?: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export function TimelineLoading({ 
  fullScreen = false, 
  message = "Đang tải...",
  onComplete,
  duration = 3000
}: TimelineLoadingProps) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (onComplete && duration) {
      // Tạo interval để cập nhật phần trăm
      const interval = setInterval(() => {
        setPercentage(prev => {
          const next = prev + 1;
          return next <= 100 ? next : 100;
        });
      }, duration / 100);
      
      // Tạo timeout để gọi onComplete khi hoàn thành
      const timer = setTimeout(() => {
        setPercentage(100);
        onComplete();
      }, duration);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [onComplete, duration]);
  
  return (
    <div className={cn(
      "flex justify-center items-center",
      fullScreen ? "fixed inset-0 bg-white/90 dark:bg-gray-900/90 z-50 h-screen" : "h-60"
    )}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md"
      >
        <div className="relative mb-4">
          {/* Logo xoay tròn */}
          <motion.div 
            className="w-20 h-20 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <img 
              src="https://files.catbox.moe/ta56ul.png" 
              alt="Logo" 
              className="h-16 w-16 object-contain"
            />
          </motion.div>
        </div>
        <span className="text-gray-700 dark:text-gray-300 text-lg font-medium">{message}</span>
        
        {/* Thanh loading hiển thị phần trăm */}
        <div className="mt-6 w-64 space-y-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Tiến trình</span>
            <span className="text-sm font-semibold text-primary">{percentage}%</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          
          {/* Các thanh loading bổ sung để tạo hiệu ứng động */}
          <motion.div 
            className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
            initial={{ width: "20%" }}
            animate={{ width: "80%" }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.3 }}
          >
            <div className="h-full bg-primary/60 animate-pulse"></div>
          </motion.div>
          <motion.div 
            className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
            initial={{ width: "60%" }}
            animate={{ width: "40%" }}
            transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.6 }}
          >
            <div className="h-full bg-primary/80 animate-pulse"></div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}