import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  console.error('DATABASE_URL is not defined');
  process.exit(1);
}

const migrationClient = postgres(connectionString, { max: 1 });

async function runMigration() {
  console.log('🔄 Running migrations...');
  
  try {
    // Đảm bảo thư mục migrations tồn tại
    const migrationsDir = path.join(process.cwd(), 'drizzle', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('📁 Creating migrations directory');
      fs.mkdirSync(migrationsDir, { recursive: true });
    }
    
    // Thực hiện migration
    const db = drizzle(migrationClient);
    await migrate(db, { migrationsFolder: migrationsDir });
    
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

runMigration();