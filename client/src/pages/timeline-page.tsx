import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { Search, Calendar, Clock, Info, MapPin, Filter, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/use-mobile';
import { TimelineLoading } from '@/components/ui/timeline-loading';
import { withPageLoading } from '@/hooks/with-page-loading';

interface TimelineItem {
  id: number;
  name: string;
  startYear: number;
  endYear: number | null;
  description: string;
  capital?: string;
}

function TimelinePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<TimelineItem[]>([]);
  const [allItems, setAllItems] = useState<TimelineItem[]>([]);
  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number }>({ start: -3000, end: 2025 });
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [nearbyEvents, setNearbyEvents] = useState<TimelineItem[]>([]);
  const [showYearInfo, setShowYearInfo] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<TimelineItem | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const timelineRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const scrollToTimeline = () => {
    if (timelineRef.current) {
      setTimeout(() => {
        timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);

    switch (filter) {
      case 'prehistoric':
        setVisibleRange({ start: -3000, end: -258 });
        break;
      case 'ancient':
        setVisibleRange({ start: -258, end: 939 });
        break;
      case 'medieval':
        setVisibleRange({ start: 939, end: 1858 });
        break;
      case 'modern':
        setVisibleRange({ start: 1858, end: 2025 });
        break;
      case 'all':
        if (periods.length > 0) {
          const earliestYear = Math.min(
            ...periods.map((period: any) => period.batDau).filter((year: any) => year !== null && year !== undefined)
          );
          setVisibleRange({ start: earliestYear, end: 2025 });
        } else {
          setVisibleRange({ start: -3000, end: 2025 });
        }
        break;
    }

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
      console.log('API Dynasty Data:', periods);
      const apiItems: TimelineItem[] = periods
        .map((period: any) => ({
          id: period.id,
          name: period.tenTrieuDai,
          startYear: period.batDau,
          endYear: period.ketThuc,
          description: period.moTa || 'Không có mô tả',
          capital: period.kinhDo,
        }))
        .sort((a: TimelineItem, b: TimelineItem) => a.startYear - b.startYear);

      if (apiItems.length > 0) {
        const earliestYear = Math.min(...apiItems.map((item) => item.startYear));
        setVisibleRange({ start: earliestYear, end: 2025 });
      }

      setAllItems(apiItems);
      setFilteredItems(apiItems);
    }
  }, [periods]);

  useEffect(() => {
    if (periods.length > 0) {
      const allYears = periods.flatMap((period: any) =>
        [period.batDau, period.ketThuc].filter((year) => year !== null && year !== undefined)
      );
      const minYear = Math.min(...allYears);
      const maxYear = Math.max(...allYears);
      setVisibleRange({ start: minYear, end: maxYear });
    }
  }, [periods]);

  useEffect(() => {
    if (allItems.length > 0) {
      let result = [...allItems];

      if (searchQuery) {
        result = result.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.capital && item.capital.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      if (activeFilter !== 'all') {
        switch (activeFilter) {
          case 'prehistoric':
            result = result.filter((item) => item.startYear < -258);
            break;
          case 'ancient':
            result = result.filter((item) => item.startYear >= -258 && item.startYear < 939);
            break;
          case 'medieval':
            result = result.filter((item) => item.startYear >= 939 && item.startYear < 1858);
            break;
          case 'modern':
            result = result.filter((item) => item.startYear >= 1858);
            break;
        }
      }

      setFilteredItems(result);
    }
  }, [searchQuery, activeFilter, allItems]);

  const calculateTimelinePosition = (year: number) => {
    const clampedYear = Math.max(visibleRange.start, Math.min(visibleRange.end, year));
    const percentage = ((clampedYear - visibleRange.start) / (visibleRange.end - visibleRange.start)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const calculateTimelineWidth = (startYear: number, endYear: number | null) => {
    if (!endYear) return 5;

    const clampedStartYear = Math.max(visibleRange.start, Math.min(visibleRange.end, startYear));
    const clampedEndYear = Math.max(visibleRange.start, Math.min(visibleRange.end, endYear));

    const startPosition = calculateTimelinePosition(clampedStartYear);
    const endPosition = calculateTimelinePosition(clampedEndYear);

    return Math.max(5, endPosition - startPosition);
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(year);

    const eventsNearYear = allItems.filter((item) => {
      if (item.startYear <= year && (item.endYear === null || item.endYear >= year)) {
        return true;
      }

      return (
        Math.abs(item.startYear - year) <= 100 ||
        (item.endYear !== null && Math.abs(item.endYear - year) <= 100)
      );
    });

    setNearbyEvents(eventsNearYear);
    setShowYearInfo(true);

    if (timelineRef.current) {
      setTimeout(() => {
        timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const closeYearInfo = () => {
    setShowYearInfo(false);
    setSelectedYear(null);
  };

  const handleMouseEnter = (item: TimelineItem, event: React.MouseEvent) => {
    setTooltipContent(item);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setTooltipContent(null);
  };

  const handleDotClick = (item: TimelineItem) => {
    setHoveredItem(hoveredItem === item.id ? null : item.id);
  };

  const handleCloseItem = () => {
    setHoveredItem(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (timelineRef.current) {
      timelineRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
                    'rounded-full',
                    activeFilter === 'prehistoric'
                      ? ''
                      : 'hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/30 dark:hover:text-amber-300'
                  )}
                >
                  Thời kỳ tiền sử
                </Button>
                <Button
                  variant={activeFilter === 'ancient' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('ancient')}
                  className={cn(
                    'rounded-full',
                    activeFilter === 'ancient'
                      ? ''
                      : 'hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300'
                  )}
                >
                  Thời kỳ cổ đại
                </Button>
                <Button
                  variant={activeFilter === 'medieval' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('medieval')}
                  className={cn(
                    'rounded-full',
                    activeFilter === 'medieval'
                      ? ''
                      : 'hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
                  )}
                >
                  Thời kỳ trung đại
                </Button>
                <Button
                  variant={activeFilter === 'modern' ? 'default' : 'outline'}
                  onClick={() => handleFilterChange('modern')}
                  className={cn(
                    'rounded-full',
                    activeFilter === 'modern'
                      ? ''
                      : 'hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-300'
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
              <TimelineLoading />
            ) : (
              <div className="relative mt-24">
                <div className="space-y-4">
                  {currentItems.map((item) => (
                    <motion.div
                      key={`item-${item.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                      <div className={`h-1 w-full bg-gradient-to-r ${getPeriodColor(item.startYear)}`}></div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3
                            className={`font-bold text-lg bg-gradient-to-r ${getPeriodColor(
                              item.startYear
                            )} bg-clip-text text-transparent`}
                          >
                            {item.name}
                          </h3>
                          <Badge variant="outline" className="ml-2 shrink-0">
                            {formatYear(item.startYear)} - {item.endYear ? formatYear(item.endYear) : 'nay'}
                          </Badge>
                        </div>

                        {item.capital && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{item.capital}</span>
                          </div>
                        )}

                        <div className="mt-2">
                          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{item.description}</p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                          <Badge
                            className={`bg-opacity-10 text-xs ${
                              item.startYear < -258
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                                : item.startYear < 939
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                                : item.startYear < 1858
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                            }`}
                          >
                            {item.startYear < -258
                              ? 'Tiền sử'
                              : item.startYear < 939
                              ? 'Cổ đại'
                              : item.startYear < 1858
                              ? 'Trung đại'
                              : 'Cận-hiện đại'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/90 p-0 h-8"
                            onClick={() => (window.location.href = `/dynasty/${item.id}`)}
                          >
                            <span className="text-xs">Xem chi tiết</span>
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <span className="text-sm text-gray-500 dark:text-gray-400 mx-1">
                        Trang {currentPage} / {totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {showYearInfo && selectedYear !== null && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mt-16 mb-8 relative overflow-hidden',
                  isMobile && 'sticky top-4 z-30'
                )}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-primary/20"></div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-xl font-bold">
                      Sự kiện năm {selectedYear < 0 ? `${Math.abs(selectedYear)} TCN` : selectedYear}
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={closeYearInfo}
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {nearbyEvents.length > 0 ? (
                  <div
                    className={cn(
                      'grid gap-4',
                      isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
                    )}
                  >
                    {nearbyEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          'relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg',
                          'hover:shadow-md transition-all duration-300 overflow-hidden',
                          'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850'
                        )}
                      >
                        <div
                          className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getPeriodColor(
                            event.startYear
                          )}`}
                        ></div>
                        <div className="ml-2">
                          <div className="flex items-start justify-between mb-2">
                            <h4
                              className={`font-bold text-lg bg-gradient-to-r ${getPeriodColor(
                                event.startYear
                              )} bg-clip-text text-transparent`}
                            >
                              {event.name}
                            </h4>
                            <Badge variant="outline" className="ml-2 shrink-0">
                              ({formatYear(event.startYear)} - {event.endYear ? formatYear(event.endYear) : 'nay'})
                            </Badge>
                          </div>

                          {event.capital && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{event.capital}</span>
                            </div>
                          )}

                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {event.description}
                          </p>

                          <div className="mt-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-primary/30 text-primary"
                              onClick={() => (window.location.href = `/dynasty/${event.id}`)}
                            >
                              Xem chi tiết
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-750 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                    <Info className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Không tìm thấy sự kiện nào gần với năm này</p>
                  </div>
                )}
              </motion.div>
            )}

            {filteredItems.length === 0 && !isPeriodsLoading && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 text-center">
                <h3 className="text-xl font-medium mb-3 text-gray-800 dark:text-gray-200">
                  Không tìm thấy thời kỳ nào phù hợp
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
                </p>
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

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? 'default' : 'outline'}
                  onClick={() => paginate(index + 1)}
                  className="rounded-full"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

export default withPageLoading(TimelinePage);