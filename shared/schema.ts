import { pgTable, text, serial, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums for article categories
export const danhMucEnum = pgEnum('danh_muc', ['NhanVat', 'SuKien', 'TrieuDai']);

// Admin accounts table
export const taiKhoan = pgTable("TaiKhoan", {
  id: serial("id").primaryKey(),
  hoTen: text("HoTen").notNull(),
  tenDangNhap: text("TenDangNhap").notNull().unique(),
  matKhau: text("MatKhau").notNull(),
  ngayTao: timestamp("NgayTao").defaultNow(),
});

// Historical dynasties
export const trieuDai = pgTable("TrieuDai", {
  id: serial("id").primaryKey(),
  tenTrieuDai: text("TenTrieuDai").notNull(),
  batDau: integer("BatDau"), // Year
  ketThuc: integer("KetThuc"), // Year
  moTa: text("MoTa"),
  hinhAnh: text("HinhAnh"),
});

// Historical figures
export const nhanVat = pgTable("NhanVat", {
  id: serial("id").primaryKey(),
  tenNhanVat: text("TenNhanVat").notNull(),
  namSinh: integer("NamSinh"),
  namMat: integer("NamMat"),
  queQuan: text("QueQuan"),
  moTa: text("MoTa"),
  trieuDaiId: integer("TrieuDaiId").references(() => trieuDai.id),
  hinhAnh: text("HinhAnh"),
});

// Historical events
export const suKien = pgTable("SuKien", {
  id: serial("id").primaryKey(),
  tenSuKien: text("TenSuKien").notNull(),
  namXayRa: integer("NamXayRa"),
  diaDiem: text("DiaDiem"),
  moTa: text("MoTa"),
  trieuDaiId: integer("TrieuDaiId").references(() => trieuDai.id),
  hinhAnh: text("HinhAnh"),
});

// Main articles table
export const baiViet = pgTable("BaiViet", {
  id: serial("id").primaryKey(),
  tieuDe: text("TieuDe").notNull(),
  noiDung: text("NoiDung").notNull(),
  tomTat: text("TomTat"),
  danhMuc: danhMucEnum("DanhMuc").notNull(),
  anhDaiDien: text("AnhDaiDien"),
  luotXem: integer("LuotXem").default(0),
  noiBat: boolean("NoiBat").default(false),
  ngayDang: timestamp("NgayDang").defaultNow(),
  thoiGianDoc: integer("ThoiGianDoc").default(5), // Read time in minutes
  taiKhoanId: integer("TaiKhoanId").references(() => taiKhoan.id),
  nhanVatId: integer("NhanVatId").references(() => nhanVat.id),
  suKienId: integer("SuKienId").references(() => suKien.id),
  trieuDaiId: integer("TrieuDaiId").references(() => trieuDai.id),
});

// Images table
export const hinhAnh = pgTable("HinhAnh", {
  id: serial("id").primaryKey(),
  duongDan: text("DuongDan").notNull(),
  moTa: text("MoTa"),
  tieuDe: text("TieuDe"),
  baiVietId: integer("BaiVietId").references(() => baiViet.id, { onDelete: 'cascade' }),
  ngayTao: timestamp("NgayTao").defaultNow(),
});

// Videos table
export const video = pgTable("Video", {
  id: serial("id").primaryKey(),
  duongDan: text("DuongDan").notNull(),
  moTa: text("MoTa"),
  tieuDe: text("TieuDe"),
  baiVietId: integer("BaiVietId").references(() => baiViet.id, { onDelete: 'cascade' }),
  ngayTao: timestamp("NgayTao").defaultNow(),
});

// Relationships
export const baiVietRelations = relations(baiViet, ({ one, many }) => ({
  taiKhoan: one(taiKhoan, {
    fields: [baiViet.taiKhoanId],
    references: [taiKhoan.id],
  }),
  nhanVat: one(nhanVat, {
    fields: [baiViet.nhanVatId],
    references: [nhanVat.id],
  }),
  suKien: one(suKien, {
    fields: [baiViet.suKienId],
    references: [suKien.id],
  }),
  trieuDai: one(trieuDai, {
    fields: [baiViet.trieuDaiId],
    references: [trieuDai.id],
  }),
  hinhAnhs: many(hinhAnh),
  videos: many(video),
}));

export const hinhAnhRelations = relations(hinhAnh, ({ one }) => ({
  baiViet: one(baiViet, {
    fields: [hinhAnh.baiVietId],
    references: [baiViet.id],
  }),
}));

export const videoRelations = relations(video, ({ one }) => ({
  baiViet: one(baiViet, {
    fields: [video.baiVietId],
    references: [baiViet.id],
  }),
}));

export const nhanVatRelations = relations(nhanVat, ({ one, many }) => ({
  trieuDai: one(trieuDai, {
    fields: [nhanVat.trieuDaiId],
    references: [trieuDai.id],
  }),
  baiViets: many(baiViet),
}));

export const suKienRelations = relations(suKien, ({ one, many }) => ({
  trieuDai: one(trieuDai, {
    fields: [suKien.trieuDaiId],
    references: [trieuDai.id],
  }),
  baiViets: many(baiViet),
}));

export const trieuDaiRelations = relations(trieuDai, ({ many }) => ({
  nhanVats: many(nhanVat),
  suKiens: many(suKien),
  baiViets: many(baiViet),
}));

// Insert schemas
export const insertTaiKhoanSchema = createInsertSchema(taiKhoan).omit({ id: true, ngayTao: true });
export const insertTrieuDaiSchema = createInsertSchema(trieuDai).omit({ id: true });
export const insertNhanVatSchema = createInsertSchema(nhanVat).omit({ id: true });
export const insertSuKienSchema = createInsertSchema(suKien).omit({ id: true });
export const insertBaiVietSchema = createInsertSchema(baiViet).omit({ id: true, ngayDang: true, luotXem: true });
export const insertHinhAnhSchema = createInsertSchema(hinhAnh).omit({ id: true, ngayTao: true });
export const insertVideoSchema = createInsertSchema(video).omit({ id: true, ngayTao: true });

// Login schema
export const loginSchema = z.object({
  tenDangNhap: z.string().min(1, "Tên đăng nhập là bắt buộc"),
  matKhau: z.string().min(1, "Mật khẩu là bắt buộc"),
});

// Type definitions
export type TaiKhoan = typeof taiKhoan.$inferSelect;
export type InsertTaiKhoan = z.infer<typeof insertTaiKhoanSchema>;
export type TrieuDai = typeof trieuDai.$inferSelect;
export type InsertTrieuDai = z.infer<typeof insertTrieuDaiSchema>;
export type NhanVat = typeof nhanVat.$inferSelect;
export type InsertNhanVat = z.infer<typeof insertNhanVatSchema>;
export type SuKien = typeof suKien.$inferSelect;
export type InsertSuKien = z.infer<typeof insertSuKienSchema>;
export type BaiViet = typeof baiViet.$inferSelect;
export type InsertBaiViet = z.infer<typeof insertBaiVietSchema>;
export type HinhAnh = typeof hinhAnh.$inferSelect;
export type InsertHinhAnh = z.infer<typeof insertHinhAnhSchema>;
export type Video = typeof video.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type LoginData = z.infer<typeof loginSchema>;
