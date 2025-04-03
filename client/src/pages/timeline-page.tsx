import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TimelineItem {
  id: number;
  name: string;
  startYear: number;
  endYear: number | null;
  description: string;
  capital?: string;
}

export default function TimelinePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<TimelineItem[]>([]);
  const [visibleRange, setVisibleRange] = useState({ start: -3000, end: 2023 });
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch all periods from API
  const { data: periods = [], isLoading: isPeriodsLoading } = useQuery({
    queryKey: ['/api/trieudai'],
    queryFn: async () => {
      const res = await fetch('/api/trieudai');
      if (!res.ok) throw new Error('Failed to fetch periods');
      return res.json();
    },
  });

  // Transform the data to timeline format
  useEffect(() => {
    if (periods.length > 0) {
      const items: TimelineItem[] = periods.map((period: any) => ({
        id: period.id,
        name: period.TenTrieuDai,
        startYear: period.BatDau,
        endYear: period.KetThuc,
        description: period.MoTa || 'Không có mô tả',
        capital: period.kinhDo
      })).sort((a: TimelineItem, b: TimelineItem) => a.startYear - b.startYear);
      
      // Add early pre-historic periods
      const prehistoricPeriods: TimelineItem[] = [
        {
          id: -1,
          name: 'Thời kỳ Văn hóa Sơn Vi',
          startYear: -20000,
          endYear: -10000,
          description: 'Thời kỳ văn hóa sơ khai trên lãnh thổ Việt Nam với những công cụ đá đầu tiên.'
        },
        {
          id: -2,
          name: 'Thời kỳ Văn hóa Hòa Bình',
          startYear: -10000,
          endYear: -8000,
          description: 'Thời kỳ văn hóa với kỹ thuật ghè đá phức tạp hơn, con người bắt đầu sống định cư.'
        },
        {
          id: -3,
          name: 'Thời kỳ Văn hóa Bắc Sơn',
          startYear: -8000,
          endYear: -6000,
          description: 'Thời kỳ đá mới với công cụ mài nhẵn và gốm đơn giản.'
        },
        {
          id: -4,
          name: 'Thời kỳ Văn hóa Phùng Nguyên',
          startYear: -2000,
          endYear: -1500,
          description: 'Thời kỳ chuyển tiếp từ đá sang đồng, con người biết trồng lúa nước.'
        },
        {
          id: -5,
          name: 'Thời kỳ Văn hóa Đồng Đậu',
          startYear: -1500,
          endYear: -1000,
          description: 'Thời kỳ đồ đồng với kỹ thuật luyện kim phát triển.'
        },
        {
          id: -6,
          name: 'Thời kỳ Văn Lang - Âu Lạc',
          startYear: -700,
          endYear: -258,
          description: 'Thời kỳ nhà nước Văn Lang dưới sự cai trị của các vua Hùng, sau đó là nhà nước Âu Lạc của An Dương Vương.'
        },
      ];
      
      const allItems = [...prehistoricPeriods, ...items];
      setFilteredItems(allItems);
    }
  }, [periods]);

  // Handle search
  useEffect(() => {
    if (periods.length > 0) {
      let items = [...filteredItems];
      
      if (searchQuery) {
        items = items.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.capital && item.capital.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      if (activeFilter !== 'all') {
        // Apply time period filter
        switch(activeFilter) {
          case 'prehistoric':
            items = items.filter(item => item.startYear < -258);
            break;
          case 'ancient':
            items = items.filter(item => item.startYear >= -258 && item.startYear < 939);
            break;
          case 'medieval':
            items = items.filter(item => item.startYear >= 939 && item.startYear < 1858);
            break;
          case 'modern':
            items = items.filter(item => item.startYear >= 1858);
            break;
        }
      }
      
      setFilteredItems(items);
    }
  }, [searchQuery, activeFilter, periods]);

  // Calculate timeline positioning
  const calculateTimelinePosition = (year: number) => {
    const timeSpan = visibleRange.end - visibleRange.start;
    return Math.max(0, Math.min(100, ((year - visibleRange.start) / timeSpan) * 100));
  };

  // Calculate a period's width on the timeline
  const calculateTimelineWidth = (startYear: number, endYear: number | null) => {
    if (!endYear) return 5; // Fixed width for ongoing periods
    const timeSpan = visibleRange.end - visibleRange.start;
    return Math.max(5, ((endYear - startYear) / timeSpan) * 100);
  };

  return (
    <SiteLayout title="Dòng thời gian lịch sử Việt Nam">
      <div className="bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Dòng thời gian lịch sử Việt Nam</h1>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
            Khám phá lịch sử Việt Nam từ thời kỳ đồ đá đến hiện đại qua dòng thời gian tương tác này.
          </p>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('all')}
              >
                Tất cả
              </Button>
              <Button 
                variant={activeFilter === 'prehistoric' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('prehistoric')}
              >
                Thời kỳ tiền sử
              </Button>
              <Button 
                variant={activeFilter === 'ancient' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('ancient')}
              >
                Thời kỳ cổ đại
              </Button>
              <Button 
                variant={activeFilter === 'medieval' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('medieval')}
              >
                Thời kỳ trung đại
              </Button>
              <Button 
                variant={activeFilter === 'modern' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('modern')}
              >
                Thời kỳ cận-hiện đại
              </Button>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm thời kỳ..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Timeline */}
          {isPeriodsLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Đang tải dòng thời gian...</span>
            </div>
          ) : (
            <div className="relative mt-16 mb-8">
              {/* Timeline base line */}
              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 absolute top-0">
                {/* Year markers */}
                {[-3000, -2000, -1000, 0, 500, 1000, 1500, 1800, 1900, 2000].map(year => (
                  <div 
                    key={year} 
                    className="absolute -bottom-6 transform -translate-x-1/2"
                    style={{ left: `${calculateTimelinePosition(year)}%` }}
                  >
                    <div className="h-3 w-0.5 bg-gray-400 mb-1 mx-auto"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{year}</span>
                  </div>
                ))}
              </div>
              
              {/* Timeline periods */}
              <div className="relative mt-14">
                {filteredItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="relative mb-12"
                  >
                    {/* Timeline marker */}
                    <div 
                      className="absolute h-3 w-3 rounded-full bg-primary -top-14" 
                      style={{ left: `${calculateTimelinePosition(item.startYear)}%` }}
                    ></div>
                    
                    {/* Period bar */}
                    <div 
                      className="absolute h-3 bg-primary opacity-60 rounded -top-14"
                      style={{ 
                        left: `${calculateTimelinePosition(item.startYear)}%`,
                        width: `${calculateTimelineWidth(item.startYear, item.endYear || 2023)}%`
                      }}
                    ></div>
                    
                    {/* Content card */}
                    <div 
                      className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 ml-6 transition-all hover:shadow-lg`}
                      style={{ 
                        marginLeft: `${calculateTimelinePosition(item.startYear)}%`,
                        maxWidth: '600px',
                        transform: index % 2 === 0 ? 'translateY(0)' : 'translateY(-100%)',
                      }}
                    >
                      <div className="flex flex-col">
                        <h3 className="font-bold text-lg text-primary dark:text-primary-400">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {item.startYear < 0 ? Math.abs(item.startYear) + ' TCN' : item.startYear} - {item.endYear ? (item.endYear < 0 ? Math.abs(item.endYear) + ' TCN' : item.endYear) : 'nay'}
                          {item.capital && ` • Kinh đô: ${item.capital}`}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {filteredItems.length === 0 && !isPeriodsLoading && (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium mb-2">Không tìm thấy thời kỳ nào phù hợp</h3>
              <p className="text-gray-500">Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}