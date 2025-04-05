import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertBaiVietSchema, danhMucEnum } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest, getQueryFn } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Extend schema for client-side validation
const formSchema = insertBaiVietSchema.extend({
  anhDaiDien: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ArticleFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ArticleForm({ initialData, isEdit = false }: ArticleFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  // Get historical figures for dropdown
  const { data: nhanVats = [] } = useQuery({
    queryKey: ['/api/figure'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Get historical events for dropdown
  const { data: suKiens = [] } = useQuery({
    queryKey: ['/api/event'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Get historical dynasties for dropdown
  const { data: trieuDais = [] } = useQuery({
    queryKey: ['/api/dynasty'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      tieuDe: '',
      noiDung: '',
      tomTat: '',
      danhMuc: 'NhanVat',
      noiBat: false,
      nhanVatId: null,
      suKienId: null,
      trieuDaiId: null,
      thoiGianDoc: 5,
    },
  });
  
  // Create article mutation
  const createArticleMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/api/baiviet', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Không thể tạo bài viết');
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã tạo bài viết mới',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/baiviet'] });
      navigate('/admin/articles');
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update article mutation
  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const res = await fetch(`/api/baiviet/${id}`, {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Không thể cập nhật bài viết');
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật bài viết',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/baiviet'] });
      navigate('/admin/articles');
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    
    Object.keys(values).forEach((key) => {
      if (key !== 'anhDaiDien') {
        // Handle boolean values
        if (typeof values[key as keyof FormValues] === 'boolean') {
          formData.append(key, values[key as keyof FormValues] ? 'true' : 'false');
        } 
        // Handle other values (make sure null/undefined are not added)
        else if (values[key as keyof FormValues] !== null && values[key as keyof FormValues] !== undefined) {
          formData.append(key, String(values[key as keyof FormValues]));
        }
      }
    });
    
    // Add the selected image if available
    if (selectedImage) {
      formData.append('anhDaiDien', selectedImage);
    }
    
    if (isEdit && initialData?.id) {
      updateArticleMutation.mutate({ id: initialData.id, data: formData });
    } else {
      createArticleMutation.mutate(formData);
    }
  };
  
  const isSubmitting = createArticleMutation.isPending || updateArticleMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bài viết</CardTitle>
                <CardDescription>Nhập các thông tin chính cho bài viết</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tieuDe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề bài viết" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tomTat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tóm tắt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập tóm tắt nội dung" 
                          className="resize-none h-24" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="noiDung"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập nội dung bài viết đầy đủ" 
                          className="resize-none h-64" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thiết lập bài viết</CardTitle>
                <CardDescription>Cấu hình hiển thị và phân loại</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="danhMuc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NhanVat">Nhân vật lịch sử</SelectItem>
                          <SelectItem value="SuKien">Sự kiện lịch sử</SelectItem>
                          <SelectItem value="TrieuDai">Triều đại lịch sử</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('danhMuc') === 'NhanVat' && (
                  <FormField
                    control={form.control}
                    name="nhanVatId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhân vật liên quan</FormLabel>
                        <Select
                          onValueChange={val => field.onChange(val ? parseInt(val) : null)}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhân vật" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {nhanVats.map((nhanVat: any) => (
                              <SelectItem key={nhanVat.id} value={nhanVat.id.toString()}>
                                {nhanVat.tenNhanVat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {form.watch('danhMuc') === 'SuKien' && (
                  <FormField
                    control={form.control}
                    name="suKienId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sự kiện liên quan</FormLabel>
                        <Select
                          onValueChange={val => field.onChange(val ? parseInt(val) : null)}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn sự kiện" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {suKiens.map((suKien: any) => (
                              <SelectItem key={suKien.id} value={suKien.id.toString()}>
                                {suKien.tenSuKien}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {form.watch('danhMuc') === 'TrieuDai' && (
                  <FormField
                    control={form.control}
                    name="trieuDaiId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Triều đại liên quan</FormLabel>
                        <Select
                          onValueChange={val => field.onChange(val ? parseInt(val) : null)}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn triều đại" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {trieuDais.map((trieuDai: any) => (
                              <SelectItem key={trieuDai.id} value={trieuDai.id.toString()}>
                                {trieuDai.tenTrieuDai}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="thoiGianDoc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian đọc (phút)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="60" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value) || 5)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="noiBat"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Bài viết nổi bật</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Bài viết sẽ xuất hiện ở mục nổi bật trên trang chủ
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="anhDaiDien"
                  render={({ field }) => (
                    <FormItem>
                      <ImageUpload 
                        onImageSelected={setSelectedImage} 
                        defaultImage={initialData?.anhDaiDien} 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/articles')}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEdit ? 'Cập nhật' : 'Tạo bài viết'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
