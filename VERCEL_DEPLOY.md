# Hướng dẫn triển khai trên Vercel

Đây là hướng dẫn chi tiết cách triển khai ứng dụng lên Vercel.

## 1. Chuẩn bị dự án trên GitHub

1. Tạo repository trên GitHub
2. Push code lên repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/vietnam-history.git
git push -u origin main
```

## 2. Chuẩn bị cơ sở dữ liệu

Để triển khai lên Vercel, bạn cần một cơ sở dữ liệu PostgreSQL có thể truy cập công khai. Bạn có thể sử dụng:

- [Neon PostgreSQL](https://neon.tech/) (Khuyên dùng)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)

### Sử dụng Neon PostgreSQL:

1. Đăng ký tài khoản tại [Neon](https://neon.tech/)
2. Tạo dự án mới
3. Tạo cơ sở dữ liệu mới
4. Lấy connection string từ Dashboard
5. Khởi tạo schema bằng cách sử dụng SQL Editor để chạy nội dung từ file `database/init.sql`

## 3. Đăng ký tài khoản Vercel

1. Truy cập [Vercel](https://vercel.com/)
2. Đăng ký tài khoản mới hoặc đăng nhập nếu đã có
3. Kết nối tài khoản GitHub của bạn với Vercel

## 4. Tạo dự án mới trên Vercel

1. Nhấp vào "Add New..."
2. Chọn "Project"
3. Chọn repository GitHub chứa dự án của bạn
4. Cấu hình như sau:
   - Project Name: tên dự án của bạn
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist/public

## 5. Cấu hình biến môi trường

Trong phần "Environment Variables", thêm các biến sau:

```
DATABASE_URL=your_postgres_connection_string
SESSION_SECRET=your_session_secret
NODE_ENV=production
```

## 6. Deploy

1. Nhấp vào "Deploy"
2. Đợi quá trình triển khai hoàn tất
3. Khi hoàn tất, Vercel sẽ cung cấp URL để truy cập ứng dụng của bạn

## 7. Xác minh triển khai

1. Nhấp vào URL được cung cấp để truy cập ứng dụng
2. Đăng nhập với tài khoản admin mặc định:
   - Tên đăng nhập: `admin`
   - Mật khẩu: `admin123`

## 8. Cấu hình CI/CD

Vercel sẽ tự động triển khai lại ứng dụng của bạn mỗi khi bạn push code mới lên branch `main`. Bạn không cần cấu hình gì thêm.

## 9. Cấu hình tên miền tùy chỉnh (Không bắt buộc)

1. Trong dashboard của dự án trên Vercel, chọn "Domains"
2. Nhập tên miền của bạn
3. Làm theo hướng dẫn để cấu hình DNS

## Xử lý sự cố

Nếu gặp lỗi trong quá trình triển khai:

1. Kiểm tra logs trong phần "Deployments" của Vercel
2. Đảm bảo biến môi trường DATABASE_URL chính xác
3. Kiểm tra kết nối đến cơ sở dữ liệu
4. Đảm bảo file vercel.json trong dự án của bạn đã được cấu hình chính xác

## Ghi chú

- Vercel miễn phí cho các dự án cá nhân và các tổ chức nhỏ
- Cơ sở dữ liệu PostgreSQL yêu cầu kế hoạch riêng (miễn phí hoặc trả phí tùy nhà cung cấp)
- Luôn giữ an toàn các thông tin nhạy cảm như connection string và mật khẩu
- Thay đổi mật khẩu admin mặc định sau khi triển khai thành công