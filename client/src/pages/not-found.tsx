import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SiteLayout } from "@/components/layout/site-layout";

export default function NotFound() {
  return (
    <SiteLayout title="Không tìm thấy trang">
      <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 py-16">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-bold text-red-600 dark:text-red-500">
                  404
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Không tìm thấy trang
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
              chuyển.
            </p>
            <p className="text-md italic text-gray-500 dark:text-gray-400 mt-2">
              "Nước có nguồn thì nguồn trong mới chảy. Nhà có gốc thì cây vững
              mới bền" - Tục ngữ Việt Nam
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Khám phá các nội dung khác:
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/category/NhanVat">
                <Button
                  variant="link"
                  className="text-red-600 dark:text-red-400"
                >
                  Nhân vật lịch sử
                </Button>
              </Link>
              <Link href="/category/SuKien">
                <Button
                  variant="link"
                  className="text-red-600 dark:text-red-400"
                >
                  Sự kiện lịch sử
                </Button>
              </Link>
              <Link href="/category/TrieuDai">
                <Button
                  variant="link"
                  className="text-red-600 dark:text-red-400"
                >
                  Thời kỳ lịch sử
                </Button>
              </Link>
              <Link href="/timeline">
                <Button
                  variant="link"
                  className="text-red-600 dark:text-red-400"
                >
                  Dòng thời gian
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
