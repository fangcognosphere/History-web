import { Link } from 'wouter';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-800 to-primary-700 text-white">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0 bg-[url('https://vanhoavaphattrien.vn/uploads/images/blog/photongbientap/2023/02/10/b1dbphu-1676017164.jpg')] bg-cover bg-center opacity-40"></div>
      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Khám Phá Chiều Sâu Lịch Sử Việt Nam</h1>
          <p className="text-lg sm:text-xl mb-8">Hành trình qua các triều đại, câu chuyện về những nhân vật lịch sử và các sự kiện quan trọng đã định hình đất nước hôm nay.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#featured" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
              Khám Phá Ngay
            </Link>
            <Link href="#categories" className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors">
              Xem Danh Mục
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
