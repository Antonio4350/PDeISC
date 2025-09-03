import pkg from "pg";
const { Pool } = pkg;

let pool;

if (!global.pgPool) {
  pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_CbKaJT7yWmX5@ep-delicate-resonance-agvk4f1o-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    ssl: { rejectUnauthorized: false },
  });
  global.pgPool = pool;
} else {
  pool = global.pgPool;
}

export default pool;
