import { Link } from "wouter";

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
    switch (category) {
      case "NhanVat":
        return { label: "Nhân Vật", color: "bg-red-600" };
      case "SuKien":
        return { label: "Sự Kiện", color: "bg-orange-600" };
      case "TrieuDai":
        return { label: "Thời Kỳ", color: "bg-blue-600" };
      default:
        return { label: "Khác", color: "bg-gray-600" };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const categoryInfo = getCategoryInfo(article.danhMuc);

  // Placeholder images based on category if no image is provided
  const getDefaultImage = (category: string) => {
    switch (category) {
      case "NhanVat":
        return "https://files.catbox.moe/zvganu.jpg"; // Hình ảnh về nhân vật lịch sử Việt Nam
      case "SuKien":
        return "https://files.catbox.moe/tk9m8n.jpg"; // Hình ảnh về sự kiện lịch sử Việt Nam
      case "TrieuDai":
        return "https://i.imgur.com/uDR7Rk7.jpg"; // Hình ảnh về các thời kỳ lịch sử Việt Nam
      default:
        return "https://i.imgur.com/JBYauhI.jpg"; // Hình ảnh lịch sử Việt Nam chung
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
        <div
          className="absolute top-0 right-0 text-white text-xs font-medium px-2 py-1 m-2 rounded"
          style={{ backgroundColor: categoryInfo.color }}
        >
          {categoryInfo.label}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>{formatDate(article.ngayDang)}</span>
          {article.thoiGianDoc && article.thoiGianDoc > 0 && (
            <>
              <span className="mx-2">•</span>
              <span>{article.thoiGianDoc} phút đọc</span>
            </>
          )}
        </div>
        <h3 className="font-serif font-bold text-xl mb-2">{article.tieuDe}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {article.tomTat || "Không có tóm tắt"}
        </p>
        <div className="flex justify-between items-center">
          <Link
            href={`/article/${article.id}`}
            className="text-red-600 dark:text-red-400 font-medium hover:underline flex items-center"
          >
            Đọc tiếp
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
          <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-red-500 dark:hover:text-red-400">
              <i className="far fa-bookmark"></i>
            </button>
            <button className="text-gray-400 hover:text-red-500 dark:hover:text-red-400">
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
