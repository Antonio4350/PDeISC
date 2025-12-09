import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// ========== CORS ULTRA PERMISIVO (para desarrollo) ==========
const corsOptions = {
  origin: '*', // Permitir TODO en desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
};

app.use(cors(corsOptions));

// ========== MIDDLEWARE PARA MANEJAR PREFLIGHT ==========
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin || 'No origin');
  
  // Headers CORS MANUALES (por si acaso)
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  
  // Manejar OPTIONS (preflight) inmediatamente
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight OPTIONS manejado');
    return res.status(200).end();
  }
  
  next();
});

// ========== MANEJAR OPTIONS PARA TODAS LAS RUTAS ==========
app.options('*', (req, res) => {
  console.log('🌐 Global OPTIONS para:', req.path);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  return res.status(200).end();
});

app.use(express.json());

// Importar componentes
import authController from './Components/authController.js';
import componentController from './Components/componentController.js';
import propertyController from './Components/propertyController.js';
import projectController from './Components/projectController.js';

// Extraer middleware
const { authenticateToken } = authController;

// ========== RUTAS DE PRUEBA ==========
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Backend funcionando',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: 'POST /googleLogin, POST /login, POST /register',
      test: 'GET /test, POST /test-post'
    }
  });
});

// RUTAS DE TEST ESPECÍFICAS
app.get('/test', (req, res) => {
  console.log('🧪 Test GET llamado desde:', req.headers.origin);
  res.json({
    success: true,
    message: '✅ GET funciona',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

app.post('/test-post', (req, res) => {
  console.log('🧪 Test POST llamado desde:', req.headers.origin);
  console.log('Body:', req.body);
  res.json({
    success: true,
    message: '✅ POST funciona',
    origin: req.headers.origin,
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    cors: 'ACTIVADO',
    origin: req.headers.origin
  });
});

// ========== RUTAS DE AUTENTICACIÓN ==========
// Middleware ESPECÍFICO para /googleLogin
app.use('/googleLogin', (req, res, next) => {
  console.log('🔐 Middleware GoogleLogin - Origin:', req.headers.origin);
  // Headers extra para esta ruta
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.post('/googleLogin', (req, res) => {
  console.log('📨 GoogleLogin POST recibido');
  console.log('Origin:', req.headers.origin);
  console.log('Body keys:', Object.keys(req.body));
  console.log('Tiene accessToken?:', !!req.body.accessToken);
  
  // Llamar al controlador
  authController.googleLogin(req, res);
});

app.post('/login', (req, res) => authController.normalLogin(req, res));
app.post('/register', (req, res) => authController.normalRegister(req, res));
app.get('/user/:id', (req, res) => authController.getUserProfile(req, res));

// ========== RUTAS DE COMPONENTES (mantén tus rutas actuales) ==========
app.get('/components/processors', (req, res) => componentController.getProcessors(req, res));
app.get('/components/motherboards', (req, res) => componentController.getMotherboards(req, res));
app.get('/components/ram', (req, res) => componentController.getRAM(req, res));
app.get('/components/tarjetas_graficas', (req, res) => componentController.getGPUs(req, res));
app.get('/components/almacenamiento', (req, res) => componentController.getStorage(req, res));
app.get('/components/fuentes_poder', (req, res) => componentController.getPSUs(req, res));
app.get('/components/gabinetes', (req, res) => componentController.getCases(req, res));

// ... resto de tus rutas de componentes ...

// ========== RUTAS DE PROYECTOS ==========
app.get('/api/projects', authenticateToken, projectController.getUserProjects);
app.post('/api/projects', authenticateToken, projectController.createProject);
app.get('/api/projects/:id', authenticateToken, projectController.getProjectById);
app.put('/api/projects/:id', authenticateToken, projectController.updateProject);
app.delete('/api/projects/:id', authenticateToken, projectController.deleteProject);

// ========== MANEJO DE ERRORES ==========
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor'
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  console.log(`🔍 Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 SERVIDOR INICIADO EN PUERTO ${PORT}`);
  console.log(`🔗 URL: https://proyecto-final-back-zeta.vercel.app`);
  console.log(`🔐 CORS: ACTIVADO PARA TODOS LOS ORÍGENES`);
  console.log(`\n📋 ENDPOINTS DISPONIBLES:`);
  console.log(`   GET  /test          - Test CORS GET`);
  console.log(`   POST /test-post     - Test CORS POST`);
  console.log(`   POST /googleLogin   - Login con Google`);
  console.log(`   GET  /health        - Health check`);
});