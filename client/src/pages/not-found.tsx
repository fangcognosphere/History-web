import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { SiteLayout } from "@/components/layout/site-layout";

export default function NotFound() {
  return (
    <SiteLayout title="Không tìm thấy trang">
      <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 py-16">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="flex flex-col items-center mb-8">
            <AlertCircle className="h-20 w-20 text-red-500 mb-4" />
            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">404 - Không tìm thấy trang</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/">
              <Button size="lg" className="min-w-[150px]">
                Về trang chủ
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg" className="min-w-[150px]">
                Tìm kiếm
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Có thể bạn quan tâm:</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/category/NhanVat">
                <Button variant="link" className="text-red-600 dark:text-red-400">Nhân vật lịch sử</Button>
              </Link>
              <Link href="/category/SuKien">
                <Button variant="link" className="text-red-600 dark:text-red-400">Sự kiện lịch sử</Button>
              </Link>
              <Link href="/category/TrieuDai">
                <Button variant="link" className="text-red-600 dark:text-red-400">Thời kỳ lịch sử</Button>
              </Link>
              <Link href="/timeline">
                <Button variant="link" className="text-red-600 dark:text-red-400">Dòng thời gian</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
