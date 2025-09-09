import pkg from 'pg';
const { Client } = pkg;

export async function connectBD() {
  try {
    const client = new Client({
      connectionString: 'postgresql://neondb_owner:npg_CbKaJT7yWmX5@ep-delicate-resonance-agvk4f1o-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    console.log('Conexión a la base de datos establecida');
    return client;
  } catch (err) {
    console.error('Error de conexión a la BD:', err);
  }
}
