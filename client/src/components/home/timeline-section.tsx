import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'wouter';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-mobile';
import { TimelineLoading } from '@/components/ui/timeline-loading';

interface TimelineEvent {
  year: string;
  content: string;
  position: 'left' | 'right';
  isHighlighted?: boolean;
}

export function TimelineSection() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Fetch triều đại data from API
  const { data: dynasties = [], isLoading: isDynastiesLoading } = useQuery({
    queryKey: ['/api/dynasty'],
    queryFn: async () => {
      const res = await fetch('/api/dynasty');
      if (!res.ok) throw new Error('Failed to fetch dynasties');
      return res.json();
    },
  });

  // Transform data into timeline events
  useEffect(() => {
    if (dynasties.length > 0 && !isDynastiesLoading) {
      try {
        // Get a subset of the most significant periods
        const significantDynasties = dynasties
          .filter((dynasty: any) => dynasty && dynasty.TenTrieuDai) // Đảm bảo dữ liệu hợp lệ
          .sort((a: any, b: any) => (a.BatDau || 0) - (b.BatDau || 0))
          .filter((_: any, index: number) => index % 2 === 0) // Take every other dynasty to reduce density
          .slice(0, 6); // Limit to 6 events for the homepage
        
        const events: TimelineEvent[] = significantDynasties.map((dynasty: any, index: number) => {
          // Format năm bắt đầu và kết thúc an toàn
          const startYear = dynasty.BatDau !== null && dynasty.BatDau !== undefined 
            ? dynasty.BatDau
            : 'Không rõ';
            
          const endYear = dynasty.KetThuc !== null && dynasty.KetThuc !== undefined
            ? ` - ${dynasty.KetThuc}`
            : '';
          
          // Highlight some important dynasties
          const isHighlighted = index === 0 || 
                               (dynasty.TenTrieuDai && dynasty.TenTrieuDai.includes("Lý")) || 
                               (dynasty.TenTrieuDai && dynasty.TenTrieuDai.includes("Trần"));
            
          return {
            year: `${startYear}${endYear}`,
            content: dynasty.MoTa || dynasty.TenTrieuDai || 'Không có tên',
            position: index % 2 === 0 ? 'left' : 'right',
            isHighlighted
          };
        });
        
        setTimelineEvents(events);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi xử lý dữ liệu timeline:', err);
        setError('Không thể hiển thị dòng thời gian');
        setLoading(false);
      }
    }
  }, [dynasties, isDynastiesLoading]);

  // Implement lazy loading with Intersection Observer
  useEffect(() => {
    if (timelineEvents.length === 0) return;
    
    // Start with just the first event
    setVisibleEvents([timelineEvents[0]]);
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Load more events gradually when the timeline section is visible
        const timer = setInterval(() => {
          setVisibleEvents(prev => {
            if (prev.length >= timelineEvents.length) {
              clearInterval(timer);
              return prev;
            }
            return [...prev, timelineEvents[prev.length]];
          });
        }, 500); // Add a new event every 500ms
        
        return () => clearInterval(timer);
      }
    }, { threshold: 0.1 });
    
    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }
    
    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, [timelineEvents]);

  // Fallback timeline events if no data is fetched
  const fallbackEvents: TimelineEvent[] = [
    {
      year: '939',
      content: 'Ngô Quyền đánh bại quân Nam Hán trên sông Bạch Đằng, chấm dứt 1000 năm Bắc thuộc',
      position: 'left',
      isHighlighted: true
    },
    {
      year: '1010',
      content: 'Lý Thái Tổ dời đô từ Hoa Lư về Thăng Long (Hà Nội ngày nay)',
      position: 'right',
      isHighlighted: true
    },
    {
      year: '1288',
      content: 'Trần Hưng Đạo chỉ huy quân dân đại thắng quân Nguyên Mông lần thứ ba trên sông Bạch Đằng',
      position: 'left',
      isHighlighted: true
    },
    {
      year: '1945',
      content: 'Cách mạng Tháng Tám thành công, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập',
      position: 'right',
      isHighlighted: true
    }
  ];

  // Use fallback events if there's an error or no data
  const displayEvents = visibleEvents.length > 0 ? visibleEvents : fallbackEvents;

  return (
    <section id="timeline" className="py-16 bg-gray-50 dark:bg-gray-800" ref={timelineRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-primary sm:text-4xl font-serif font-bold mb-4 text-center">Dòng Thời Gian Lịch Sử</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12">
          Khám phá những sự kiện quan trọng đã định hình nên lịch sử hàng nghìn năm của dân tộc Việt Nam
        </p>
        
        {isDynastiesLoading || loading ? (
          <TimelineLoading />
        ) : (
          <div className="relative">
            {/* Timeline center line - responsive positioning */}
            <div className={cn(
              "absolute h-full w-1 bg-gradient-to-b from-primary/90 via-primary/50 to-primary/30 rounded-full",
              isMobile 
                ? "left-[20px]" // On mobile, center line is at the left
                : "left-1/2 transform -translate-x-1/2" // On larger screens, center line is centered
            )}></div>
            
            <div className="relative">
              {displayEvents.map((event, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={cn(
                    "mb-16 flex items-center",
                    isMobile
                      ? "flex-row" // On mobile, always display in a row with dot on left
                      : event.position === 'right' ? "flex-row-reverse justify-between" : "flex-row justify-between" // On desktop, alternate positions
                  )}
                >
                  {/* Left space / event card container - responsive width */}
                  <div className={cn(
                    "order-1",
                    isMobile ? "ml-[40px]" : "w-5/12"
                  )}></div>
                  
                  {/* Dot on timeline - responsive positioning */}
                  <div className={cn(
                    "z-10 flex items-center justify-center shadow-xl rounded-full transition-transform duration-300 transform hover:scale-110",
                    "absolute",
                    isMobile 
                      ? "left-[20px] -translate-x-1/2" // Aligned to the left on mobile
                      : "left-1/2 -translate-x-1/2", // Centered on desktop
                    event.isHighlighted 
                      ? "bg-primary w-12 h-12 border-4 border-white dark:border-gray-800" 
                      : "bg-primary/80 w-10 h-10"
                  )}>
                    <Calendar className="text-white w-5 h-5" />
                  </div>
                  
                  {/* Event card - responsive width and positioning */}
                  <motion.div 
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
                    }}
                    className={cn(
                      "rounded-xl px-6 py-5 transition-all duration-300",
                      isMobile 
                        ? "ml-8 w-full max-w-[calc(100%-60px)]" // Full width with left margin on mobile
                        : "w-5/12 max-w-[450px]", // Fixed width on desktop
                      event.isHighlighted
                        ? "bg-gradient-to-r from-primary/10 to-white dark:from-primary/20 dark:to-gray-700 shadow-lg border border-primary/20"
                        : "bg-white dark:bg-gray-700 shadow-md"
                    )}
                  >
                    <div className="flex items-center mb-2">
                      <Clock className={cn(
                        "w-4 h-4 mr-2",
                        event.isHighlighted ? "text-primary" : "text-gray-400 dark:text-gray-500"
                      )} />
                      <h3 className={cn(
                        "font-bold text-lg",
                        event.isHighlighted 
                          ? "text-primary dark:text-primary-400" 
                          : "text-gray-800 dark:text-gray-200"
                      )}>
                        {event.year}
                      </h3>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {event.content}
                    </p>
                    
                    {event.isHighlighted && (
                      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-600">
                        <Link href={`/timeline?year=${event.year.split(' - ')[0]}`} className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium">
                          <span>Xem chi tiết</span>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center mt-16">
          <Link 
            href="/timeline" 
            className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white font-medium px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span>Khám phá đầy đủ dòng thời gian</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
