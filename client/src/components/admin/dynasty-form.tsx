import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { insertTrieuDaiSchema } from '@shared/schema';

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

// Extend the schema with form-specific validation
const formSchema = insertTrieuDaiSchema.extend({
  moTa: z.string().optional(),
  batDau: z.string().optional().transform(val => val ? parseInt(val) : null),
  ketThuc: z.string().optional().transform(val => val ? parseInt(val) : null),
  kinhDo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DynastyFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function DynastyForm({ initialData, isEdit = false }: DynastyFormProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      batDau: initialData.batDau?.toString() || '',
      ketThuc: initialData.ketThuc?.toString() || '',
    } : {
      tenTrieuDai: '',
      moTa: '',
      batDau: '',
      ketThuc: '',
      kinhDo: '',
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch('/api/dynasty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể tạo thời kỳ');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Thời kỳ đã được tạo',
        description: 'Thời kỳ đã được tạo thành công',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dynasty'] });
      navigate('/admin/dynasties');
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi khi tạo thời kỳ',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormValues }) => {
      const res = await fetch(`/api/dynasty/${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể cập nhật thời kỳ');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Thời kỳ đã được cập nhật',
        description: 'Thời kỳ đã được cập nhật thành công',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dynasty'] });
      navigate('/admin/dynasties');
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi khi cập nhật thời kỳ',
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
          name="tenTrieuDai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên thời kỳ</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên thời kỳ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="batDau"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm bắt đầu</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ví dụ: 1802" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ketThuc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Năm kết thúc</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ví dụ: 1945" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="kinhDo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kinh đô</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Huế" {...field} />
              </FormControl>
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
                  placeholder="Nhập mô tả về thời kỳ này" 
                  className="min-h-[120px]" 
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
            onClick={() => navigate('/admin/dynasties')}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Cập nhật' : 'Tạo thời kỳ'}
          </Button>
        </div>
      </form>
    </Form>
  );
}