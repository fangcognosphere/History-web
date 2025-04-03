import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/admin-layout';
import { HistoricalFigureForm } from '@/components/admin/historical-figure-form';
import { getQueryFn } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function AdminHistoricalFigureEdit() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/admin/historical-figures/edit/:id');
  const [, newParams] = useRoute('/admin/historical-figures/new');
  
  const isNewMode = Boolean(newParams);
  const figureId = params?.id ? parseInt(params.id) : undefined;

  // Only fetch data if we're in edit mode
  const { data: figure, isLoading, error } = useQuery({
    queryKey: ['/api/nhanvat', figureId],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!figureId && !isNewMode,
  });

  // Redirect to figures list if figure not found
  useEffect(() => {
    if (!isLoading && !isNewMode && (!figure || error)) {
      setLocation('/admin/historical-figures');
    }
  }, [isLoading, figure, error, setLocation, isNewMode]);

  return (
    <AdminLayout title={isNewMode ? "Thêm nhân vật lịch sử mới" : "Chỉnh sửa nhân vật lịch sử"}>
      <div className="space-y-6">
        {(isLoading && !isNewMode) ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="flex justify-end gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ) : (
          <HistoricalFigureForm 
            initialData={isNewMode ? undefined : figure} 
            isEdit={!isNewMode}
          />
        )}
      </div>
    </AdminLayout>
  );
}