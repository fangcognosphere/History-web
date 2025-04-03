import { useQuery } from '@tanstack/react-query';
import { ArticleCard } from '@/components/articles/article-card';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedArticles() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['/api/article/featured'],
    queryFn: async () => {
      const res = await fetch('/api/article/featured');
      if (!res.ok) throw new Error('Failed to fetch featured articles');
      return res.json();
    },
  });

  return (
    <section id="featured" className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Bài Viết Nổi Bật</h2>
          <Link href="/category/all" className="text-primary dark:text-primary hover:underline font-medium">
            Xem tất cả
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))
          ) : articles.length === 0 ? (
            <div className="col-span-full text-center p-10">
              <h3 className="text-xl font-medium mb-2">Không có bài viết nổi bật</h3>
              <p className="text-muted-foreground">Hãy quay lại sau nhé!</p>
            </div>
          ) : (
            articles.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
