import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { TimelineLoading } from '@/components/ui/timeline-loading';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoadingDemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'timeline' | 'spinner'>('timeline');
  const [spinnerSize, setSpinnerSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [fullScreen, setFullScreen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const handleShowLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <SiteLayout title="Demo hiệu ứng loading">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Demo Hiệu Ứng Loading</h1>
        
        <Tabs defaultValue="timeline" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="timeline" 
              onClick={() => setLoadingType('timeline')}
            >
              Timeline Loading
            </TabsTrigger>
            <TabsTrigger 
              value="spinner" 
              onClick={() => setLoadingType('spinner')}
            >
              Spinner Loading
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Loading</CardTitle>
                <CardDescription>
                  Hiệu ứng loading chính cho dòng thời gian và toàn trang.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Chế độ hiển thị</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={fullScreen ? 'fullscreen' : 'inline'}
                      onChange={(e) => setFullScreen(e.target.value === 'fullscreen')}
                    >
                      <option value="inline">Trong trang (inline)</option>
                      <option value="fullscreen">Toàn màn hình (fullscreen)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Thông báo tùy chỉnh</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Đang tải dòng thời gian..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="py-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                  <TimelineLoading 
                    fullScreen={false} 
                    message={customMessage || "Đang tải dòng thời gian..."}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleShowLoading}>
                  Hiển thị loading {fullScreen ? 'toàn màn hình' : 'trong trang'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="spinner">
            <Card>
              <CardHeader>
                <CardTitle>Loading Spinner</CardTitle>
                <CardDescription>
                  Spinner đơn giản cho các loading nhỏ hơn trong trang.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Kích thước</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={spinnerSize}
                      onChange={(e) => setSpinnerSize(e.target.value as any)}
                    >
                      <option value="sm">Nhỏ</option>
                      <option value="md">Vừa</option>
                      <option value="lg">Lớn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Thông báo tùy chỉnh</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Đang tải..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="py-8 border rounded-md bg-gray-50 dark:bg-gray-800">
                  <LoadingSpinner 
                    size={spinnerSize} 
                    text={customMessage} 
                    centered={true}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleShowLoading}>
                  Hiển thị spinner loading
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {isLoading && loadingType === 'timeline' && (
          <TimelineLoading fullScreen={fullScreen} message={customMessage || undefined} />
        )}
        
        {isLoading && loadingType === 'spinner' && (
          <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50">
            <LoadingSpinner size={spinnerSize} text={customMessage} />
          </div>
        )}
        
        <div className="mt-12 p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Cho trang chính:</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm overflow-x-auto">
                {`import { withPageLoading } from 'hooks/with-page-loading';
                function YourPage() {
                  // Nội dung trang
                }

                export default withPageLoading(YourPage);`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Cho component:</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm overflow-x-auto">
                {`import { TimelineLoading } from '@/components/ui/timeline-loading';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Loading chính
{isLoading && <TimelineLoading />}

// Spinner đơn giản
{isLoading && <LoadingSpinner size="md" text="Đang tải..." />}`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Với React Query:</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm overflow-x-auto">
                {`const { data, isLoading } = useQuery({
  queryKey: ['your-query'],
  queryFn: async () => {
    // Gọi API
  }
});

{isLoading && <TimelineLoading />}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}