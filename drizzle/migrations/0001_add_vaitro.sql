-- Tạo enum vai_tro nếu chưa tồn tại
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vai_tro') THEN
        CREATE TYPE vai_tro AS ENUM ('Admin', 'User');
    END IF;
END $$;

-- Thêm cột VaiTro vào bảng TaiKhoan nếu chưa tồn tại
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'TaiKhoan' AND column_name = 'VaiTro'
    ) THEN
        ALTER TABLE "TaiKhoan" ADD COLUMN "VaiTro" vai_tro DEFAULT 'User';
    END IF;
END $$;

-- Cập nhật tài khoản admin hiện có
UPDATE "TaiKhoan" 
SET "VaiTro" = 'Admin' 
WHERE "TenDangNhap" = 'admin' AND ("VaiTro" IS NULL OR "VaiTro" != 'Admin');