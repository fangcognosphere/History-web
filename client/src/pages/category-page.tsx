import { useState, useEffect } from 'react';
import { useParams, useSearch, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { SiteLayout } from '@/components/layout/site-layout';
import { ArticleGrid } from '@/components/articles/article-grid';
import { Button } from '@/components/ui/button';
import { withPageLoading } from '@/hooks/with-page-loading';

function CategoryPage() {
  const { category } = useParams();
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Get category title for display
  const getCategoryTitle = () => {
    switch(category) {
      case 'NhanVat': return 'Nhân Vật Lịch Sử';
      case 'SuKien': return 'Sự Kiện Lịch Sử';
      case 'TrieuDai': return 'Thời Kỳ Lịch Sử';
      case 'all': return 'Tất Cả Bài Viết';
      default: return 'Danh Mục';
    }
  };

  // Fetch articles based on category
  const { data, isLoading } = useQuery({
    queryKey: [category === 'all' ? '/api/article' : `/api/article/category/${category}`, page, pageSize],
    queryFn: async () => {
      const url = category === 'all' 
        ? `/api/article?limit=${pageSize}&offset=${(page-1) * pageSize}` 
        : `/api/article/category/${category}?limit=${pageSize}&offset=${(page-1) * pageSize}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch articles');
      return res.json();
    },
  });

  const articles = data || [];
  const hasMorePages = Array.isArray(articles) && articles.length === pageSize;

  const loadMoreArticles = () => {
    setPage(prev => prev + 1);
  };

  return (
    <SiteLayout title={getCategoryTitle()}>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold">{getCategoryTitle()}</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {category === 'NhanVat' && 'Khám phá cuộc đời và sự nghiệp của những nhân vật đã để lại dấu ấn trong lịch sử Việt Nam.'}
            {category === 'SuKien' && 'Tìm hiểu về những sự kiện quan trọng đã định hình lịch sử và văn hóa của dân tộc Việt Nam.'}
            {category === 'TrieuDai' && 'Hành trình qua các thời kỳ lịch sử đã tồn tại trong tiến trình phát triển của Việt Nam từ thời Hùng Vương đến thời kỳ hiện đại.'}
            {category === 'all' && 'Tổng hợp tất cả các bài viết về lịch sử, văn hóa và con người Việt Nam.'}
          </p>
        </header>

        <ArticleGrid 
          articles={articles} 
          isLoading={isLoading} 
          emptyMessage={`Không tìm thấy bài viết nào trong danh mục ${getCategoryTitle()}`}
        />

        {hasMorePages && (
          <div className="mt-8 text-center">
            <Button onClick={loadMoreArticles} variant="outline" size="lg">
              Xem thêm
            </Button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

export default withPageLoading(CategoryPage);
