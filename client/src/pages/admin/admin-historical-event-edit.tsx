import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/admin-layout';
import { HistoricalEventForm } from '@/components/admin/historical-event-form';
import { getQueryFn } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export default function AdminHistoricalEventEdit() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/admin/historical-events/edit/:id');
  const [, newParams] = useRoute('/admin/historical-events/new');
  
  const isNewMode = Boolean(newParams);
  const eventId = params?.id ? parseInt(params.id) : undefined;

  // Only fetch data if we're in edit mode
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['/api/sukien', eventId],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!eventId && !isNewMode,
  });

  // Redirect to events list if event not found
  useEffect(() => {
    if (!isLoading && !isNewMode && (!event || error)) {
      setLocation('/admin/historical-events');
    }
  }, [isLoading, event, error, setLocation, isNewMode]);

  return (
    <AdminLayout title={isNewMode ? "Thêm sự kiện lịch sử mới" : "Chỉnh sửa sự kiện lịch sử"}>
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
          <HistoricalEventForm 
            initialData={isNewMode ? undefined : event} 
            isEdit={!isNewMode}
          />
        )}
      </div>
    </AdminLayout>
  );
}