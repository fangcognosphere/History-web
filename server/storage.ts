import { eq, desc, like, and, or, SQL, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  TaiKhoan, InsertTaiKhoan,
  BaiViet, InsertBaiViet,
  HinhAnh, InsertHinhAnh,
  Video, InsertVideo,
  NhanVat, InsertNhanVat,
  SuKien, InsertSuKien,
  TrieuDai, InsertTrieuDai,
  baiViet, taiKhoan, nhanVat, suKien, trieuDai, hinhAnh, video
} from "@shared/schema";

import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Authentication
  getTaiKhoan(id: number): Promise<TaiKhoan | undefined>;
  getTaiKhoanByTenDangNhap(tenDangNhap: string): Promise<TaiKhoan | undefined>;
  createTaiKhoan(user: InsertTaiKhoan): Promise<TaiKhoan>;

  // Articles
  getBaiViet(id: number): Promise<BaiViet | undefined>;
  getBaiViets(limit?: number, offset?: number): Promise<BaiViet[]>;
  searchBaiViets(query: string, limit?: number, offset?: number): Promise<BaiViet[]>;
  getBaiVietsByDanhMuc(danhMuc: string, limit?: number, offset?: number): Promise<BaiViet[]>;
  getNoiBatBaiViets(limit?: number): Promise<BaiViet[]>;
  createBaiViet(baiViet: InsertBaiViet): Promise<BaiViet>;
  updateBaiViet(id: number, baiViet: Partial<InsertBaiViet>): Promise<BaiViet | undefined>;
  deleteBaiViet(id: number): Promise<boolean>;
  incrementLuotXem(id: number): Promise<void>;

  // Images
  getHinhAnh(id: number): Promise<HinhAnh | undefined>;
  getHinhAnhsByBaiVietId(baiVietId: number): Promise<HinhAnh[]>;
  createHinhAnh(hinhAnh: InsertHinhAnh): Promise<HinhAnh>;
  updateHinhAnh(id: number, hinhAnh: Partial<InsertHinhAnh>): Promise<HinhAnh | undefined>;
  deleteHinhAnh(id: number): Promise<boolean>;

  // Videos
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByBaiVietId(baiVietId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;

  // Historical figures
  getNhanVat(id: number): Promise<NhanVat | undefined>;
  getNhanVats(limit?: number, offset?: number): Promise<NhanVat[]>;
  createNhanVat(nhanVat: InsertNhanVat): Promise<NhanVat>;
  updateNhanVat(id: number, nhanVat: Partial<InsertNhanVat>): Promise<NhanVat | undefined>;
  deleteNhanVat(id: number): Promise<boolean>;

  // Historical events
  getSuKien(id: number): Promise<SuKien | undefined>;
  getSuKiens(limit?: number, offset?: number): Promise<SuKien[]>;
  createSuKien(suKien: InsertSuKien): Promise<SuKien>;
  updateSuKien(id: number, suKien: Partial<InsertSuKien>): Promise<SuKien | undefined>;
  deleteSuKien(id: number): Promise<boolean>;

  // Historical dynasties
  getTrieuDai(id: number): Promise<TrieuDai | undefined>;
  getTrieuDais(limit?: number, offset?: number): Promise<TrieuDai[]>;
  createTrieuDai(trieuDai: InsertTrieuDai): Promise<TrieuDai>;
  updateTrieuDai(id: number, trieuDai: Partial<InsertTrieuDai>): Promise<TrieuDai | undefined>;
  deleteTrieuDai(id: number): Promise<boolean>;

  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  // Authentication
  async getTaiKhoan(id: number): Promise<TaiKhoan | undefined> {
    const [user] = await db.select().from(taiKhoan).where(eq(taiKhoan.id, id));
    return user;
  }

  async getTaiKhoanByTenDangNhap(tenDangNhap: string): Promise<TaiKhoan | undefined> {
    const [user] = await db.select().from(taiKhoan).where(eq(taiKhoan.tenDangNhap, tenDangNhap));
    return user;
  }

  async createTaiKhoan(user: InsertTaiKhoan): Promise<TaiKhoan> {
    const [newUser] = await db.insert(taiKhoan).values(user).returning();
    return newUser;
  }

  // Articles
  async getBaiViet(id: number): Promise<BaiViet | undefined> {
    const [article] = await db.select().from(baiViet).where(eq(baiViet.id, id));
    return article;
  }

  async getBaiViets(limit = 10, offset = 0): Promise<BaiViet[]> {
    return db.select().from(baiViet).orderBy(desc(baiViet.ngayDang)).limit(limit).offset(offset);
  }

  async searchBaiViets(query: string, limit = 10, offset = 0): Promise<BaiViet[]> {
    const searchTerm = `%${query}%`;
    return db.select().from(baiViet).where(
      or(
        like(baiViet.tieuDe, searchTerm),
        like(baiViet.tomTat!, searchTerm),
        like(baiViet.noiDung, searchTerm)
      )
    ).orderBy(desc(baiViet.ngayDang)).limit(limit).offset(offset);
  }

  async getBaiVietsByDanhMuc(danhMuc: string, limit = 10, offset = 0): Promise<BaiViet[]> {
    return db.select().from(baiViet)
      .where(eq(baiViet.danhMuc, danhMuc as any))
      .orderBy(desc(baiViet.ngayDang))
      .limit(limit)
      .offset(offset);
  }

  async getNoiBatBaiViets(limit = 6): Promise<BaiViet[]> {
    return db.select().from(baiViet)
      .where(eq(baiViet.noiBat, true))
      .orderBy(desc(baiViet.ngayDang))
      .limit(limit);
  }

  async createBaiViet(article: InsertBaiViet): Promise<BaiViet> {
    const [newArticle] = await db.insert(baiViet).values(article).returning();
    return newArticle;
  }

  async updateBaiViet(id: number, article: Partial<InsertBaiViet>): Promise<BaiViet | undefined> {
    const [updatedArticle] = await db
      .update(baiViet)
      .set(article)
      .where(eq(baiViet.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteBaiViet(id: number): Promise<boolean> {
    const result = await db.delete(baiViet).where(eq(baiViet.id, id));
    return !!result;
  }

  async incrementLuotXem(id: number): Promise<void> {
    await db
      .update(baiViet)
      .set({ luotXem: sql`${baiViet.luotXem} + 1` })
      .where(eq(baiViet.id, id));
  }

  // Images
  async getHinhAnh(id: number): Promise<HinhAnh | undefined> {
    const [image] = await db.select().from(hinhAnh).where(eq(hinhAnh.id, id));
    return image;
  }

  async getHinhAnhsByBaiVietId(baiVietId: number): Promise<HinhAnh[]> {
    return db.select().from(hinhAnh).where(eq(hinhAnh.baiVietId!, baiVietId));
  }

  async createHinhAnh(image: InsertHinhAnh): Promise<HinhAnh> {
    const [newImage] = await db.insert(hinhAnh).values(image).returning();
    return newImage;
  }

  async updateHinhAnh(id: number, image: Partial<InsertHinhAnh>): Promise<HinhAnh | undefined> {
    const [updatedImage] = await db
      .update(hinhAnh)
      .set(image)
      .where(eq(hinhAnh.id, id))
      .returning();
    return updatedImage;
  }

  async deleteHinhAnh(id: number): Promise<boolean> {
    const result = await db.delete(hinhAnh).where(eq(hinhAnh.id, id));
    return !!result;
  }

  // Videos
  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(video).where(eq(video.id, id));
    return video;
  }

  async getVideosByBaiVietId(baiVietId: number): Promise<Video[]> {
    return db.select().from(video).where(eq(video.baiVietId!, baiVietId));
  }

  async createVideo(videoData: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(video).values(videoData).returning();
    return newVideo;
  }

  async updateVideo(id: number, videoData: Partial<InsertVideo>): Promise<Video | undefined> {
    const [updatedVideo] = await db
      .update(video)
      .set(videoData)
      .where(eq(video.id, id))
      .returning();
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    const result = await db.delete(video).where(eq(video.id, id));
    return !!result;
  }

  // Historical figures
  async getNhanVat(id: number): Promise<NhanVat | undefined> {
    const [figure] = await db.select().from(nhanVat).where(eq(nhanVat.id, id));
    return figure;
  }

  async getNhanVats(limit = 10, offset = 0): Promise<NhanVat[]> {
    return db.select().from(nhanVat).limit(limit).offset(offset);
  }

  async createNhanVat(figure: InsertNhanVat): Promise<NhanVat> {
    const [newFigure] = await db.insert(nhanVat).values(figure).returning();
    return newFigure;
  }

  async updateNhanVat(id: number, figure: Partial<InsertNhanVat>): Promise<NhanVat | undefined> {
    const [updatedFigure] = await db
      .update(nhanVat)
      .set(figure)
      .where(eq(nhanVat.id, id))
      .returning();
    return updatedFigure;
  }

  async deleteNhanVat(id: number): Promise<boolean> {
    const result = await db.delete(nhanVat).where(eq(nhanVat.id, id));
    return !!result;
  }

  // Historical events
  async getSuKien(id: number): Promise<SuKien | undefined> {
    const [event] = await db.select().from(suKien).where(eq(suKien.id, id));
    return event;
  }

  async getSuKiens(limit = 10, offset = 0): Promise<SuKien[]> {
    return db.select().from(suKien).limit(limit).offset(offset);
  }

  async createSuKien(event: InsertSuKien): Promise<SuKien> {
    const [newEvent] = await db.insert(suKien).values(event).returning();
    return newEvent;
  }

  async updateSuKien(id: number, event: Partial<InsertSuKien>): Promise<SuKien | undefined> {
    const [updatedEvent] = await db
      .update(suKien)
      .set(event)
      .where(eq(suKien.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteSuKien(id: number): Promise<boolean> {
    const result = await db.delete(suKien).where(eq(suKien.id, id));
    return !!result;
  }

  // Historical dynasties
  async getTrieuDai(id: number): Promise<TrieuDai | undefined> {
    const [dynasty] = await db.select().from(trieuDai).where(eq(trieuDai.id, id));
    return dynasty;
  }

  async getTrieuDais(limit = 10, offset = 0): Promise<TrieuDai[]> {
    return db.select().from(trieuDai).limit(limit).offset(offset);
  }

  async createTrieuDai(dynasty: InsertTrieuDai): Promise<TrieuDai> {
    const [newDynasty] = await db.insert(trieuDai).values(dynasty).returning();
    return newDynasty;
  }

  async updateTrieuDai(id: number, dynasty: Partial<InsertTrieuDai>): Promise<TrieuDai | undefined> {
    const [updatedDynasty] = await db
      .update(trieuDai)
      .set(dynasty)
      .where(eq(trieuDai.id, id))
      .returning();
    return updatedDynasty;
  }

  async deleteTrieuDai(id: number): Promise<boolean> {
    const result = await db.delete(trieuDai).where(eq(trieuDai.id, id));
    return !!result;
  }
}

export const storage = new DatabaseStorage();
