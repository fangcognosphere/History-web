import React, { useEffect } from "react";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HistoryLoadingProps {
  fullScreen?: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

export function HistoryLoading({ 
  fullScreen = false, 
  message = "Đang tải dữ liệu lịch sử...",
  onComplete,
  duration = 3000
}: HistoryLoadingProps) {
  useEffect(() => {
    if (onComplete && duration) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [onComplete, duration]);
  
  const historyFacts = [
    "Năm 938, Ngô Quyền đánh bại quân Nam Hán trên sông Bạch Đằng",
    "Lý Thái Tổ dời đô từ Hoa Lư về Thăng Long năm 1010",
    "Quang Trung đại phá quân Thanh trong trận Đống Đa năm 1789",
    "Hiệp định Genève chia đôi Việt Nam tại vĩ tuyến 17 năm 1954"
  ];
  
  return (
    <div className={cn(
      "flex justify-center items-center",
      fullScreen ? "fixed inset-0 bg-white/90 dark:bg-gray-900/90 z-50 h-screen" : "h-full w-full"
    )}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md max-w-md"
      >
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span className="text-gray-700 dark:text-gray-300 text-lg font-medium mb-4">{message}</span>
        
        <div className="w-full space-y-3">
          {historyFacts.map((fact, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.8, duration: 0.5 }}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
            >
              {fact}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}