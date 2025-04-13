import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { HistoryLoading } from "@/components/ui/history-loading";
import { TimelineLoading } from "@/components/ui/timeline-loading";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export function LoadingDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [duration, setDuration] = useState(5000);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [spinnerSize, setSpinnerSize] = useState<"sm" | "md" | "lg">("md");

  const handleCompleted = () => {
    setTimeout(() => {
      setLoadingComplete(true);
      setLoadingProgress(100);
    }, 500);
  };

  const startDemo = (demo: string) => {
    setActiveDemo(demo);
    setLoadingComplete(false);
    setLoadingProgress(0);
    
    // Reset progress and animate it during loading
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + (100 / (duration / 500));
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 500);

    // Clear interval when loading completes
    setTimeout(() => {
      clearInterval(interval);
    }, duration);
  };

  // Reset progress when changing tabs
  useEffect(() => {
    if (!activeDemo) {
      setLoadingProgress(0);
    }
  }, [activeDemo]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">
          Demo Hoạt Ảnh Tải Trang
        </h2>

        <Tabs defaultValue="basic" className="w-full mb-10">
          <TabsList className="w-full justify-center mb-8">
            <TabsTrigger value="basic">Loading Cơ Bản</TabsTrigger>
            <TabsTrigger value="history">Loading Lịch Sử</TabsTrigger>
            <TabsTrigger value="timeline">Loading Dòng Thời Gian</TabsTrigger>
            <TabsTrigger value="spinner">Loading Spinner</TabsTrigger>
          </TabsList>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold mb-4">Tùy chỉnh</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="duration">Thời gian (ms)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="duration"
                      min={1000}
                      max={10000}
                      step={1000}
                      value={[duration]}
                      onValueChange={(values) => setDuration(values[0])}
                      className="flex-1"
                    />
                    <span className="w-16 text-sm">{duration}ms</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="fullscreen"
                    checked={showFullScreen}
                    onCheckedChange={setShowFullScreen}
                  />
                  <Label htmlFor="fullscreen">Hiển thị toàn màn hình</Label>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message">Thông báo tùy chỉnh</Label>
                  <Input
                    id="message"
                    placeholder="Nhập thông báo hiển thị khi loading..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="spinner-size">Kích thước spinner</Label>
                  <Select
                    value={spinnerSize}
                    onValueChange={(value) => setSpinnerSize(value as "sm" | "md" | "lg")}
                  >
                    <SelectTrigger id="spinner-size">
                      <SelectValue placeholder="Chọn kích thước" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Nhỏ</SelectItem>
                      <SelectItem value="md">Vừa</SelectItem>
                      <SelectItem value="lg">Lớn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Label>Tiến trình tải</Label>
              <Progress value={loadingProgress} className="h-2 mt-2" />
            </div>
          </div>

          <TabsContent value="basic" className="space-y-4">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative">
              {activeDemo === "basic" && !loadingComplete ? (
                <Loading 
                  fullScreen={showFullScreen} 
                  onComplete={handleCompleted} 
                  duration={duration}
                  message={customMessage || undefined}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={() => startDemo("basic")}>
                    Xem Demo Loading
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Loading Cơ Bản</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Hoạt ảnh tải trang cơ bản với biểu tượng logo xoay tròn và chữ nhảy nhấp nhô.
                Sử dụng cho các tác vụ tải dữ liệu ngắn như chuyển trang hoặc tải các thành phần UI.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                <code className="text-sm">
                  {`<Loading 
  fullScreen={${showFullScreen}} 
  duration={${duration}}
  ${customMessage ? `message="${customMessage}"` : ''}
  onComplete={() => setIsLoading(false)}
/>`}
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative">
              {activeDemo === "history" && !loadingComplete ? (
                <HistoryLoading 
                  fullScreen={showFullScreen} 
                  onComplete={handleCompleted} 
                  duration={duration}
                  message={customMessage || undefined}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={() => startDemo("history")}>
                    Xem Demo Loading
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Loading Lịch Sử</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Hoạt ảnh tải trang hiển thị các sự kiện lịch sử nhỏ trong khi người dùng chờ đợi.
                Lý tưởng cho trang chủ hoặc khi tải các trang bài viết có nhiều nội dung.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                <code className="text-sm">
                  {`<HistoryLoading 
  fullScreen={${showFullScreen}} 
  duration={${duration}}
  ${customMessage ? `message="${customMessage}"` : ''}
  onComplete={() => setIsLoading(false)}
/>`}
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative">
              {activeDemo === "timeline" && !loadingComplete ? (
                <TimelineLoading 
                  fullScreen={showFullScreen} 
                  onComplete={handleCompleted} 
                  duration={duration}
                  message={customMessage || undefined}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={() => startDemo("timeline")}>
                    Xem Demo Loading
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Loading Dòng Thời Gian</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Hoạt ảnh tải trang với dòng thời gian lịch sử động, lý tưởng cho trang timeline hoặc
                khi tải các trang có liên quan đến thời kỳ lịch sử cụ thể.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                <code className="text-sm">
                  {`<TimelineLoading 
  fullScreen={${showFullScreen}} 
  duration={${duration}}
  ${customMessage ? `message="${customMessage}"` : ''}
  onComplete={() => setIsLoading(false)}
/>`}
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spinner" className="space-y-4">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative">
              {activeDemo === "spinner" && !loadingComplete ? (
                <div className={`${showFullScreen ? 'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80' : 'w-full h-full'} flex items-center justify-center`}>
                  <LoadingSpinner 
                    size={spinnerSize} 
                    text={customMessage || undefined}
                    centered={true}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={() => startDemo("spinner")}>
                    Xem Demo Spinner
                  </Button>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Loading Spinner</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Spinner đơn giản cho các loading nhỏ hơn trong trang. Lý tưởng cho các tác vụ nhanh
                hoặc loading từng phần của trang.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                <code className="text-sm">
                  {`<LoadingSpinner 
  size="${spinnerSize}"
  ${customMessage ? `text="${customMessage}"` : ''}
  centered={true}
/>`}
                </code>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8">
          <h3 className="text-xl font-semibold mb-4">Cách Sử Dụng</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Để sử dụng các component loading, hãy thêm vào component của bạn và kiểm soát hiển thị thông qua state:
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <pre className="text-sm">
              {`import { useState, useEffect } from 'react';
import { TimelineLoading } from '@/components/ui/timeline-loading';
import { withPageLoading } from '@/hooks/with-page-loading';

// Cách 1: Sử dụng trực tiếp trong component
function YourComponent() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Tự động ẩn loading sau khi dữ liệu được tải
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {isLoading && (
        <TimelineLoading 
          fullScreen={true} 
          onComplete={() => setIsLoading(false)} 
          message="Đang tải dữ liệu..."
        />
      )}
      
      {/* Nội dung chính của trang */}
      {!isLoading && <YourMainContent />}
    </>
  );
}

// Cách 2: Sử dụng HOC withPageLoading
function AnotherComponent() {
  // Nội dung trang
  return <div>Nội dung trang</div>;
}

// Tự động hiển thị loading khi component được mount
export default withPageLoading(AnotherComponent);`}
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">Tích hợp với React Query</h3>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <pre className="text-sm">
              {`import { useQuery } from '@tanstack/react-query';
import { TimelineLoading } from '@/components/ui/timeline-loading';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

function DataComponent() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['your-data'],
    queryFn: () => fetchYourData()
  });

  // Loading toàn trang
  if (isLoading) {
    return <TimelineLoading fullScreen={true} />;
  }

  // Hoặc loading cho một phần của trang
  return (
    <div>
      <h1>Dữ liệu của bạn</h1>
      
      <div>
        {isLoading ? (
          <div className="py-20">
            <LoadingSpinner size="md" text="Đang tải dữ liệu..." />
          </div>
        ) : (
          <DataDisplay data={data} />
        )}
      </div>
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}