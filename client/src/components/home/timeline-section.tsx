import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'wouter';
import { Loader2 } from 'lucide-react';

interface TimelineEvent {
  year: string;
  content: string;
  position: 'left' | 'right';
}

export function TimelineSection() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
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
            
          return {
            year: `${startYear}${endYear}`,
            content: dynasty.TenTrieuDai || 'Không có tên',
            position: index % 2 === 0 ? 'left' : 'right'
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
      position: 'left'
    },
    {
      year: '1010',
      content: 'Lý Thái Tổ dời đô từ Hoa Lư về Thăng Long (Hà Nội ngày nay)',
      position: 'right'
    },
    {
      year: '1288',
      content: 'Trần Hưng Đạo chỉ huy quân dân đại thắng quân Nguyên Mông lần thứ ba trên sông Bạch Đằng',
      position: 'left'
    },
    {
      year: '1945',
      content: 'Cách mạng Tháng Tám thành công, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập',
      position: 'right'
    }
  ];

  // Use fallback events if there's an error or no data
  const displayEvents = visibleEvents.length > 0 ? visibleEvents : fallbackEvents;

  return (
    <section id="timeline" className="py-16 bg-gray-50 dark:bg-gray-800" ref={timelineRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-primary sm:text-4xl font-serif font-bold mb-10 text-center">Dòng Thời Gian Lịch Sử</h2>
        
        {isDynastiesLoading || loading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Đang tải dòng thời gian...</span>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200 dark:bg-primary-900"></div>
            
            <div className="relative">
              {displayEvents.map((event, index) => (
                <div 
                  key={index} 
                  className={`mb-10 flex justify-between items-center w-full ${
                    event.position === 'right' ? 'flex-row-reverse' : ''
                  } transition-all duration-500 opacity-100 transform translate-y-0`}
                  style={{
                    animationDelay: `${index * 0.3}s`,
                  }}
                >
                  <div className="order-1 w-5/12"></div>
                  <div className="z-10 flex items-center justify-center order-1 bg-primary shadow-xl w-10 h-10 rounded-full">
                    <h1 className="mx-auto text-white font-semibold text-lg">{index + 1}</h1>
                  </div>
                  <div className="order-1 bg-white dark:bg-gray-700 rounded-lg shadow-md w-5/12 px-6 py-5 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-primary dark:text-primary-400 text-lg">{event.year}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{event.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link href="/timeline" className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            <span>Xem đầy đủ dòng thời gian</span>
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
