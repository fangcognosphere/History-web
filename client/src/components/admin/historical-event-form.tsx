import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient, getQueryFn } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { insertSuKienSchema } from '@shared/schema';

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
const formSchema = insertSuKienSchema.extend({
  moTa: z.string().optional(),
  namBatDau: z.string().optional().transform(val => val ? parseInt(val) : null),
  namKetThuc: z.string().optional().transform(val => val ? parseInt(val) : null),
  trieuDaiId: z.string().optional().transform(val => val ? parseInt(val) : null),
  diaDiem: z.string().optional(),
  ghiChu: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HistoricalEventFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function HistoricalEventForm({ initialData, isEdit = false }: HistoricalEventFormProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Fetch dynasties for dropdown
  const { data: dynasties = [] } = useQuery({
    queryKey: ['/api/trieudai'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      namBatDau: initialData.namBatDau?.toString() || '',
      namKetThuc: initialData.namKetThuc?.toString() || '',
      trieuDaiId: initialData.trieuDaiId?.toString() || '',
    } : {
      tenSuKien: '',
      moTa: '',
      namBatDau: '',
      namKetThuc: '',
      diaDiem: '',
      ghiChu: '',
      trieuDaiId: '',
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch('/api/sukien', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể tạo sự kiện lịch sử');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Sự kiện đã được tạo',
        description: 'Sự kiện lịch sử đã được tạo thành công',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sukien'] });
      navigate('/admin/historical-events');
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi khi tạo sự kiện',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormValues }) => {
      const res = await fetch(`/api/sukien/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể cập nhật sự kiện lịch sử');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Sự kiện đã được cập nhật',
        description: 'Sự kiện lịch sử đã được cập nhật thành công',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sukien'] });
      navigate('/admin/historical-events');
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi khi cập nhật sự kiện',
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
          name="tenSuKien"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sự kiện</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên sự kiện lịch sử" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="namBatDau"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm bắt đầu</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ví dụ: 1788" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="namKetThuc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm kết thúc</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ví dụ: 1789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="diaDiem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa điểm</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Đống Đa, Hà Nội" {...field} />
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
                  placeholder="Nhập mô tả về sự kiện lịch sử" 
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
                  placeholder="Thông tin thêm về sự kiện lịch sử" 
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
            onClick={() => navigate('/admin/historical-events')}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Cập nhật' : 'Tạo sự kiện'}
          </Button>
        </div>
      </form>
    </Form>
  );
}