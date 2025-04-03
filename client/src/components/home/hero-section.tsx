import { Link } from 'wouter';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: "url('https://vanhoavaphattrien.vn/uploads/images/blog/photongbientap/2023/02/10/b1dbphu-1676017164.jpg')"
        }}
      ></div>
      <div className="container mx-auto px-4 py-24 sm:py-32 md:py-40 relative z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            Khám Phá <span className="text-red-400">4000 Năm</span> Lịch Sử Dân Tộc Việt Nam
          </h1>
          <p className="text-lg sm:text-xl mb-10 leading-relaxed">
            Hành trình qua các thời kỳ lịch sử, câu chuyện về những nhân vật anh hùng và các sự kiện quan trọng đã định hình nên đất nước Việt Nam hôm nay.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/timeline" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-medium transition-colors shadow-lg flex items-center">
              Dòng thời gian
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </Link>
            <Link href="#featured" className="bg-transparent hover:bg-white/20 border-2 border-white px-8 py-4 rounded-lg font-medium transition-colors">
              Khám phá ngay
            </Link>
          </div>
        </div>
      </div>
      {/* Overlay gradient at bottom to blend into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
    </section>
  );
}
