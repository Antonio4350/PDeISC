import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import accesoRoutes from './routes/acceso.js';
import componentesRoutes from './routes/componentes.js';
import adminRoutes from './routes/admin.js';
import metaRoutes from './routes/meta.js';
import usuariosRoutes from './routes/usuarios.js';
import pool, { testConnection } from './config/db.js';

// Cargar variables de entorno antes de cualquier otra cosa
dotenv.config();

// Probar la conexión después de cargar el .env
testConnection();

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));

app.use('/acceso', accesoRoutes);
app.use('/componentes', componentesRoutes);
app.use('/admin', adminRoutes);
app.use('/meta', metaRoutes);
app.use('/usuarios', usuariosRoutes);

app.get('/', (req, res) => res.json({ ok: true, msg: 'AntonioPCBuilder backend ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`server running on 0.0.0.0:${PORT}`));
