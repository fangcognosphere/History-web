-- Khởi tạo enum cho danh mục bài viết và vai trò người dùng
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'danh_muc') THEN
        CREATE TYPE danh_muc AS ENUM ('NhanVat', 'SuKien', 'TrieuDai');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vai_tro') THEN
        CREATE TYPE vai_tro AS ENUM ('Admin', 'User');
    END IF;
END $$;

-- Bảng tài khoản người dùng
CREATE TABLE IF NOT EXISTS "TaiKhoan" (
    "id" SERIAL PRIMARY KEY,
    "HoTen" TEXT NOT NULL,
    "TenDangNhap" TEXT NOT NULL UNIQUE,
    "MatKhau" TEXT NOT NULL,
    "VaiTro" vai_tro DEFAULT 'User',
    "NgayTao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng triều đại
CREATE TABLE IF NOT EXISTS "TrieuDai" (
    "id" SERIAL PRIMARY KEY,
    "TenTrieuDai" TEXT NOT NULL,
    "BatDau" INTEGER,
    "KetThuc" INTEGER,
    "MoTa" TEXT,
    "HinhAnh" TEXT
);

-- Bảng nhân vật lịch sử
CREATE TABLE IF NOT EXISTS "NhanVat" (
    "id" SERIAL PRIMARY KEY,
    "TenNhanVat" TEXT NOT NULL,
    "NamSinh" INTEGER,
    "NamMat" INTEGER,
    "MoTa" TEXT,
    "TrieuDaiId" INTEGER REFERENCES "TrieuDai"("id"),
    "HinhAnh" TEXT
);

-- Bảng sự kiện lịch sử
CREATE TABLE IF NOT EXISTS "SuKien" (
    "id" SERIAL PRIMARY KEY,
    "TenSuKien" TEXT NOT NULL,
    "NamXayRa" INTEGER,
    "MoTa" TEXT,
    "TrieuDaiId" INTEGER REFERENCES "TrieuDai"("id"),
    "HinhAnh" TEXT
);

-- Bảng bài viết
CREATE TABLE IF NOT EXISTS "BaiViet" (
    "id" SERIAL PRIMARY KEY,
    "TieuDe" TEXT NOT NULL,
    "NoiDung" TEXT NOT NULL,
    "TomTat" TEXT,
    "DanhMuc" danh_muc NOT NULL,
    "AnhDaiDien" TEXT,
    "LuotXem" INTEGER DEFAULT 0,
    "NoiBat" BOOLEAN DEFAULT FALSE,
    "NgayDang" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "ThoiGianDoc" INTEGER DEFAULT 5,
    "TaiKhoanId" INTEGER REFERENCES "TaiKhoan"("id"),
    "NhanVatId" INTEGER REFERENCES "NhanVat"("id"),
    "SuKienId" INTEGER REFERENCES "SuKien"("id"),
    "TrieuDaiId" INTEGER REFERENCES "TrieuDai"("id")
);

-- Bảng hình ảnh
CREATE TABLE IF NOT EXISTS "HinhAnh" (
    "id" SERIAL PRIMARY KEY,
    "DuongDan" TEXT NOT NULL,
    "MoTa" TEXT,
    "TieuDe" TEXT,
    "BaiVietId" INTEGER REFERENCES "BaiViet"("id") ON DELETE CASCADE,
    "NgayTao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng video
CREATE TABLE IF NOT EXISTS "Video" (
    "id" SERIAL PRIMARY KEY,
    "DuongDan" TEXT NOT NULL,
    "MoTa" TEXT,
    "TieuDe" TEXT,
    "BaiVietId" INTEGER REFERENCES "BaiViet"("id") ON DELETE CASCADE,
    "NgayTao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo tài khoản admin mặc định (mật khẩu: admin123)
-- Lưu mật khẩu dạng văn bản thường để dễ quản lý
INSERT INTO "TaiKhoan" ("HoTen", "TenDangNhap", "MatKhau", "VaiTro")
SELECT 'Admin User', 'admin', 'admin123', 'Admin'
WHERE NOT EXISTS (
    SELECT 1 FROM "TaiKhoan" WHERE "TenDangNhap" = 'admin'
);

-- Tạo bảng session cho connect-pg-simple (sử dụng cho express-session)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");