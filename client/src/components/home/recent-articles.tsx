import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

interface Article {
  id: number;
  tieuDe: string;
  tomTat: string;
  anhDaiDien: string;
  danhMuc: string;
  ngayDang: string;
  luotXem: number;
}

export function RecentArticles() {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/article'],
    queryFn: async () => {
      const res = await fetch('/api/article?limit=5');
      if (!res.ok) throw new Error('Failed to fetch recent articles');
      return res.json();
    },
  });

  // First article will be featured, rest will be in the list
  const featuredArticle = data && data.length > 0 ? data[0] : null;
  const recentArticles = data && data.length > 1 ? data.slice(1, 5) : [];

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Get category label and color
  const getCategoryInfo = (category: string) => {
    switch(category) {
      case 'NhanVat':
        return { label: 'Nhân Vật', color: 'bg-primary-700' };
      case 'SuKien':
        return { label: 'Sự Kiện', color: 'bg-secondary-600' };
      case 'TrieuDai':
        return { label: 'Triều Đại', color: 'bg-blue-600' };
      default:
        return { label: 'Khác', color: 'bg-gray-600' };
    }
  };

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Bài Viết Mới Nhất</h2>
          <Link href="/category/all" className="text-primary dark:text-primary hover:underline font-medium">
            Xem tất cả
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Featured Recent Article */}
          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
              <Skeleton className="h-64 sm:h-72 md:h-80 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-5/6" />
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          ) : featuredArticle ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                <img 
                  src={featuredArticle.anhDaiDien || 'https://images.unsplash.com/photo-1673717936364-5b0df399bbd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'} 
                  alt={featuredArticle.tieuDe} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 text-white text-xs font-medium px-2 py-1 m-3 rounded" style={{ backgroundColor: getCategoryInfo(featuredArticle.danhMuc).color }}>
                  {getCategoryInfo(featuredArticle.danhMuc).label}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>{formatDate(featuredArticle.ngayDang)}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredArticle.luotXem} lượt xem</span>
                </div>
                <h3 className="font-serif font-bold text-2xl mb-3">{featuredArticle.tieuDe}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {featuredArticle.tomTat}
                </p>
                <div className="flex justify-between items-center">
                  <Link href={`/article/${featuredArticle.id}`} className="text-primary dark:text-primary font-medium hover:underline">
                    Đọc tiếp
                  </Link>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-primary dark:hover:text-primary">
                      <i className="far fa-bookmark"></i>
                    </button>
                    <button className="text-gray-400 hover:text-primary dark:hover:text-primary">
                      <i className="fas fa-share-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
              <p>Không có bài viết nào.</p>
            </div>
          )}
          
          {/* Right Column - Recent Article List */}
          <div className="space-y-4">
            {isLoading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                  <Skeleton className="w-1/3 h-32" />
                  <div className="w-2/3 p-4 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))
            ) : recentArticles.length > 0 ? (
              recentArticles.map((article: Article) => (
                <article key={article.id} className="flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                  <div className="w-1/3 h-32 relative">
                    <img 
                      src={article.anhDaiDien || `https://source.unsplash.com/random/300x200?sig=${article.id}`} 
                      alt={article.tieuDe} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 right-0 text-white text-xs font-medium px-2 py-1 m-2 rounded" style={{ backgroundColor: getCategoryInfo(article.danhMuc).color }}>
                      {getCategoryInfo(article.danhMuc).label}
                    </div>
                  </div>
                  <div className="w-2/3 p-4">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>{formatDate(article.ngayDang)}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2">{article.tieuDe}</h3>
                    <Link href={`/article/${article.id}`} className="text-primary dark:text-primary text-sm font-medium hover:underline">
                      Đọc tiếp
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                <p>Không có bài viết nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
