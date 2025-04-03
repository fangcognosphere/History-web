import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';

// Use createRequire để dùng require trong ESM
const require = createRequire(import.meta.url);
// Import các classes từ thư viện
const { Catbox, Litterbox } = require('node-catbox');

interface CatboxResponse {
  url: string;
  [key: string]: any;
}

/**
 * Utility để upload file lên Catbox
 */
export class CatboxUploader {
  private catbox: any;
  private litterbox: any;

  constructor() {
    this.catbox = new Catbox();
    this.litterbox = new Litterbox();
  }

  /**
   * Upload một file lên Catbox
   * @param filePath - Đường dẫn đến file cần upload
   * @returns Promise<string> - URL của file đã upload
   */
  async uploadFile(filePath: string): Promise<string> {
    try {
      const result = await this.catbox.uploadFile({
        path: filePath
      });
      return result;
    } catch (error: any) {
      console.error('Lỗi khi upload file lên Catbox:', error);
      throw new Error(`Lỗi khi upload file: ${error.message}`);
    }
  }

  /**
   * Upload file từ FormData
   * @param file - File object từ multer
   * @returns Promise<string> - URL của file đã upload
   */
  async uploadFromMulter(file: any): Promise<string> {
    try {
      // Lưu file tạm thời
      const tempFilePath = path.join('/tmp', file.originalname);
      await fs.promises.writeFile(tempFilePath, file.buffer);
      
      // Upload file
      const result = await this.catbox.uploadFile({
        path: tempFilePath
      });
      
      // Xóa file tạm sau khi upload
      await fs.promises.unlink(tempFilePath);
      
      return result;
    } catch (error: any) {
      console.error('Lỗi khi upload file lên Catbox:', error);
      throw new Error(`Lỗi khi upload file: ${error.message}`);
    }
  }
}

// Singleton instance
export const catboxUploader = new CatboxUploader();