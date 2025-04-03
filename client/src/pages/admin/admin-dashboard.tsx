import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image, Film, PieChart, TrendingUp, Users } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  // Fetch articles count
  const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
    queryKey: ['/api/article'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Helper to count articles by category
  const countByCategory = (category: string) => {
    return Array.isArray(articles) 
      ? articles.filter(article => article.danhMuc === category).length
      : 0;
  };

  // Get stats
  const stats = {
    totalArticles: Array.isArray(articles) ? articles.length : 0,
    nhanVat: countByCategory('NhanVat'),
    suKien: countByCategory('SuKien'),
    trieuDai: countByCategory('TrieuDai'),
  };

  // Get recent articles
  const recentArticles = Array.isArray(articles) ? articles.slice(0, 5) : [];

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Get category information
  const getCategoryInfo = (category: string) => {
    switch(category) {
      case 'NhanVat': return { label: 'Nhân Vật', color: 'bg-blue-500' };
      case 'SuKien': return { label: 'Sự Kiện', color: 'bg-green-500' };
      case 'TrieuDai': return { label: 'Triều Đại', color: 'bg-amber-500' };
      default: return { label: 'Khác', color: 'bg-gray-500' };
    }
  };

  return (
    <AdminLayout title="Bảng điều khiển">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng số bài viết</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingArticles ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalArticles}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nhân vật lịch sử</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingArticles ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.nhanVat}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sự kiện lịch sử</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingArticles ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.suKien}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Triều đại lịch sử</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingArticles ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.trieuDai}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/admin/articles/new">
            <Button className="w-full h-24 text-lg" size="lg">
              <FileText className="mr-2 h-5 w-5" />
              Tạo bài viết mới
            </Button>
          </Link>
          <Link href="/admin/articles">
            <Button className="w-full h-24 text-lg" size="lg" variant="outline">
              <FileText className="mr-2 h-5 w-5" />
              Quản lý bài viết
            </Button>
          </Link>
          <Link href="/admin/media">
            <Button className="w-full h-24 text-lg" size="lg" variant="outline">
              <Image className="mr-2 h-5 w-5" />
              Quản lý media
            </Button>
          </Link>
        </div>

        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Bài viết gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingArticles ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border-b">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-64" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : recentArticles.length > 0 ? (
              <div className="space-y-2">
                {recentArticles.map((article: any) => (
                  <div key={article.id} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                    <div>
                      <h3 className="font-medium">{article.tieuDe}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{formatDate(article.ngayDang)}</span>
                        <span>•</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getCategoryInfo(article.danhMuc).color}`}>
                          {getCategoryInfo(article.danhMuc).label}
                        </span>
                      </div>
                    </div>
                    <Link href={`/admin/articles/edit/${article.id}`}>
                      <Button variant="ghost" size="sm">Chỉnh sửa</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
