# Hướng dẫn triển khai dự án lên Vercel

Tài liệu này hướng dẫn chi tiết cách triển khai dự án website lịch sử Việt Nam lên Vercel.

## 1. Chuẩn bị trước khi triển khai

### 1.1. Chuẩn bị mã nguồn

1. Tải mã nguồn về máy tính của bạn
2. Thực hiện các thay đổi được nêu trong `WINDOWS_SETUP.md` để loại bỏ các dependency của Replit
3. Kiểm tra ứng dụng hoạt động tốt trên máy local

### 1.2. Tạo tài khoản và chuẩn bị database

1. Đăng ký tài khoản trên [Vercel](https://vercel.com/)
2. Đăng ký tài khoản trên [Neon](https://neon.tech/) hoặc [Supabase](https://supabase.com/) để có PostgreSQL database miễn phí
3. Tạo project mới và database:
   - Với Neon: Trong dashboard, chọn "New Project", đặt tên và tạo project
   - Với Supabase: Tạo project mới, đặt tên và mật khẩu database

4. Lấy connection string:
   - Với Neon: Vào "Connection Details" và sao chép chuỗi PostgreSQL connection string
   - Với Supabase: Vào "Project Settings" > "Database" > "Connection String" và sao chép chuỗi PostgreSQL connection string

## 2. Tạo repository GitHub

1. Đăng ký tài khoản trên [GitHub](https://github.com/) nếu bạn chưa có
2. Tạo repository mới:
   - Truy cập https://github.com/new
   - Đặt tên repository (ví dụ: "lichsuvietnam")
   - Chọn "Public" hoặc "Private" tùy theo nhu cầu
   - Nhấn "Create repository"

3. Đẩy code lên GitHub:
```bash
# Đi đến thư mục dự án
cd duong-dan-den-du-an

# Khởi tạo Git repository
git init

# Thêm tất cả các file vào Git
git add .

# Commit các file
git commit -m "Initial commit"

# Thêm remote repository
git remote add origin https://github.com/username/lichsuvietnam.git

# Đẩy code lên GitHub
git push -u origin main
```

## 3. Triển khai lên Vercel

### 3.1. Kết nối repository

1. Đăng nhập vào [Vercel](https://vercel.com/)
2. Nhấn vào "Add New..." > "Project"
3. Chọn repository GitHub của bạn từ danh sách
4. Cấu hình project:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist

### 3.2. Cấu hình biến môi trường

Thêm các biến môi trường sau:

- `DATABASE_URL`: Connection string của PostgreSQL database (lấy từ Neon hoặc Supabase)
- `SESSION_SECRET`: Một chuỗi ngẫu nhiên phức tạp để mã hóa phiên đăng nhập (có thể tạo bằng cách chạy `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `NODE_ENV`: `production`

### 3.3. Khởi tạo database

Sau khi triển khai thành công, bạn cần khởi tạo database:

1. Đi đến "Deployments" > Chọn deployment mới nhất
2. Nhấn vào tab "Functions" > "Console"
3. Chạy lệnh sau để khởi tạo schema database:
   ```
   npx drizzle-kit push
   ```

4. (Tùy chọn) Tiến hành seed database với dữ liệu ban đầu:
   ```
   npm run seed
   ```

## 4. Kiểm tra và kết luận

1. Sau khi triển khai, Vercel sẽ cung cấp một URL (ví dụ: https://lichsuvietnam.vercel.app)
2. Truy cập URL và kiểm tra xem website có hoạt động chính xác hay không
3. Kiểm tra các chức năng quan trọng:
   - Đăng nhập admin
   - Xem các bài viết
   - Xem dòng thời gian lịch sử
   - Chức năng tìm kiếm

## 5. Cấu hình tên miền tùy chỉnh (Tùy chọn)

Nếu bạn có tên miền riêng, bạn có thể cấu hình trong Vercel:

1. Trong dashboard của project, chọn "Settings" > "Domains"
2. Nhập tên miền của bạn (ví dụ: lichsuvietnam.vn)
3. Làm theo hướng dẫn để cấu hình DNS settings

## 6. Xử lý lỗi phổ biến

### 6.1. Lỗi kết nối database

Nếu gặp lỗi kết nối database:
- Kiểm tra lại connection string
- Đảm bảo IP của Vercel được cho phép kết nối (với Neon/Supabase, bạn có thể cần cấu hình để cho phép tất cả các IP)

### 6.2. Lỗi build

Nếu quá trình build thất bại:
- Kiểm tra logs trong tab "Deployments"
- Đảm bảo các thay đổi để loại bỏ dependencies của Replit đã được thực hiện đúng
- Đảm bảo file `vercel.json` đã được cấu hình đúng

### 6.3. Lỗi runtime

Nếu ứng dụng bị lỗi khi chạy:
- Kiểm tra logs trong "Deployments" > "Functions" > "Logs"
- Kiểm tra console trong trình duyệt để xem lỗi client-side