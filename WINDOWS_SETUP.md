# Hướng dẫn cài đặt và chạy dự án trên Windows

## Yêu cầu hệ thống

- Node.js phiên bản 18.x trở lên
- PostgreSQL phiên bản 14.x trở lên (thông qua pgAdmin 4)
- Git

## Cài đặt Node.js

1. Tải và cài đặt Node.js từ trang chủ: https://nodejs.org/
2. Chọn phiên bản LTS (Long Term Support)
3. Làm theo hướng dẫn cài đặt
4. Kiểm tra cài đặt bằng cách mở Command Prompt và chạy:
   ```
   node --version
   npm --version
   ```

## Cài đặt PostgreSQL và pgAdmin 4

1. Tải và cài đặt PostgreSQL từ trang chủ: https://www.postgresql.org/download/windows/
2. Trong quá trình cài đặt:
   - Chọn cài đặt pgAdmin 4
   - Đặt mật khẩu cho tài khoản postgres là "1"
   - Chọn cổng mặc định 5432
   - Hoàn thành cài đặt
3. Mở pgAdmin 4 và đăng nhập

## Tạo cơ sở dữ liệu

1. Mở pgAdmin 4
2. Kết nối vào PostgreSQL server
3. Tạo database mới với tên "LichSuVietNam"
4. Sử dụng tập lệnh SQL được cung cấp trong file `database.sql` để khởi tạo cấu trúc và dữ liệu mẫu:
   - Nhấp chuột phải vào database "LichSuVietNam"
   - Chọn "Query Tool"
   - Mở file `database.sql` hoặc copy nội dung và dán vào Query Editor
   - Chạy script

## Cài đặt và chạy dự án

1. Clone repo từ GitHub:
   ```
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Cài đặt các dependency:
   ```
   npm install
   ```

3. Tạo file `.env` ở thư mục gốc với nội dung sau:
   ```
   DATABASE_URL="postgresql://postgres:1@localhost:5432/LichSuVietNam?schema=public"
   SESSION_SECRET="your-secret-key"
   ```

4. Chạy ứng dụng:
   ```
   npm run dev
   ```

5. Truy cập ứng dụng tại địa chỉ: http://localhost:5000

## Sử dụng NeonDB (Cấu hình thay thế)

Nếu bạn muốn sử dụng Neon Database thay vì PostgreSQL local:

1. Thay đổi chuỗi kết nối trong file `.env`:
   ```
   DATABASE_URL="postgresql://neondb_owner:npg_kzRBjytS8im5@ep-blue-dream-a16miz8h-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   SESSION_SECRET="your-secret-key"
   ```

2. Đảm bảo tường lửa cho phép kết nối đến endpoint của Neon Database

## Đăng nhập Admin

- URL: http://localhost:5000/auth
- Tên đăng nhập: admin
- Mật khẩu: 1

## Xử lý sự cố

1. **Lỗi kết nối cơ sở dữ liệu**
   - Đảm bảo PostgreSQL đang chạy
   - Kiểm tra thông tin kết nối trong file `.env`
   - Kiểm tra tường lửa không chặn kết nối đến PostgreSQL

2. **Lỗi không thể tạo bảng**
   - Đảm bảo database đã được tạo
   - Đảm bảo tài khoản PostgreSQL có quyền tạo bảng

3. **Lỗi không thể khởi động ứng dụng**
   - Kiểm tra cổng 5000 không bị chiếm bởi ứng dụng khác
   - Kiểm tra các dependency đã được cài đặt đầy đủ

4. **Không thể đăng nhập admin**
   - Đảm bảo đã chạy script SQL để tạo tài khoản admin
   - Kiểm tra kết nối đến cơ sở dữ liệu đang hoạt động