import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Eye, Tag } from 'lucide-react';

interface ArticleDetailProps {
  id: string;
}

export function ArticleDetail({ id }: ArticleDetailProps) {
  const { toast } = useToast();
  const articleId = parseInt(id);

  // Fetch article details
  const { 
    data: article, 
    isLoading,
    error 
  } = useQuery({
    queryKey: [`/api/article/${articleId}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/article/${articleId}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        return res.json();
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải bài viết. Vui lòng thử lại sau.",
          variant: "destructive",
        });
        throw error;
      }
    },
  });

  // Fetch article images
  const { 
    data: images = [], 
    isLoading: isLoadingImages 
  } = useQuery({
    queryKey: [`/api/image/article/${articleId}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/image/article/${articleId}`);
        if (!res.ok) throw new Error('Failed to fetch images');
        return res.json();
      } catch (error) {
        console.error("Failed to fetch images:", error);
        return [];
      }
    },
    enabled: !!article,
  });

  // Fetch article videos
  const { 
    data: videos = [], 
    isLoading: isLoadingVideos 
  } = useQuery({
    queryKey: [`/api/video/article/${articleId}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/video/article/${articleId}`);
        if (!res.ok) throw new Error('Failed to fetch videos');
        return res.json();
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        return [];
      }
    },
    enabled: !!article,
  });

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Helper to get category info
  const getCategoryInfo = (category: string) => {
    switch(category) {
      case 'NhanVat':
        return { label: 'Nhân Vật', path: '/category/NhanVat' };
      case 'SuKien':
        return { label: 'Sự Kiện', path: '/category/SuKien' };
      case 'TrieuDai':
        return { label: 'Triều Đại', path: '/category/TrieuDai' };
      default:
        return { label: 'Khác', path: '/' };
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
          <p className="mb-6">Bài viết này không tồn tại hoặc đã bị xóa.</p>
          <Link href="/">
            <Button>Về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-3/4 max-w-2xl mx-auto" />
          <div className="flex justify-center space-x-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      ) : article ? (
        <div className="max-w-4xl mx-auto">
          {/* Article header */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">{article.tieuDe}</h1>
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <time dateTime={article.ngayDang}>{formatDate(article.ngayDang)}</time>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{article.thoiGianDoc || 5} phút đọc</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{article.luotXem} lượt xem</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <Link href={getCategoryInfo(article.danhMuc).path} className="hover:text-primary">
                  {getCategoryInfo(article.danhMuc).label}
                </Link>
              </div>
            </div>
          </header>

          {/* Featured image */}
          {article.anhDaiDien && (
            <div className="mb-8">
              <figure className="rounded-lg overflow-hidden">
                <img 
                  src={article.anhDaiDien} 
                  alt={article.tieuDe}
                  className="w-full h-auto object-cover" 
                />
              </figure>
            </div>
          )}

          {/* Article content */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            {article.tomTat && (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6 italic">
                {article.tomTat}
              </div>
            )}
            
            <div dangerouslySetInnerHTML={{ __html: article.noiDung.replace(/\n/g, '<br />') }} />
          </div>

          {/* Image gallery */}
          {images.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-serif font-bold mb-4">Hình ảnh</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image: any) => (
                  <figure key={image.id} className="rounded-lg overflow-hidden">
                    <img 
                      src={image.duongDan} 
                      alt={image.tieuDe || 'Hình ảnh'} 
                      className="w-full h-48 object-cover"
                    />
                    {image.tieuDe && (
                      <figcaption className="text-sm text-center p-2 bg-gray-100 dark:bg-gray-700">
                        {image.tieuDe}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* Video gallery */}
          {videos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-serif font-bold mb-4">Video</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video: any) => (
                  <figure key={video.id} className="rounded-lg overflow-hidden">
                    {video.duongDan.startsWith('/uploads/') ? (
                      <video controls className="w-full">
                        <source src={video.duongDan} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ video tag.
                      </video>
                    ) : (
                      <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <a 
                          href={video.duongDan}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          <i className="fas fa-external-link-alt mr-2"></i>
                          Xem video (link ngoài)
                        </a>
                      </div>
                    )}
                    {video.tieuDe && (
                      <figcaption className="text-sm text-center p-2 bg-gray-100 dark:bg-gray-700">
                        {video.tieuDe}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* Share buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium mr-3">Chia sẻ:</span>
              <div className="inline-flex space-x-2">
                <button className="p-2 rounded-full bg-blue-600 text-white" aria-label="Chia sẻ Facebook">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="p-2 rounded-full bg-blue-400 text-white" aria-label="Chia sẻ Twitter">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="p-2 rounded-full bg-green-600 text-white" aria-label="Chia sẻ Whatsapp">
                  <i className="fab fa-whatsapp"></i>
                </button>
                <button className="p-2 rounded-full bg-gray-600 text-white" aria-label="Sao chép liên kết">
                  <i className="fas fa-link"></i>
                </button>
              </div>
            </div>
            <Link href="/" className="text-primary hover:underline">
              Quay lại
            </Link>
          </div>
        </div>
      ) : null}
    </article>
  );
}
