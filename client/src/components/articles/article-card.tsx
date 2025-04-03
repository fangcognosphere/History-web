import { Link } from 'wouter';

interface ArticleCardProps {
  article: {
    id: number;
    tieuDe: string;
    tomTat?: string;
    danhMuc: string;
    anhDaiDien?: string;
    ngayDang: string;
    thoiGianDoc?: number;
    nhanVatId?: number;
    suKienId?: number;
    trieuDaiId?: number;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Helper to get the category label and color
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const categoryInfo = getCategoryInfo(article.danhMuc);

  // Placeholder images based on category if no image is provided
  const getDefaultImage = (category: string) => {
    switch(category) {
      case 'NhanVat':
        return 'https://images.unsplash.com/photo-1555921015-5532091f6026?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
      case 'SuKien':
        return 'https://images.unsplash.com/photo-1622956386584-34ea7171d8d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
      case 'TrieuDai':
        return 'https://images.unsplash.com/photo-1640006807976-a6127e9d6fa0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80';
      default:
        return `https://source.unsplash.com/random/800x600?sig=${article.id}`;
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.anhDaiDien || getDefaultImage(article.danhMuc)} 
          alt={article.tieuDe} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 text-white text-xs font-medium px-2 py-1 m-2 rounded" style={{ backgroundColor: categoryInfo.color }}>
          {categoryInfo.label}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>{formatDate(article.ngayDang)}</span>
          <span className="mx-2">•</span>
          <span>{article.thoiGianDoc || 5} phút đọc</span>
        </div>
        <h3 className="font-serif font-bold text-xl mb-2">{article.tieuDe}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {article.tomTat || 'Không có tóm tắt'}
        </p>
        <div className="flex justify-between items-center">
          <Link href={`/article/${article.id}`} className="text-primary dark:text-primary font-medium hover:underline">
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
    </article>
  );
}
