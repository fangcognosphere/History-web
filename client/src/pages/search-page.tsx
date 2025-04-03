import { useState, useEffect } from 'react';
import { useSearch, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { SiteLayout } from '@/components/layout/site-layout';
import { ArticleGrid } from '@/components/articles/article-grid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [search] = useSearch();
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(search);
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Reset page when search query changes
  useEffect(() => {
    setPage(1);
    setSearchInput(query);
  }, [query]);

  // Fetch search results
  const { data, isLoading } = useQuery({
    queryKey: ['/api/article/search', query, page, pageSize],
    queryFn: async () => {
      if (!query) return [];
      
      const res = await fetch(`/api/article/search?q=${encodeURIComponent(query)}&limit=${pageSize}&offset=${(page-1) * pageSize}`);
      if (!res.ok) throw new Error('Failed to search articles');
      return res.json();
    },
    enabled: !!query,
  });

  const articles = data || [];
  const hasMorePages = Array.isArray(articles) && articles.length === pageSize;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const loadMoreArticles = () => {
    setPage(prev => prev + 1);
  };

  return (
    <SiteLayout title={`Tìm kiếm: ${query}`}>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-center">Tìm kiếm</h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                Tìm kiếm
              </Button>
            </div>
          </form>
          
          {query && (
            <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
              Kết quả tìm kiếm cho: <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </header>

        {query ? (
          <>
            <ArticleGrid 
              articles={articles} 
              isLoading={isLoading} 
              emptyMessage={`Không tìm thấy kết quả nào cho "${query}"`}
            />

            {hasMorePages && (
              <div className="mt-8 text-center">
                <Button onClick={loadMoreArticles} variant="outline" size="lg">
                  Xem thêm
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Vui lòng nhập từ khóa để tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
