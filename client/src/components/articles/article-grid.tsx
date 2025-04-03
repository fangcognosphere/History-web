import { ArticleCard } from '@/components/articles/article-card';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleGridProps {
  articles: any[];
  isLoading: boolean;
  emptyMessage?: string;
}

export function ArticleGrid({ articles, isLoading, emptyMessage = "Không có bài viết nào" }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        // Loading skeletons
        Array(6).fill(0).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
            <Skeleton className="h-48 w-full" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
              </div>
            </div>
          </div>
        ))
      ) : articles.length === 0 ? (
        // Empty state
        <div className="col-span-full text-center p-10">
          <h3 className="text-xl font-medium mb-2">{emptyMessage}</h3>
          <p className="text-muted-foreground">Hãy quay lại sau nhé!</p>
        </div>
      ) : (
        // Actual article cards
        articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))
      )}
    </div>
  );
}
