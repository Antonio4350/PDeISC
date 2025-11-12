import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_zcAn3gWPJeC2@ep-autumn-mountain-ahjdns06-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado a la base de datos');
    client.release();
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
  }
}

testConnection();

export default pool;