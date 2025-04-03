# Hướng dẫn cài đặt và chạy trên Windows

Đây là hướng dẫn chi tiết cách cài đặt và chạy ứng dụng trên hệ điều hành Windows.

## 1. Cài đặt Node.js và npm

1. Tải Node.js từ trang chủ: https://nodejs.org/en/download/ (khuyên dùng phiên bản LTS)
2. Cài đặt Node.js theo hướng dẫn
3. Kiểm tra cài đặt bằng cách mở Command Prompt và chạy:
   ```
   node -v
   npm -v
   ```

## 2. Cài đặt PostgreSQL và pgAdmin 4

1. Tải PostgreSQL từ trang chủ: https://www.postgresql.org/download/windows/
2. Cài đặt PostgreSQL và pgAdmin 4 theo hướng dẫn
3. Trong quá trình cài đặt:
   - Ghi nhớ mật khẩu cho người dùng postgres
   - Giữ cổng mặc định là 5432
   - Cài đặt tất cả các components được đề xuất

## 3. Tạo cơ sở dữ liệu

1. Mở pgAdmin 4
2. Nhập mật khẩu bạn đã tạo trong quá trình cài đặt PostgreSQL
3. Trong Object Explorer (bên trái), kết nối đến máy chủ PostgreSQL
4. Nhấp chuột phải vào "Databases" và chọn "Create > Database..."
5. Đặt tên cho cơ sở dữ liệu là: `LichSuVietNam`
6. Nhấp vào "Save" để tạo cơ sở dữ liệu

## 4. Nhập cấu trúc cơ sở dữ liệu

1. Nhấp chuột phải vào cơ sở dữ liệu `LichSuVietNam` và chọn "Query Tool"
2. Mở file `database/init.sql` trong project
3. Sao chép toàn bộ nội dung và dán vào Query Tool
4. Nhấp vào nút "Execute/Refresh" (biểu tượng sấm sét) để chạy script

## 5. Cấu hình môi trường

1. Tạo file `.env` trong thư mục gốc của dự án
2. Sao chép nội dung từ file `.env.example` và điền thông tin của bạn:
   ```
   # Database
   DATABASE_URL=postgres://postgres:1@localhost:5432/LichSuVietNam
   PGUSER=postgres
   PGPASSWORD=1
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=LichSuVietNam

   # Session
   SESSION_SECRET=your_session_secret

   # Server
   PORT=5000

   # Environment
   NODE_ENV=development
   ```
   Thay `your_session_secret` bằng một chuỗi bất kỳ cho SESSION_SECRET.

## 6. Chuẩn bị package.json và vite.config.js

1. Sao chép nội dung từ `package.json.local` vào `package.json`
2. Sao chép nội dung từ `vite.config.js.local` vào `vite.config.js` (tạo mới nếu chưa có)

## 7. Cài đặt các gói phụ thuộc

1. Mở Command Prompt trong thư mục gốc của dự án
2. Chạy lệnh:
   ```
   npm install
   ```

## 8. Chạy ứng dụng

1. Mở Command Prompt trong thư mục gốc của dự án
2. Chạy lệnh:
   ```
   npm run windows:dev
   ```
3. Truy cập ứng dụng tại địa chỉ: http://localhost:5000

## 9. Đăng nhập vào hệ thống

Sử dụng tài khoản admin mặc định:
- Tên đăng nhập: `admin`
- Mật khẩu: `admin123`

## Ghi chú

- Nếu bạn gặp lỗi khi chạy ứng dụng, hãy kiểm tra:
  - PostgreSQL đang chạy
  - Thông tin kết nối trong file `.env` chính xác
  - Cơ sở dữ liệu đã được tạo và khởi tạo đúng cách
  - Node.js và npm được cài đặt đúng phiên bản

- Để build ứng dụng cho production, chạy:
  ```
  npm run windows:build
  ```

- Để chạy ứng dụng đã build, chạy:
  ```
  npm run windows:start
  ```