import { Link } from 'wouter';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-800 to-primary-700 text-white">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559125148-869baf508c95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')] bg-cover bg-center opacity-40"></div>
      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Khám Phá Chiều Sâu Lịch Sử Việt Nam</h1>
          <p className="text-lg sm:text-xl mb-8">Hành trình qua các triều đại, câu chuyện về những nhân vật lịch sử và các sự kiện quan trọng đã định hình đất nước hôm nay.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#featured" className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
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
