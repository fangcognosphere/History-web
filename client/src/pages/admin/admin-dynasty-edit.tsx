import React from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { DynastyForm } from '@/components/admin/dynasty-form';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function AdminDynastyEdit() {
  const params = useParams();
  const isEdit = Boolean(params.id);
  const id = params.id ? parseInt(params.id) : null;

  const { data: dynasty, isLoading, error } = useQuery({
    queryKey: [`/api/dynasty/${id}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isEdit && !!id,
  });

  const title = isEdit ? 'Chỉnh sửa thời kỳ' : 'Thêm thời kỳ mới';

  return (
    <AdminLayout title={title}>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        
        {isEdit && isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {isEdit && error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>
              Không thể tải thông tin thời kỳ. Vui lòng thử lại sau.
            </AlertDescription>
          </Alert>
        )}

        {(!isEdit || (isEdit && dynasty)) && (
          <DynastyForm 
            initialData={dynasty} 
            isEdit={isEdit} 
          />
        )}
      </div>
    </AdminLayout>
  );
}