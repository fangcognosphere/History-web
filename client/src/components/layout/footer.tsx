import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Site */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="https://files.catbox.moe/ta56ul.png"
                alt="Logo"
                className="h-10 w-auto"
              />
              <h3 className="text-xl font-serif font-bold text-white">
                Lịch Sử Việt Nam
              </h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed">
              Trang thông tin lịch sử Việt Nam cung cấp kiến thức từ nguồn đáng tin cậy, giúp bạn hiểu sâu sắc hơn về dân tộc và đất nước.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/category/NhanVat"
                  className="hover:text-white transition-colors"
                >
                  Nhân Vật Lịch Sử
                </Link>
              </li>
              <li>
                <Link
                  href="/category/SuKien"
                  className="hover:text-white transition-colors"
                >
                  Sự Kiện Lịch Sử
                </Link>
              </li>
              <li>
                <Link
                  href="/category/TrieuDai"
                  className="hover:text-white transition-colors"
                >
                  Thời kỳ
                </Link>
              </li>
              <li>
                <Link
                  href="/timeline"
                  className="hover:text-white transition-colors"
                >
                  Dòng thời gian
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors"
                >
                  Quản Trị
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">Danh Mục</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Thời Kỳ Đồ Đá
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Văn Lang - Âu Lạc
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Thời Kỳ Bắc Thuộc
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Thời Kỳ Độc Lập
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Thời Kỳ Đại Việt
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Thời Kỳ Cận - Hiện Đại
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt mt-1 text-primary"></i>
                <span>Phúc Thọ, Hà Nội</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-phone-alt text-primary"></i>
                <span>+84865968103</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-envelope text-primary"></i>
                <span>contact.fang@proton.me</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-clock text-primary"></i>
                <span>Thứ Hai - Thứ Sáu: 9:00 - 17:00</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Lịch Sử Việt Nam. Tất cả các quyền
            được bảo lưu.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm hover:text-white transition-colors">
              Chính Sách Bảo Mật
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors">
              Điều Khoản Sử Dụng
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-primary text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all duration-300"
        aria-label="Lên đầu trang"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </footer>
  );
}
