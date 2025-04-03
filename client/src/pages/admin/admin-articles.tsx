import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/admin-layout';
import { ArticleCard } from '@/components/articles/article-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Link, useLocation } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  FileText, 
  Filter, 
  Loader2 
} from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminArticles() {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Fetch articles
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['/api/article'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Set up deletion mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/article/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete article');
      }
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Bài viết đã được xóa",
        description: "Bài viết đã được xóa thành công",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/article'] });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi khi xóa bài viết",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter articles based on category and search query
  const filteredArticles = articles.filter((article: any) => {
    const matchesCategory = filter === 'all' || article.danhMuc === filter;
    const matchesSearch = searchQuery === '' || 
      article.tieuDe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.tomTat && article.tomTat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Handle delete article
  const handleDeleteClick = (id: number) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (articleToDelete) {
      deleteMutation.mutate(articleToDelete);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'NhanVat': return 'Nhân vật';
      case 'SuKien': return 'Sự kiện';
      case 'TrieuDai': return 'Triều đại';
      default: return 'Không xác định';
    }
  };

  return (
    <AdminLayout title="Quản lý bài viết">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Danh sách bài viết</h2>
          <Link href="/admin/articles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo bài viết mới
            </Button>
          </Link>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Lọc theo danh mục" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="NhanVat">Nhân vật lịch sử</SelectItem>
                <SelectItem value="SuKien">Sự kiện lịch sử</SelectItem>
                <SelectItem value="TrieuDai">Triều đại lịch sử</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Articles table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead className="hidden md:table-cell">Danh mục</TableHead>
                <TableHead className="hidden md:table-cell">Ngày đăng</TableHead>
                <TableHead className="hidden md:table-cell">Lượt xem</TableHead>
                <TableHead className="hidden md:table-cell">Nổi bật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Không tìm thấy bài viết nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article: any) => (
                  <TableRow key={article.id}>
                    <TableCell>{article.id}</TableCell>
                    <TableCell className="font-medium">{article.tieuDe}</TableCell>
                    <TableCell className="hidden md:table-cell">{getCategoryLabel(article.danhMuc)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(article.ngayDang)}</TableCell>
                    <TableCell className="hidden md:table-cell">{article.luotXem}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {article.noiBat ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                          Nổi bật
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-500">
                          Thường
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/article/${article.id}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Xem">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/articles/edit/${article.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Sửa">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive" 
                          title="Xóa"
                          onClick={() => handleDeleteClick(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa bài viết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
