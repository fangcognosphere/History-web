# Hướng dẫn cài đặt và chạy dự án trên Windows

Tài liệu này cung cấp hướng dẫn chi tiết để chạy dự án trên máy tính Windows local và triển khai lên Vercel.

## 1. Thay thế các dependency của Replit

Mở file `package.json` và thực hiện các thay đổi sau:

### 1.1. Xóa các dependency liên quan đến Replit

```json
// Xóa các dòng này khỏi phần dependencies
"@replit/vite-plugin-shadcn-theme-json": "^0.0.4",
```

```json
// Xóa các dòng này khỏi phần devDependencies
"@replit/vite-plugin-cartographer": "^0.0.11",
"@replit/vite-plugin-runtime-error-modal": "^0.0.3",
```

### 1.2. Thêm các dependency thay thế

```json
// Thêm vào phần dependencies
"shadcn-ui-theme-plugin": "^1.1.1",
```

```json
// Thêm vào phần devDependencies
"@vitejs/plugin-react-swc": "^3.5.0",
"vite-plugin-error-overlay": "^1.1.0",
```

## 2. Cập nhật cấu hình Vite

Thay đổi nội dung file `vite.config.ts` như sau:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Thay thế các import từ Replit
import themePlugin from "shadcn-ui-theme-plugin";
import errorOverlay from "vite-plugin-error-overlay";

export default defineConfig({
  plugins: [
    react(),
    errorOverlay(),
    themePlugin(),
    // Xóa phần này vì nó chỉ dành cho Replit
    // ...(process.env.NODE_ENV !== "production" &&
    // process.env.REPL_ID !== undefined
    //   ? [
    //       await import("@replit/vite-plugin-cartographer").then((m) =>
    //         m.cartographer(),
    //       ),
    //     ]
    //   : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
```

## 3. Thiết lập biến môi trường cho Database

Tạo file `.env` tại thư mục gốc với nội dung sau:

```
DATABASE_URL=postgresql://username:password@localhost:5432/LichSuVietNam
PGUSER=username
PGPASSWORD=password
PGDATABASE=LichSuVietNam
PGHOST=localhost
PGPORT=5432
```

Thay thế `username` và `password` bằng thông tin đăng nhập của bạn.

## 4. Thiết lập Database PostgreSQL

### Cài đặt PostgreSQL trên Windows

1. Tải và cài đặt PostgreSQL từ [trang chủ](https://www.postgresql.org/download/windows/)
2. Trong quá trình cài đặt, hãy nhớ mật khẩu bạn đặt cho user `postgres`
3. Cài đặt pgAdmin 4 từ [trang chủ](https://www.pgadmin.org/download/pgadmin-4-windows/)

### Tạo Database

1. Mở pgAdmin 4
2. Kết nối đến server PostgreSQL local
3. Tạo một database mới với tên `LichSuVietNam`:
   - Chuột phải vào "Databases"
   - Chọn "Create" -> "Database"
   - Nhập tên "LichSuVietNam"
   - Nhấn "Save"

## 5. Cài đặt và chạy dự án

```bash
# Cài đặt dependencies
npm install

# Tạo schema database
npm run db:push

# Khởi động dự án ở chế độ development
npm run dev
```

## 6. Triển khai lên Vercel

### 6.1. Tạo file cấu hình Vercel

Tạo file `vercel.json` tại thư mục gốc:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ]
}
```

### 6.2. Đăng ký Database

1. Đăng ký một tài khoản trên [Neon](https://neon.tech/) hoặc [Supabase](https://supabase.com/) để có PostgreSQL database miễn phí
2. Tạo một project mới và lấy connection string
3. Thêm biến môi trường `DATABASE_URL` vào dự án Vercel của bạn

### 6.3. Kết nối GitHub và triển khai

1. Đẩy code lên GitHub
2. Kết nối repository với Vercel
3. Cấu hình các biến môi trường:
   - `DATABASE_URL`
   - `SESSION_SECRET` (một chuỗi ngẫu nhiên để mã hóa session)
   - Các biến PostgreSQL khác nếu cần

4. Triển khai dự án và truy cập vào URL được Vercel cung cấp