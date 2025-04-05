import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  baiViet, taiKhoan, nhanVat, suKien, trieuDai, 
  hinhAnh, video, 
  baiVietRelations, hinhAnhRelations, videoRelations, 
  nhanVatRelations, suKienRelations, trieuDaiRelations 
} from "@shared/schema";

// Sử dụng chuỗi kết nối trực tiếp
const connectionString = "postgresql://postgres:1@localhost:5432/LichSuVietNam";

export const client = postgres(connectionString);
export const db = drizzle(client, {
  schema: {
    baiViet,
    taiKhoan,
    nhanVat,
    suKien,
    trieuDai,
    hinhAnh,
    video
  },
  relationSchema: {
    baiVietRelations,
    hinhAnhRelations,
    videoRelations,
    nhanVatRelations,
    suKienRelations,
    trieuDaiRelations
  }
});
