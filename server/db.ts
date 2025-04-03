import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  baiViet, taiKhoan, nhanVat, suKien, trieuDai, 
  hinhAnh, video, 
  baiVietRelations, hinhAnhRelations, videoRelations, 
  nhanVatRelations, suKienRelations, trieuDaiRelations 
} from "@shared/schema";

const connectionString = process.env.DATABASE_URL || 
  `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

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
