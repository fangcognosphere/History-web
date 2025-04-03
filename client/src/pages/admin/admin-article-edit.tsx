import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/admin-layout';
import { ArticleForm } from '@/components/admin/article-form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminArticleEdit() {
  const { id } = useParams();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const isEdit = !!id;
  const [initialData, setInitialData] = useState<any>(null);

  const title = isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới';

  // If editing, fetch the article data
  const { data: article, isLoading, error } = useQuery({
    queryKey: [`/api/article/${id}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/article/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch article');
        }
        return res.json();
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin bài viết. Vui lòng thử lại sau.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: isEdit,
  });

  // When article data is loaded, set it as initial data for the form
  useEffect(() => {
    if (article) {
      setInitialData(article);
    }
  }, [article]);

  // Handle error case
  if (isEdit && error) {
    return (
      <AdminLayout title={title}>
        <div className="bg-destructive/10 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">Lỗi khi tải bài viết</h2>
          <p className="mb-4">Không thể tải thông tin bài viết hoặc bài viết không tồn tại.</p>
          <button 
            onClick={() => navigate('/admin/articles')}
            className="text-primary hover:underline"
          >
            Quay lại danh sách bài viết
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={title}>
      {isEdit && isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải thông tin bài viết...</span>
        </div>
      ) : (
        <ArticleForm initialData={initialData} isEdit={isEdit} />
      )}
    </AdminLayout>
  );
}
