import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { TaiKhoan } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends TaiKhoan {}
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "lichsuvietnam-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "tenDangNhap",
        passwordField: "matKhau"
      },
      async (tenDangNhap, matKhau, done) => {
        try {
          const user = await storage.getTaiKhoanByTenDangNhap(tenDangNhap);
          if (!user || matKhau !== user.matKhau) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getTaiKhoan(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Đăng ký tài khoản mới
  app.post("/api/register", async (req, res, next) => {
    try {
      const { tenDangNhap, matKhau, hoTen } = req.body;
      
      // Kiểm tra xem tên đăng nhập đã tồn tại chưa
      const existingUser = await storage.getTaiKhoanByTenDangNhap(tenDangNhap);
      if (existingUser) {
        return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
      }
      
      // Tạo tài khoản mới, lưu mật khẩu dạng văn bản thường
      const user = await storage.createTaiKhoan({
        tenDangNhap,
        matKhau,
        hoTen
      });

      // Đăng nhập ngay sau khi đăng ký
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký" });
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Middleware to check if user is authenticated
  app.use([
    "/api/article/create", 
    "/api/article/update", 
    "/api/article/delete",
    "/api/image/create",
    "/api/image/update",
    "/api/image/delete",
    "/api/video/create",
    "/api/video/update",
    "/api/video/delete"
  ], (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  });
}
