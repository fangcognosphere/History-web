import { ArticleCard } from '@/components/articles/article-card';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ArticleGridProps {
  articles: any[];
  isLoading: boolean;
  emptyMessage?: string;
}

export function ArticleGrid({ articles, isLoading, emptyMessage = "Không có bài viết nào" }: ArticleGridProps) {
  if (isLoading) {
    return (
      <div className="my-12">
        <LoadingSpinner size="lg" text="Đang tải bài viết..." centered={true} />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h3 className="text-xl font-medium mb-2">{emptyMessage}</h3>
        <p className="text-muted-foreground">Hãy quay lại sau nhé!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
