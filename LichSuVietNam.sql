-- LichSuVietNam Database Export
-- Created: 04/04/2025

-- Create enums
CREATE TYPE "danh_muc" AS ENUM ('NhanVat', 'SuKien', 'TrieuDai');
CREATE TYPE "vai_tro" AS ENUM ('Admin', 'User');

-- Create tables
CREATE TABLE IF NOT EXISTS "TaiKhoan" (
  "id" SERIAL PRIMARY KEY,
  "HoTen" TEXT NOT NULL,
  "TenDangNhap" TEXT NOT NULL UNIQUE,
  "MatKhau" TEXT NOT NULL,
  "VaiTro" "vai_tro" DEFAULT 'User',
  "NgayTao" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "TrieuDai" (
  "id" SERIAL PRIMARY KEY,
  "TenTrieuDai" TEXT NOT NULL,
  "BatDau" INTEGER,
  "KetThuc" INTEGER,
  "MoTa" TEXT,
  "HinhAnh" TEXT,
  "kinhDo" TEXT
);

CREATE TABLE IF NOT EXISTS "NhanVat" (
  "id" SERIAL PRIMARY KEY,
  "TenNhanVat" TEXT NOT NULL,
  "NamSinh" INTEGER,
  "NamMat" INTEGER,
  "QueQuan" TEXT,
  "MoTa" TEXT,
  "TrieuDaiId" INTEGER REFERENCES "TrieuDai"("id"),
  "HinhAnh" TEXT
);

CREATE TABLE IF NOT EXISTS "SuKien" (
  "id" SERIAL PRIMARY KEY,
  "TenSuKien" TEXT NOT NULL,
  "NamXayRa" INTEGER,
  "DiaDiem" TEXT,
  "MoTa" TEXT,
  "TrieuDaiId" INTEGER REFERENCES "TrieuDai"("id"),
  "HinhAnh" TEXT
);

CREATE TABLE IF NOT EXISTS "BaiViet" (
  "id" SERIAL PRIMARY KEY,
  "TieuDe" TEXT NOT NULL,
  "NoiDung" TEXT NOT NULL,
  "TomTat" TEXT,
  "DanhMuc" "danh_muc" NOT NULL,
  "AnhDaiDien" TEXT,
  "LuotXem" INTEGER DEFAULT 0,
  "NoiBat" BOOLEAN DEFAULT false,
  "NgayDang" TIMESTAMP DEFAULT NOW(),
  "ThoiGianDoc" INTEGER DEFAULT 5,
  "TaiKhoanId" INTEGER REFERENCES "TaiKhoan"("id"),
  "NhanVatId" INTEGER REFERENCES "NhanVat"("id"),
  "SuKienId" INTEGER REFERENCES "SuKien"("id"),
  "TrieuDaiId" INTEGER REFERENCES "TrieuDai"("id")
);

CREATE TABLE IF NOT EXISTS "HinhAnh" (
  "id" SERIAL PRIMARY KEY,
  "DuongDan" TEXT NOT NULL,
  "MoTa" TEXT,
  "TieuDe" TEXT,
  "BaiVietId" INTEGER REFERENCES "BaiViet"("id") ON DELETE CASCADE,
  "NgayTao" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Video" (
  "id" SERIAL PRIMARY KEY,
  "DuongDan" TEXT NOT NULL,
  "MoTa" TEXT,
  "TieuDe" TEXT,
  "BaiVietId" INTEGER REFERENCES "BaiViet"("id") ON DELETE CASCADE,
  "NgayTao" TIMESTAMP DEFAULT NOW()
);

-- Insert data into TaiKhoan
INSERT INTO "TaiKhoan" ("id", "HoTen", "TenDangNhap", "MatKhau", "NgayTao", "VaiTro") VALUES
(1, 'Admin User', 'admin', '1', '2025-04-03 06:46:03.921197', 'Admin'),
(2, 'Nguyễn Hoàng Long', 'admin2', '123456', '2025-04-03 07:13:39.088946', 'User');

-- Reset sequences
SELECT setval('"TaiKhoan_id_seq"', (SELECT MAX(id) FROM "TaiKhoan"));

-- Insert data into TrieuDai
INSERT INTO "TrieuDai" ("id", "TenTrieuDai", "BatDau", "KetThuc", "MoTa", "HinhAnh", "kinhDo") VALUES
(1, 'Thời kỳ Hồng Bàng', -2879, -258, 'Thời kỳ Hồng Bàng hay còn gọi là thời đại các vua Hùng, là thời kỳ tiền sử và sơ sử của lịch sử Việt Nam.', NULL, 'Phong Châu'),
(2, 'Thời kỳ Thục Phán - An Dương Vương', -257, -208, 'Thời kỳ Thục Phán - An Dương Vương là thời kỳ Thục Phán lên ngôi vua, xưng là An Dương Vương và thành lập nhà nước Âu Lạc.', NULL, 'Cổ Loa'),
(3, 'Thời kỳ Bắc thuộc lần thứ nhất', -207, 39, 'Thời kỳ Bắc thuộc lần thứ nhất là giai đoạn phương Bắc đô hộ Việt Nam lần thứ nhất sau khi Triệu Đà đánh bại An Dương Vương.', NULL, 'Phiên Ngung'),
(4, 'Thời kỳ Trưng Nữ Vương', 40, 43, 'Thời kỳ Trưng Nữ Vương là thời kỳ hai chị em Trưng Trắc và Trưng Nhị lãnh đạo khởi nghĩa chống lại nhà Đông Hán của Trung Quốc.', NULL, 'Mê Linh'),
(5, 'Thời kỳ Bắc thuộc lần thứ hai', 44, 543, 'Thời kỳ Bắc thuộc lần thứ hai là thời kỳ sau khi Trưng Nữ Vương thất bại, Việt Nam lại bị phương Bắc đô hộ.', NULL, 'Giao Chỉ'),
(6, 'Thời kỳ nhà Tiền Lý', 544, 602, 'Thời kỳ nhà Tiền Lý bắt đầu khi Lý Nam Đế khởi nghĩa giành độc lập, xưng vương lập ra nước Vạn Xuân.', NULL, 'Cổ Loa'),
(7, 'Thời kỳ Bắc thuộc lần thứ ba', 603, 905, 'Thời kỳ Bắc thuộc lần thứ ba sau khi nhà Tiền Lý sụp đổ.', NULL, 'Giao Châu'),
(8, 'Thời kỳ tự chủ', 906, 938, 'Thời kỳ tự chủ là thời kỳ Việt Nam dưới sự cai trị của các Tiết độ sứ người Việt.', NULL, 'Đại La'),
(9, 'Thời kỳ Ngô Quyền', 939, 965, 'Thời kỳ Ngô Quyền là giai đoạn sau khi Ngô Quyền đánh thắng quân Nam Hán trên sông Bạch Đằng năm 938 và lên ngôi vua.', NULL, 'Cổ Loa'),
(10, 'Thời kỳ nhà Đinh', 968, 980, 'Thời kỳ nhà Đinh bắt đầu khi Đinh Bộ Lĩnh dẹp loạn 12 sứ quân và lên ngôi hoàng đế, đặt tên nước là Đại Cồ Việt.', NULL, 'Hoa Lư'),
(11, 'Thời kỳ nhà Tiền Lê', 980, 1009, 'Thời kỳ nhà Tiền Lê bắt đầu khi Lê Hoàn lên ngôi, đối đầu với nhà Tống và giữ vững nền độc lập.', NULL, 'Hoa Lư'),
(12, 'Thời kỳ nhà Lý', 1010, 1225, 'Thời kỳ nhà Lý bắt đầu khi Lý Công Uẩn lên ngôi và dời đô từ Hoa Lư về Thăng Long, mở ra thời kỳ phát triển mới.', NULL, 'Thăng Long'),
(13, 'Thời kỳ nhà Trần', 1225, 1400, 'Thời kỳ nhà Trần với những chiến thắng vẻ vang chống quân Nguyên Mông, phát triển kinh tế và văn hóa.', NULL, 'Thăng Long'),
(14, 'Thời kỳ nhà Hồ', 1400, 1407, 'Thời kỳ nhà Hồ là triều đại kéo dài 7 năm do Hồ Quý Ly sáng lập sau khi giành ngôi của nhà Trần.', NULL, 'Tây Đô (Thanh Hóa)'),
(15, 'Thời kỳ Bắc thuộc lần thứ tư', 1407, 1427, 'Thời kỳ Bắc thuộc lần thứ tư là thời kỳ nhà Minh đô hộ sau khi đánh bại nhà Hồ.', NULL, 'Đông Quan'),
(16, 'Thời kỳ nhà Hậu Lê - Lê sơ', 1428, 1527, 'Thời kỳ nhà Hậu Lê, bắt đầu từ khi Lê Lợi đánh đuổi quân Minh, lên ngôi hoàng đế, là giai đoạn hưng thịnh.', NULL, 'Thăng Long'),
(17, 'Thời kỳ Mạc - Lê Trung Hưng', 1527, 1592, 'Thời kỳ nhà Mạc cướp ngôi nhà Lê, sau đó nhà Lê được khôi phục với sự phò tá của chúa Trịnh ở Đàng Ngoài.', NULL, 'Thăng Long (Lê-Trịnh), Cao Bằng (Mạc)'),
(18, 'Thời kỳ Nam - Bắc Triều', 1592, 1788, 'Thời kỳ Việt Nam phân ra làm hai: Đàng Ngoài do chúa Trịnh cai trị, Đàng Trong do chúa Nguyễn cai trị.', NULL, 'Đàng Ngoài: Thăng Long, Đàng Trong: Phú Xuân'),
(19, 'Thời kỳ nhà Tây Sơn', 1788, 1802, 'Thời kỳ nhà Tây Sơn là triều đại kéo dài 14 năm, do Nguyễn Nhạc, Nguyễn Huệ và Nguyễn Lữ sáng lập, đánh dẹp chúa Trịnh, chúa Nguyễn, và đánh thắng quân Xiêm, quân Thanh.', NULL, 'Phú Xuân'),
(20, 'Thời kỳ nhà Nguyễn', 1802, 1945, 'Thời kỳ nhà Nguyễn là triều đại phong kiến cuối cùng của Việt Nam.', NULL, 'Phú Xuân (Huế)');

-- Reset sequences
SELECT setval('"TrieuDai_id_seq"', (SELECT MAX(id) FROM "TrieuDai"));

-- Insert data into NhanVat
INSERT INTO "NhanVat" ("id", "TenNhanVat", "NamSinh", "NamMat", "MoTa", "TrieuDaiId", "HinhAnh", "QueQuan") VALUES
(1, 'Lạc Long Quân', -3000, -2800, 'Nhân vật thần thoại, con của thần Long Nữ, là cha của các vua Hùng, được xem là tổ tiên của người Việt.', 23, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/L%E1%BA%A1c_Long_Qu%C3%A2n_-_%C3%82u_C%C6%A1.jpg/220px-L%E1%BA%A1c_Long_Qu%C3%A2n_-_%C3%82u_C%C6%A1.jpg', 'Động Đình Hồ'),
(2, 'An Dương Vương', -257, -208, 'Tên thật là Thục Phán, là vị vua sáng lập nước Âu Lạc, xây dựng thành Cổ Loa nổi tiếng.', 24, 'https://upload.wikimedia.org/wikipedia/commons/c/cf/An_D%C6%B0%C6%A1ng_V%C6%B0%C6%A1ng.jpg', 'Thục Quốc'),
(3, 'Hai Bà Trưng', 14, 43, 'Trưng Trắc và Trưng Nhị là hai chị em phất cờ khởi nghĩa chống lại nhà Hán, giành lại độc lập cho đất nước.', 26, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Hai_Ba_Trung.jpg/250px-Hai_Ba_Trung.jpg', 'Mê Linh'),
(4, 'Lý Nam Đế', 503, 548, 'Tên thật là Lý Bí, là người sáng lập ra nhà Tiền Lý, đặt tên nước là Vạn Xuân.', 28, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Ly_Nam_De_1.jpg/220px-Ly_Nam_De_1.jpg', 'Đường Lâm'),
(5, 'Ngô Quyền', 897, 944, 'Chiến thắng quân Nam Hán trên sông Bạch Đằng năm 938, chấm dứt 1000 năm Bắc thuộc, mở đầu thời kỳ độc lập.', 10, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Ng%C3%B4_Quy%E1%BB%81n.jpg/250px-Ng%C3%B4_Quy%E1%BB%81n.jpg', 'Đường Lâm'),
(6, 'Đinh Bộ Lĩnh', 924, 979, 'Thống nhất đất nước sau thời kỳ loạn 12 sứ quân, lên ngôi hoàng đế, đặt tên nước là Đại Cồ Việt.', 11, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/King_Dinh_Tien_Hoang.jpg/220px-King_Dinh_Tien_Hoang.jpg', 'Hoa Lư'),
(7, 'Lý Thái Tổ', 974, 1028, 'Tên thật là Lý Công Uẩn, là vị hoàng đế đầu tiên của nhà Lý, dời đô về Thăng Long (Hà Nội ngày nay).', 12, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/LyThaiTo.jpg/220px-LyThaiTo.jpg', 'Cổ Pháp'),
(8, 'Lý Thường Kiệt', 1019, 1105, 'Danh tướng thời Lý, chỉ huy quân đội đánh bại quân Tống, tác giả bài thơ "Nam quốc sơn hà".', 12, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/LyThuongKiet.PNG/200px-LyThuongKiet.PNG', 'Thăng Long'),
(9, 'Trần Hưng Đạo', 1228, 1300, 'Tên thật là Trần Quốc Tuấn, là nhà quân sự thiên tài, chỉ huy quân đội đánh thắng quân Nguyên Mông ba lần.', 13, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Tran_Hung_Dao.jpg/220px-Tran_Hung_Dao.jpg', 'Tức Mặc'),
(10, 'Lê Lợi', 1385, 1433, 'Người lãnh đạo khởi nghĩa Lam Sơn, đánh đuổi quân Minh, lập nên triều đại nhà Hậu Lê.', 19, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Le_Thai_To.jpg/220px-Le_Thai_To.jpg', 'Lam Sơn');

-- Reset sequences
SELECT setval('"NhanVat_id_seq"', (SELECT MAX(id) FROM "NhanVat"));

-- Insert data into SuKien
INSERT INTO "SuKien" ("id", "TenSuKien", "NamXayRa", "DiaDiem", "MoTa", "TrieuDaiId", "HinhAnh") VALUES
(1, 'Chiến thắng Bạch Đằng 938', 938, 'Sông Bạch Đằng, Quảng Ninh', 'Ngô Quyền đánh bại quân Nam Hán bằng cách cắm cọc trên sông Bạch Đằng, chấm dứt 1000 năm Bắc thuộc.', NULL, 'https://files.catbox.moe/gyp0g4.jpg'),
(2, 'Chiến thắng Đống Đa', 1789, 'Đống Đa, Hà Nội', 'Quang Trung đại phá quân Thanh trong trận đánh thần tốc vào mùng 5 Tết Kỷ Dậu.', NULL, 'https://files.catbox.moe/4xlnk9.jpg'),
(3, 'Chiến thắng Điện Biên Phủ', 1954, 'Điện Biên Phủ', 'Chiến thắng quyết định của quân đội Việt Nam dưới sự chỉ huy của Đại tướng Võ Nguyên Giáp, chấm dứt cuộc chiến với Pháp.', NULL, 'https://files.catbox.moe/gbc69n.png'),
(4, 'Hiệp định Paris', 1973, 'Paris, Pháp', 'Hiệp định về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký kết, quân đội Mỹ rút khỏi Việt Nam.', NULL, 'https://files.catbox.moe/fa1391.jpg'),
(5, 'Ngày thống nhất đất nước', 1975, 'Sài Gòn', 'Ngày 30/4/1975, quân Giải phóng tiến vào Sài Gòn, kết thúc cuộc kháng chiến chống Mỹ, thống nhất đất nước.', NULL, 'https://files.catbox.moe/ydvg2q.jpg'),
(6, 'Chiến thắng Chi Lăng - Xương Giang', 1427, 'Chi Lăng, Lạng Sơn', 'Quân đội Đại Việt dưới sự chỉ huy của Lê Lợi đánh tan 10 vạn quân Minh, tiêu diệt tướng Liễu Thăng.', NULL, 'https://files.catbox.moe/i1wqif.jpg'),
(7, 'Khởi nghĩa Lam Sơn', 1418, 'Thanh Hóa', 'Lê Lợi phất cờ khởi nghĩa tại Lam Sơn, mở đầu cuộc kháng chiến chống quân Minh.', NULL, 'https://files.catbox.moe/40y7tt.jpg');

-- Reset sequences
SELECT setval('"SuKien_id_seq"', (SELECT MAX(id) FROM "SuKien"));

-- Insert data into BaiViet
INSERT INTO "BaiViet" ("id", "TieuDe", "NoiDung", "TomTat", "DanhMuc", "AnhDaiDien", "LuotXem", "NoiBat", "NgayDang", "ThoiGianDoc", "TaiKhoanId", "NhanVatId", "SuKienId", "TrieuDaiId") VALUES
(1, 'Lịch sử Việt Nam thời kỳ đầu', 'Nội dung chi tiết về lịch sử Việt Nam thời kỳ đầu...', 'Tóm tắt về lịch sử Việt Nam thời kỳ đầu', 'SuKien', 'https://files.catbox.moe/ukar7u.jpg', 4, true, '2025-04-03 06:46:15.755694', 5, 1, NULL, NULL, NULL),
(2, 'Nhà Trần và những chiến công vang dội', 'Nội dung chi tiết về nhà Trần...', 'Tóm tắt về những chiến công của nhà Trần', 'TrieuDai', 'https://files.catbox.moe/qh1hmd.jpg', 6, true, '2025-04-03 06:46:23.890662', 5, 1, NULL, NULL, NULL),
(3, 'Thời kỳ Vua Hùng dựng nước', 'Nội dung chi tiết về thời kỳ Vua Hùng...', 'Tóm tắt về thời kỳ Vua Hùng dựng nước', 'TrieuDai', 'https://files.catbox.moe/g60l1c.jpg', 1, true, '2025-04-03 06:46:31.507782', 5, 1, NULL, NULL, NULL),
(4, 'Trận Bạch Đằng năm 938 - Dấu mốc chấm dứt 1000 năm Bắc thuộc', '<h2>Bối cảnh lịch sử</h2>
<p>Sau sự sụp đổ của nhà Đường năm 907, tình hình chính trị Trung Hoa rơi vào tình trạng phân hóa, hình thành nên thời kỳ Ngũ Đại Thập Quốc. Tại Giao Châu (Việt Nam ngày nay), Khúc Thừa Dụ và con cháu đã nắm quyền cai quản và thực hiện các cải cách hành chính quan trọng, mở đầu cho tiến trình giành độc lập.</p>
<p>Năm 930, Nam Hán (một trong các nước ở miền Nam Trung Quốc thời đó) đã xâm lược Giao Châu và đặt Dương Bình Vương làm Tiết độ sứ. Ngô Quyền lúc này là một tướng lĩnh dưới quyền Dương Đình Nghệ, đã phất cờ khởi nghĩa sau khi Dương Đình Nghệ bị sát hại.</p>

<h2>Chiến thuật thiên tài</h2>
<p>Khi quân Nam Hán do Lưu Hoằng Tháo (con trai vua Nam Hán) dẫn quân xâm lược Giao Châu, Ngô Quyền đã nghĩ ra một kế hoạch táo bạo. Ông cho quân đóng cọc gỗ có bịt sắt nhọn xuống lòng sông Bạch Đằng, ngụy trang kín đáo dưới mặt nước.</p>
<p>Sau đó, Ngô Quyền bố trí một đội quân nhỏ ra khiêu chiến, giả thua rút chạy nhằm dụ đội thuyền chiến của Lưu Hoằng Tháo đuổi theo khi thủy triều đang lên cao. Khi thủy triều bắt đầu rút, đoàn thuyền địch bị mắc kẹt vào bãi cọc nhọn và bị lật úp, tan vỡ.</p>

<h2>Ý nghĩa lịch sử</h2>
<p>Chiến thắng Bạch Đằng năm 938 đã chấm dứt thời kỳ Bắc thuộc kéo dài gần 1000 năm trong lịch sử Việt Nam. Ngô Quyền đã lên ngôi vương, đóng đô ở Cổ Loa và mở ra thời kỳ độc lập tự chủ của dân tộc.</p>
<p>Đây không chỉ là chiến thắng quân sự mà còn là thắng lợi to lớn về mặt tinh thần, làm nền tảng cho ý thức độc lập, tự chủ của người Việt trong suốt chiều dài lịch sử sau này. Chiến thuật cắm cọc trên sông Bạch Đằng sau này đã được Trần Hưng Đạo tái sử dụng để đánh bại quân Nguyên Mông vào năm 1288.</p>', 'Trận Bạch Đằng năm 938 là chiến thắng lịch sử của Ngô Quyền trước quân Nam Hán, đánh dấu sự kết thúc của gần 1000 năm Bắc thuộc và mở ra kỷ nguyên độc lập tự chủ.', 'SuKien', 'https://files.catbox.moe/gyp0g4.jpg', 1, true, '2025-04-03 18:01:38.630952', 5, 1, NULL, NULL, NULL),
(5, 'Trần Hưng Đạo - Vị tướng thiên tài chống quân Nguyên Mông', '<h2>Tiểu sử</h2>
<p>Trần Hưng Đạo (1228-1300), tên thật là Trần Quốc Tuấn, là một nhà quân sự thiên tài và là anh hùng dân tộc Việt Nam. Ông sinh ra trong hoàng tộc nhà Trần, là cháu nội của Trần Thừa và là cháu gọi Trần Thái Tông bằng chú. Trần Hưng Đạo được phong làm Quốc công tiết chế, nắm quyền chỉ huy tối cao quân đội nhà Trần trong các cuộc kháng chiến chống quân Nguyên Mông.</p>

<h2>Vai trò trong cuộc kháng chiến chống Nguyên Mông</h2>
<p>Trần Hưng Đạo đã lãnh đạo quân đội và nhân dân Đại Việt đánh bại đế quốc Nguyên Mông trong ba cuộc chiến vào các năm 1258, 1285 và 1288. Đặc biệt, chiến thắng trên sông Bạch Đằng năm 1288 đã đi vào lịch sử như một chiến thắng vĩ đại của dân tộc Việt Nam.</p>

<h2>Tư tưởng quân sự</h2>
<p>Trần Hưng Đạo nổi tiếng với tác phẩm "Hịch tướng sĩ" và "Binh thư yếu lược", thể hiện tư tưởng quân sự tiến bộ của ông. Ông đã vận dụng chiến lược "vườn không nhà trống", "tiên phát chế nhân", và chiến thuật "dĩ đoản chế trường", "dĩ ít địch nhiều".</p>

<h2>Di sản và ảnh hưởng</h2>
<p>Trần Hưng Đạo là một trong những anh hùng dân tộc được tôn kính nhất trong lịch sử Việt Nam. Ông được thờ phụng tại nhiều đền miếu trên khắp đất nước, trong đó nổi tiếng nhất là đền Kiếp Bạc ở Hải Dương, đền Trần Hưng Đạo ở Hà Nội, và đền thờ ông ở Nam Định.</p>

<h2>Bài học lịch sử</h2>
<p>Tấm gương của Trần Hưng Đạo về lòng yêu nước, tinh thần đoàn kết, và tài năng quân sự đã trở thành di sản quý báu của dân tộc Việt Nam. Bài học về chiến lược và chiến thuật của ông vẫn còn nguyên giá trị đến ngày nay.</p>', 'Trần Hưng Đạo, tên thật là Trần Quốc Tuấn, là một nhà quân sự thiên tài thời nhà Trần, người đã ba lần chỉ huy quân đội Đại Việt đánh bại quân Nguyên Mông xâm lược.', 'NhanVat', 'https://files.catbox.moe/0d2h30.png', 0, true, '2025-04-03 18:05:02.380772', 5, 1, NULL, NULL, NULL);

-- Reset sequences
SELECT setval('"BaiViet_id_seq"', (SELECT MAX(id) FROM "BaiViet"));

-- Insert data into HinhAnh
INSERT INTO "HinhAnh" ("id", "DuongDan", "MoTa", "TieuDe", "BaiVietId", "NgayTao") VALUES
(1, 'https://files.catbox.moe/g92ofq.jpg', NULL, 'Thành phố', NULL, '2025-04-03 13:27:03.816521');

-- Reset sequences
SELECT setval('"HinhAnh_id_seq"', (SELECT MAX(id) FROM "HinhAnh"));

-- Insert data into Video
-- No data to insert

-- Reset sequences
SELECT setval('"Video_id_seq"', 1);