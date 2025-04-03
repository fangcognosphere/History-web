import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer storage
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage_config,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Serve uploads directory
  app.use("/uploads", (req, res, next) => {
    // Set cache headers for static files
    res.setHeader("Cache-Control", "public, max-age=86400");
    next();
  }, (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    res.sendFile(filePath, (err) => {
      if (err) {
        next();
      }
    });
  });

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
        anhDaiDien = `/uploads/${req.file.filename}`;
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
        anhDaiDien = `/uploads/${req.file.filename}`;
        
        // Delete old image if exists and is not the default
        if (article.anhDaiDien && !article.anhDaiDien.includes("default")) {
          const oldImagePath = path.join(uploadsDir, article.anhDaiDien.replace("/uploads/", ""));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
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

      // Delete article image if exists
      if (article.anhDaiDien && !article.anhDaiDien.includes("default")) {
        const imagePath = path.join(uploadsDir, article.anhDaiDien.replace("/uploads/", ""));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

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
      const duongDan = `/uploads/${req.file.filename}`;
      
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
        duongDan = `/uploads/${req.file.filename}`;
        
        // Delete old image
        if (image.duongDan) {
          const oldImagePath = path.join(uploadsDir, image.duongDan.replace("/uploads/", ""));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
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
      
      // Delete image file
      if (image.duongDan) {
        const imagePath = path.join(uploadsDir, image.duongDan.replace("/uploads/", ""));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
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
        videoPath = `/uploads/${req.file.filename}`;
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
        videoPath = `/uploads/${req.file.filename}`;
        
        // Delete old video if it was a local file
        if (video.duongDan && video.duongDan.startsWith('/uploads/')) {
          const oldVideoPath = path.join(uploadsDir, video.duongDan.replace("/uploads/", ""));
          if (fs.existsSync(oldVideoPath)) {
            fs.unlinkSync(oldVideoPath);
          }
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
      
      // Delete video file if it's a local file
      if (video.duongDan && video.duongDan.startsWith('/uploads/')) {
        const videoPath = path.join(uploadsDir, video.duongDan.replace("/uploads/", ""));
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }
      
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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
