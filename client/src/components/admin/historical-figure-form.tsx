import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient, getQueryFn } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { insertNhanVatSchema } from '@shared/schema';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Extend the schema with form-specific validation
const formSchema = insertNhanVatSchema.extend({
  moTa: z.string().optional(),
  namSinh: z.string().optional().transform(val => val ? parseInt(val) : null),
  namMat: z.string().optional().transform(val => val ? parseInt(val) : null),
  trieuDaiId: z.string().optional().transform(val => val ? parseInt(val) : null),
  queQuan: z.string().optional(),
  ghiChu: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HistoricalFigureFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function HistoricalFigureForm({ initialData, isEdit = false }: HistoricalFigureFormProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Fetch dynasties for dropdown
  const { data: dynasties = [] } = useQuery({
    queryKey: ['/api/dynasty'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      namSinh: initialData.namSinh?.toString() || '',
      namMat: initialData.namMat?.toString() || '',
      trieuDaiId: initialData.trieuDaiId?.toString() || '',
    } : {
      tenNhanVat: '',
      moTa: '',
      namSinh: '',
      namMat: '',
      queQuan: '',
      ghiChu: '',
      trieuDaiId: '',
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch('/api/figure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể tạo nhân vật lịch sử');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Nhân vật đã được tạo',
        description: 'Nhân vật lịch sử đã được tạo thành công',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/figure'] });
      navigate('/admin/historical-figures');
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi khi tạo nhân vật',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormValues }) => {
      const res = await fetch(`/api/figure/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể cập nhật nhân vật lịch sử');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Nhân vật đã được cập nhật',
        description: 'Nhân vật lịch sử đã được cập nhật thành công',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/figure'] });
      navigate('/admin/historical-figures');
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi khi cập nhật nhân vật',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Submit handler
  const onSubmit = (values: FormValues) => {
    if (isEdit && initialData) {
      updateMutation.mutate({ id: initialData.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tenNhanVat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhân vật</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên nhân vật lịch sử" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="namSinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm sinh</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ví dụ: 1470" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="namMat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm mất</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ví dụ: 1524" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="queQuan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quê quán</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Thăng Long" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trieuDaiId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời kỳ</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thời kỳ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Array.isArray(dynasties) && dynasties.map((dynasty: any) => (
                    <SelectItem 
                      key={dynasty.id} 
                      value={dynasty.id.toString()}
                    >
                      {dynasty.tenTrieuDai}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="moTa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập mô tả về nhân vật lịch sử" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ghiChu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Thông tin thêm về nhân vật lịch sử" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/historical-figures')}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Cập nhật' : 'Tạo nhân vật'}
          </Button>
        </div>
      </form>
    </Form>
  );
}