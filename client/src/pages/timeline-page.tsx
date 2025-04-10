import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const [allItems, setAllItems] = useState<TimelineItem[]>([]);
  const [visibleRange, setVisibleRange] = useState({ start: -3000, end: 2023 });
  const [activeFilter, setActiveFilter] = useState('all');

  const timelineRef = useRef<HTMLDivElement>(null);

  const scrollToTimeline = () => {
    if (timelineRef.current) {
      setTimeout(() => {
        timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    scrollToTimeline();
  };

  const getPeriodColor = (startYear: number): string => {
    if (startYear < -258) return 'from-amber-600 to-amber-400';
    if (startYear >= -258 && startYear < 939) return 'from-emerald-600 to-emerald-400';
    if (startYear >= 939 && startYear < 1858) return 'from-blue-600 to-blue-400';
    return 'from-purple-600 to-purple-400';
  };

  const formatYear = (year: number | null | undefined): string => {
    if (year === null || year === undefined) return 'Không rõ';
    if (year < 0) return `${Math.abs(year)} TCN`;
    return year.toString();
  };

  const { data: periods = [], isLoading: isPeriodsLoading } = useQuery({
    queryKey: ['/api/dynasty'],
    queryFn: async () => {
      const res = await fetch('/api/dynasty');
      if (!res.ok) throw new Error('Failed to fetch periods');
      return res.json();
    },
  });

  useEffect(() => {
    if (periods.length > 0) {
      const apiItems: TimelineItem[] = periods.map((period: any) => ({
        id: period.id,
        name: period.TenTrieuDai,
        startYear: period.BatDau,
        endYear: period.KetThuc,
        description: period.MoTa || 'Không có mô tả',
        capital: period.kinhDo,
      })).sort((a: TimelineItem, b: TimelineItem) => a.startYear - b.startYear);

      const prehistoricPeriods: TimelineItem[] = [
        {
          id: -1,
          name: 'Thời kỳ Văn hóa Sơn Vi',
          startYear: -20000,
          endYear: -10000,
          description: 'Thời kỳ văn hóa sơ khai trên lãnh thổ Việt Nam với những công cụ đá đầu tiên.',
        },
        {
          id: -2,
          name: 'Thời kỳ Văn hóa Hòa Bình',
          startYear: -10000,
          endYear: -8000,
          description: 'Thời kỳ văn hóa với kỹ thuật ghè đá phức tạp hơn, con người bắt đầu sống định cư.',
        },
        {
          id: -3,
          name: 'Thời kỳ Văn hóa Bắc Sơn',
          startYear: -8000,
          endYear: -6000,
          description: 'Thời kỳ đá mới với công cụ mài nhẵn và gốm đơn giản.',
        },
        {
          id: -4,
          name: 'Thời kỳ Văn hóa Phùng Nguyên',
          startYear: -2000,
          endYear: -1500,
          description: 'Thời kỳ chuyển tiếp từ đá sang đồng, con người biết trồng lúa nước.',
        },
        {
          id: -5,
          name: 'Thời kỳ Văn hóa Đồng Đậu',
          startYear: -1500,
          endYear: -1000,
          description: 'Thời kỳ đồ đồng với kỹ thuật luyện kim phát triển.',
        },
        {
          id: -6,
          name: 'Thời kỳ Văn Lang - Âu Lạc',
          startYear: -700,
          endYear: -258,
          description: 'Thời kỳ nhà nước Văn Lang dưới sự cai trị của các vua Hùng, sau đó là nhà nước Âu Lạc của An Dương Vương.',
        },
      ];

      const combinedItems = [...prehistoricPeriods, ...apiItems];
      setAllItems(combinedItems);
      setFilteredItems(combinedItems);
    }
  }, [periods]);

  useEffect(() => {
    if (allItems.length > 0) {
      let result = [...allItems];

      if (searchQuery) {
        result = result.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.capital && item.capital.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      if (activeFilter !== 'all') {
        switch (activeFilter) {
          case 'prehistoric':
            result = result.filter(item => item.startYear < -258);
            break;
          case 'ancient':
            result = result.filter(item => item.startYear >= -258 && item.startYear < 939);
            break;
          case 'medieval':
            result = result.filter(item => item.startYear >= 939 && item.startYear < 1858);
            break;
          case 'modern':
            result = result.filter(item => item.startYear >= 1858);
            break;
        }
      }

      setFilteredItems(result);
    }
  }, [searchQuery, activeFilter, allItems]);

  const calculateTimelinePosition = (year: number) => {
    const timeSpan = visibleRange.end - visibleRange.start;
    return Math.max(0, Math.min(100, ((year - visibleRange.start) / timeSpan) * 100));
  };

  const calculateTimelineWidth = (startYear: number, endYear: number | null) => {
    if (!endYear) return 5;
    const timeSpan = visibleRange.end - visibleRange.start;
    return Math.max(5, ((endYear - startYear) / timeSpan) * 100);
  };

  return (
    <SiteLayout title="Dòng thời gian lịch sử Việt Nam">
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Dòng thời gian lịch sử Việt Nam
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Khám phá hành trình hàng nghìn năm của dân tộc Việt Nam qua các thời kỳ lịch sử từ thời đại đồ đá đến hiện đại.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Lọc theo thời kỳ
            </h2>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Button
                  variant={activeFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('all')}
                  className="rounded-full"
                >
                  Tất cả
                </Button>
                <Button
                  variant={activeFilter === 'prehistoric' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('prehistoric')}
                  className={cn(
                    "rounded-full",
                    activeFilter === 'prehistoric' ? "" : "hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/30 dark:hover:text-amber-300"
                  )}
                >
                  Thời kỳ tiền sử
                </Button>
                <Button
                  variant={activeFilter === 'ancient' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('ancient')}
                  className={cn(
                    "rounded-full",
                    activeFilter === 'ancient' ? "" : "hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300"
                  )}
                >
                  Thời kỳ cổ đại
                </Button>
                <Button
                  variant={activeFilter === 'medieval' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('medieval')}
                  className={cn(
                    "rounded-full",
                    activeFilter === 'medieval' ? "" : "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                  )}
                >
                  Thời kỳ trung đại
                </Button>
                <Button
                  variant={activeFilter === 'modern' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('modern')}
                  className={cn(
                    "rounded-full",
                    activeFilter === 'modern' ? "" : "hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-300"
                  )}
                >
                  Thời kỳ cận-hiện đại
                </Button>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm thời kỳ..."
                  className="pl-10 rounded-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div ref={timelineRef}>
            {isPeriodsLoading ? (
              <div className="flex flex-col justify-center items-center h-80 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <span className="text-lg text-gray-600 dark:text-gray-300">Đang tải dòng thời gian...</span>
              </div>
            ) : (
              <div className="relative mt-24 mb-12">
                <div className="w-full h-1.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full shadow-sm absolute top-0">
                  {[-3000, -2000, -1000, 0, 500, 1000, 1500, 1800, 1900, 2000].map(year => (
                    <div
                      key={year}
                      className="absolute -bottom-8 transform -translate-x-1/2"
                      style={{ left: `${calculateTimelinePosition(year)}%` }}
                    >
                      <div className="h-4 w-0.5 bg-gray-400 dark:bg-gray-500 mb-1.5 mx-auto"></div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm">{year}</span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-20">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="relative mb-16"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div
                        className={`absolute h-4 w-4 rounded-full bg-gradient-to-r ${getPeriodColor(item.startYear)} -top-[0.68rem] shadow-md z-10 border-2 border-white dark:border-gray-800`}
                        style={{ left: `${calculateTimelinePosition(item.startYear)}%` }}
                      ></div>

                      <div
                        className={`absolute h-3 bg-gradient-to-r ${getPeriodColor(item.startYear)} opacity-70 rounded-full -top-[0.55rem] shadow-inner`}
                        style={{
                          left: `${calculateTimelinePosition(item.startYear)}%`,
                          width: `${calculateTimelineWidth(item.startYear, item.endYear || 2023)}%`
                        }}
                      ></div>

                      <div
                        className={`bg-white dark:bg-gray-800 rounded-xl p-6 transition-all hover:shadow-lg border border-gray-100 dark:border-gray-700 ${
                          index % 2 === 0 ? 'shadow-md' : 'shadow-md'
                        }`}
                        style={{
                          marginLeft: `${calculateTimelinePosition(item.startYear)}%`,
                          maxWidth: '600px',
                          transform: index % 2 === 0 ? 'translateY(0)' : 'translateY(-100%)',
                        }}
                      >
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className={`font-bold text-xl bg-gradient-to-r ${getPeriodColor(item.startYear)} bg-clip-text text-transparent`}>
                              {item.name}
                            </h3>
                            <span className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                              {formatYear(item.startYear)} - {item.endYear ? formatYear(item.endYear) : 'nay'}
                            </span>
                          </div>

                          {item.capital && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <span className="font-medium">Kinh đô:</span> {item.capital}
                            </div>
                          )}

                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {filteredItems.length === 0 && !isPeriodsLoading && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
                <h3 className="text-xl font-medium mb-3 text-gray-800 dark:text-gray-200">Không tìm thấy thời kỳ nào phù hợp</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="rounded-full"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>

          {filteredItems.length > 0 && !isPeriodsLoading && (
            <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Chú thích màu sắc</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 mr-2"></div>
                  <span className="text-sm">Thời kỳ tiền sử (trước 258 TCN)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 mr-2"></div>
                  <span className="text-sm">Thời kỳ cổ đại (258 TCN - 939)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 mr-2"></div>
                  <span className="text-sm">Thời kỳ trung đại (939 - 1858)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 mr-2"></div>
                  <span className="text-sm">Thời kỳ cận-hiện đại (sau 1858)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}