# Lịch Sử Việt Nam

Website thông tin về lịch sử Việt Nam với các tính năng quản lý nội dung, hỗ trợ đa phương tiện và giao diện người dùng hiện đại sử dụng React và Express.

## Tính năng

- **Quản lý bài viết**: Tạo, chỉnh sửa và xóa các bài viết về lịch sử
- **Phân loại nội dung**: Sắp xếp theo nhân vật, sự kiện và triều đại lịch sử
- **Hỗ trợ đa phương tiện**: Quản lý hình ảnh và video liên quan
- **Chế độ tối/sáng**: Giao diện người dùng thân thiện với người dùng
- **Hệ thống xác thực**: Quản lý người dùng và quyền admin
- **Thiết kế responsive**: Hiển thị tốt trên mọi thiết bị

## Công nghệ sử dụng

- **Frontend**: React, TailwindCSS, Shadcn UI
- **Backend**: Express, Node.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Authentication**: Passport.js
- **Upload media**: Node-Catbox
- **State Management**: React Query

## Cài đặt

### Yêu cầu

- Node.js (phiên bản 18+)
- PostgreSQL (pgAdmin 4)
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository về máy của bạn
```bash
git clone https://github.com/your-username/vietnam-history.git
cd vietnam-history
```

2. Cài đặt các dependencies
```bash
npm install
```

3. Tạo file .env trong thư mục gốc với các biến môi trường sau:
```
DATABASE_URL=postgres://postgres:1@localhost:5432/LichSuVietNam
SESSION_SECRET=your_session_secret
```

4. Khởi tạo cơ sở dữ liệu
```bash
npm run db:push
```

5. Chạy ứng dụng ở chế độ development
```bash
npm run dev
```

Ứng dụng sẽ chạy tại [http://localhost:5000](http://localhost:5000)

### Khởi tạo cơ sở dữ liệu với pgAdmin 4

1. Mở pgAdmin 4 và tạo cơ sở dữ liệu mới tên là "LichSuVietNam"
2. Sử dụng file sql trong thư mục `database/init.sql` để tạo các bảng

## Triển khai lên Vercel

1. Push code lên GitHub
2. Tạo tài khoản Vercel và kết nối với repository GitHub
3. Cấu hình các biến môi trường trong Vercel
4. Deploy!

## Cấu trúc thư mục

```
vietnam-history/
├── client/               # Frontend React
│   ├── src/              
│   │   ├── components/   # UI components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── ...
├── server/               # Backend Express
│   ├── utils/            # Server utilities
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Data storage layer
│   └── ...
├── shared/               # Shared code
│   └── schema.ts         # Database schema
├── database/             # Database scripts
├── migrations/           # Drizzle migrations
└── ...
```

## License

MIT