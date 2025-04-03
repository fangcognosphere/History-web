import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import { catboxUploader } from "./utils/catbox";

// Sử dụng bộ nhớ làm storage tạm thời để sau đó upload lên Catbox
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Không cần phục vụ uploads directory nữa vì đã chuyển sang dùng Catbox

  // Article endpoints
  app.get("/api/article", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const articles = await storage.getBaiViets(limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/article/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const articles = await storage.getNoiBatBaiViets(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured articles" });
    }
  });

  app.get("/api/article/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const articles = await storage.getBaiVietsByDanhMuc(category, limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles by category" });
    }
  });

  app.get("/api/article/search", async (req, res) => {
    try {
      const { q } = req.query;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      if (!q) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const articles = await storage.searchBaiViets(q as string, limit, offset);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to search articles" });
    }
  });

  app.get("/api/article/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getBaiViet(id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      // Increment view count
      await storage.incrementLuotXem(id);
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/article", upload.single("anhDaiDien"), async (req, res) => {
    try {
      const { tieuDe, noiDung, tomTat, danhMuc, noiBat, nhanVatId, suKienId, trieuDaiId, thoiGianDoc } = req.body;
      const taiKhoanId = req.user?.id;

      let anhDaiDien = null;
      if (req.file) {
        // Upload hình ảnh lên Catbox thay vì lưu cục bộ
        try {
          anhDaiDien = await catboxUploader.uploadFromMulter(req.file);
        } catch (uploadError) {
          console.error("Upload to Catbox failed:", uploadError);
          return res.status(500).json({ error: "Failed to upload image to Catbox" });
        }
      }

      const newArticle = await storage.createBaiViet({
        tieuDe,
        noiDung,
        tomTat,
        danhMuc,
        anhDaiDien,
        noiBat: noiBat === 'true',
        taiKhoanId,
        nhanVatId: nhanVatId ? parseInt(nhanVatId) : null,
        suKienId: suKienId ? parseInt(suKienId) : null,
        trieuDaiId: trieuDaiId ? parseInt(trieuDaiId) : null,
        thoiGianDoc: thoiGianDoc ? parseInt(thoiGianDoc) : 5
      });
      
      res.status(201).json(newArticle);
    } catch (error) {
      console.error("Create article error:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.put("/api/article/:id", upload.single("anhDaiDien"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { tieuDe, noiDung, tomTat, danhMuc, noiBat, nhanVatId, suKienId, trieuDaiId, thoiGianDoc } = req.body;
      
      const article = await storage.getBaiViet(id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Check if admin
      if (article.taiKhoanId !== req.user?.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      let anhDaiDien = article.anhDaiDien;
      if (req.file) {
        // Upload hình ảnh lên Catbox
        try {
          anhDaiDien = await catboxUploader.uploadFromMulter(req.file);
        } catch (uploadError) {
          console.error("Upload to Catbox failed:", uploadError);
          return res.status(500).json({ error: "Failed to upload image to Catbox" });
        }
      }

      const updatedArticle = await storage.updateBaiViet(id, {
        tieuDe,
        noiDung,
        tomTat,
        danhMuc,
        anhDaiDien,
        noiBat: noiBat === 'true',
        nhanVatId: nhanVatId ? parseInt(nhanVatId) : null,
        suKienId: suKienId ? parseInt(suKienId) : null,
        trieuDaiId: trieuDaiId ? parseInt(trieuDaiId) : null,
        thoiGianDoc: thoiGianDoc ? parseInt(thoiGianDoc) : 5
      });
      
      res.json(updatedArticle);
    } catch (error) {
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete("/api/article/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const article = await storage.getBaiViet(id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Check if admin
      if (article.taiKhoanId !== req.user?.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Xóa bài viết từ cơ sở dữ liệu
      // Lưu ý: Catbox không hỗ trợ xóa file trực tiếp mà không có user hash
      await storage.deleteBaiViet(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Image endpoints
  app.get("/api/image/article/:articleId", async (req, res) => {
    try {
      const articleId = parseInt(req.params.articleId);
      const images = await storage.getHinhAnhsByBaiVietId(articleId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch images" });
    }
  });

  app.post("/api/image", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }
      
      const { tieuDe, moTa, baiVietId } = req.body;
      
      // Upload hình ảnh lên Catbox
      let duongDan;
      try {
        duongDan = await catboxUploader.uploadFromMulter(req.file);
      } catch (uploadError) {
        console.error("Upload to Catbox failed:", uploadError);
        return res.status(500).json({ error: "Failed to upload image to Catbox" });
      }
      
      const newImage = await storage.createHinhAnh({
        duongDan,
        tieuDe,
        moTa,
        baiVietId: baiVietId ? parseInt(baiVietId) : null
      });
      
      res.status(201).json(newImage);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.put("/api/image/:id", upload.single("image"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const image = await storage.getHinhAnh(id);
      
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      
      const { tieuDe, moTa, baiVietId } = req.body;
      
      let duongDan = image.duongDan;
      if (req.file) {
        // Upload hình ảnh lên Catbox
        try {
          duongDan = await catboxUploader.uploadFromMulter(req.file);
        } catch (uploadError) {
          console.error("Upload to Catbox failed:", uploadError);
          return res.status(500).json({ error: "Failed to upload image to Catbox" });
        }
      }
      
      const updatedImage = await storage.updateHinhAnh(id, {
        duongDan,
        tieuDe,
        moTa,
        baiVietId: baiVietId ? parseInt(baiVietId) : null
      });
      
      res.json(updatedImage);
    } catch (error) {
      res.status(500).json({ error: "Failed to update image" });
    }
  });

  app.delete("/api/image/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const image = await storage.getHinhAnh(id);
      
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      
      // Xóa hình ảnh từ cơ sở dữ liệu
      // Lưu ý: Catbox không hỗ trợ xóa file trực tiếp mà không có user hash
      await storage.deleteHinhAnh(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Video endpoints
  app.get("/api/video/article/:articleId", async (req, res) => {
    try {
      const articleId = parseInt(req.params.articleId);
      const videos = await storage.getVideosByBaiVietId(articleId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.post("/api/video", upload.single("video"), async (req, res) => {
    try {
      const { tieuDe, moTa, duongDan, baiVietId } = req.body;
      
      let videoPath = duongDan;
      if (req.file) {
        // Upload video lên Catbox
        try {
          videoPath = await catboxUploader.uploadFromMulter(req.file);
        } catch (uploadError) {
          console.error("Upload to Catbox failed:", uploadError);
          return res.status(500).json({ error: "Failed to upload video to Catbox" });
        }
      }
      
      const newVideo = await storage.createVideo({
        duongDan: videoPath,
        tieuDe,
        moTa,
        baiVietId: baiVietId ? parseInt(baiVietId) : null
      });
      
      res.status(201).json(newVideo);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload video" });
    }
  });

  app.put("/api/video/:id", upload.single("video"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      const { tieuDe, moTa, duongDan, baiVietId } = req.body;
      
      let videoPath = duongDan || video.duongDan;
      if (req.file) {
        // Upload video lên Catbox
        try {
          videoPath = await catboxUploader.uploadFromMulter(req.file);
        } catch (uploadError) {
          console.error("Upload to Catbox failed:", uploadError);
          return res.status(500).json({ error: "Failed to upload video to Catbox" });
        }
      }
      
      const updatedVideo = await storage.updateVideo(id, {
        duongDan: videoPath,
        tieuDe,
        moTa,
        baiVietId: baiVietId ? parseInt(baiVietId) : null
      });
      
      res.json(updatedVideo);
    } catch (error) {
      res.status(500).json({ error: "Failed to update video" });
    }
  });

  app.delete("/api/video/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      // Xóa video từ cơ sở dữ liệu
      // Lưu ý: Catbox không hỗ trợ xóa file trực tiếp mà không có user hash
      await storage.deleteVideo(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete video" });
    }
  });

  // Get historical dynasties
  app.get("/api/dynasty", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const dynasties = await storage.getTrieuDais(limit, offset);
      res.json(dynasties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dynasties" });
    }
  });

  // Get historical figures
  app.get("/api/figure", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const figures = await storage.getNhanVats(limit, offset);
      res.json(figures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch historical figures" });
    }
  });

  // Get historical events
  app.get("/api/event", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const events = await storage.getSuKiens(limit, offset);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch historical events" });
    }
  });

  // Account management (for admin)
  app.get("/api/account", async (req, res) => {
    try {
      // Verify if current user is admin
      const currentUser = req.user;
      if (!currentUser || currentUser.vaiTro !== 'Admin') {
        return res.status(403).json({ error: "Unauthorized: Admin access required" });
      }

      // Get all accounts
      const accounts = await storage.getAllTaiKhoans();
      // Remove password field for security
      const safeAccounts = accounts.map(account => {
        const { password, ...safeAccount } = account;
        return safeAccount;
      });
      
      res.json(safeAccounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  app.delete("/api/account/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Verify if current user is admin
      const currentUser = req.user;
      if (!currentUser || currentUser.vaiTro !== 'Admin') {
        return res.status(403).json({ error: "Unauthorized: Admin access required" });
      }

      // Don't allow deleting your own account
      if (id === currentUser.id) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }

      const account = await storage.getTaiKhoan(id);
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      await storage.deleteTaiKhoan(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  app.put("/api/account/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Verify if current user is admin or the account owner
      const currentUser = req.user;
      if (!currentUser || (currentUser.id !== id && currentUser.vaiTro !== 'Admin')) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const account = await storage.getTaiKhoan(id);
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      const { hoTen, tenDangNhap, vaiTro } = req.body;
      
      // Only admin can change the role
      if (vaiTro && currentUser.vaiTro !== 'Admin') {
        return res.status(403).json({ error: "Unauthorized: Cannot change role" });
      }

      const updateData: { hoTen?: string; tenDangNhap?: string; vaiTro?: 'Admin' | 'User' } = {};
      if (hoTen) updateData.hoTen = hoTen;
      if (tenDangNhap) updateData.tenDangNhap = tenDangNhap;
      if (vaiTro) updateData.vaiTro = vaiTro;

      const updatedAccount = await storage.updateTaiKhoan(id, updateData);
      
      // Remove password field for security
      const { password, ...safeAccount } = updatedAccount!;
      
      res.json(safeAccount);
    } catch (error) {
      res.status(500).json({ error: "Failed to update account" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
