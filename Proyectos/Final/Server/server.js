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
  console.log(`\n${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin || 'No origin');
  
  // Headers CORS MANUALES (por si acaso)
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  
  // Manejar OPTIONS (preflight) inmediatamente
  if (req.method === 'OPTIONS') {
    console.log('Preflight OPTIONS manejado');
    return res.status(200).end();
  }
  
  next();
});

// ========== MANEJAR OPTIONS PARA TODAS LAS RUTAS ==========
app.options('*', (req, res) => {
  console.log('Global OPTIONS para:', req.path);
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
    message: 'Backend funcionando',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: 'POST /googleLogin, POST /login, POST /register',
      test: 'GET /test, POST /test-post'
    }
  });
});

// RUTAS DE TEST ESPECÍFICAS
app.get('/test', (req, res) => {
  console.log('Test GET llamado desde:', req.headers.origin);
  res.json({
    success: true,
    message: 'GET funciona',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

app.post('/test-post', (req, res) => {
  console.log('Test POST llamado desde:', req.headers.origin);
  console.log('Body:', req.body);
  res.json({
    success: true,
    message: 'POST funciona',
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

// ========== RUTAS DE COMPONENTES (COMPLETAS) ==========

// GET - Listas
app.get('/components/processors', (req, res) => componentController.getProcessors(req, res));
app.get('/components/motherboards', (req, res) => componentController.getMotherboards(req, res));
app.get('/components/ram', (req, res) => componentController.getRAM(req, res));
app.get('/components/tarjetas_graficas', (req, res) => componentController.getGPUs(req, res));
app.get('/components/almacenamiento', (req, res) => componentController.getStorage(req, res));
app.get('/components/fuentes_poder', (req, res) => componentController.getPSUs(req, res));
app.get('/components/gabinetes', (req, res) => componentController.getCases(req, res));

// GET - Individuales por ID (FALTANTES)
app.get('/components/processors/:id', (req, res) => componentController.getProcessorById(req, res));
app.get('/components/motherboards/:id', (req, res) => componentController.getMotherboardById(req, res));
app.get('/components/ram/:id', (req, res) => componentController.getRAMById(req, res));
app.get('/components/tarjetas_graficas/:id', (req, res) => componentController.getGPUById(req, res));
app.get('/components/almacenamiento/:id', (req, res) => componentController.getStorageById(req, res));
app.get('/components/fuentes_poder/:id', (req, res) => componentController.getPSUById(req, res));
app.get('/components/gabinetes/:id', (req, res) => componentController.getCaseById(req, res));

// POST - Crear (FALTANTES)
app.post('/components/processors', (req, res) => componentController.createProcessor(req, res));
app.post('/components/motherboards', (req, res) => componentController.createMotherboard(req, res));
app.post('/components/ram', (req, res) => componentController.createRAM(req, res));
app.post('/components/tarjetas_graficas', (req, res) => componentController.createGPU(req, res));
app.post('/components/almacenamiento', (req, res) => componentController.createStorage(req, res));
app.post('/components/fuentes_poder', (req, res) => componentController.createPSU(req, res));
app.post('/components/gabinetes', (req, res) => componentController.createCase(req, res));

// PUT - Actualizar (FALTANTES)
app.put('/components/processors/:id', (req, res) => componentController.updateProcessor(req, res));
app.put('/components/motherboards/:id', (req, res) => componentController.updateMotherboard(req, res));
app.put('/components/ram/:id', (req, res) => componentController.updateRAM(req, res));
app.put('/components/tarjetas_graficas/:id', (req, res) => componentController.updateGPU(req, res));
app.put('/components/almacenamiento/:id', (req, res) => componentController.updateStorage(req, res));
app.put('/components/fuentes_poder/:id', (req, res) => componentController.updatePSU(req, res));
app.put('/components/gabinetes/:id', (req, res) => componentController.updateCase(req, res));

// DELETE - Eliminar (FALTANTES)
app.delete('/components/processors/:id', (req, res) => componentController.deleteProcessor(req, res));
app.delete('/components/motherboards/:id', (req, res) => componentController.deleteMotherboard(req, res));
app.delete('/components/ram/:id', (req, res) => componentController.deleteRAM(req, res));
app.delete('/components/tarjetas_graficas/:id', (req, res) => componentController.deleteGPU(req, res));
app.delete('/components/almacenamiento/:id', (req, res) => componentController.deleteStorage(req, res));
app.delete('/components/fuentes_poder/:id', (req, res) => componentController.deletePSU(req, res));
app.delete('/components/gabinetes/:id', (req, res) => componentController.deleteCase(req, res));

// Rutas adicionales que ya tenés en componentController.js
app.get('/components/stats', (req, res) => componentController.getComponentStats(req, res));
app.get('/components/form-options', (req, res) => componentController.getFormOptions(req, res));
app.post('/components/compatibility', (req, res) => componentController.checkCompatibility(req, res));
app.get('/components/:type', (req, res) => componentController.getComponentsByType(req, res));

// ========== RUTAS DE AUTENTICACIÓN ==========
// Middleware ESPECÍFICO para /googleLogin
app.use('/googleLogin', (req, res, next) => {
  console.log('Middleware GoogleLogin - Origin:', req.headers.origin);
  // Headers extra para esta ruta
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.post('/googleLogin', (req, res) => {
  console.log('GoogleLogin POST recibido');
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
  console.error('ERROR:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor'
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
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
  console.log(`\nSERVIDOR INICIADO EN PUERTO ${PORT}`);
  console.log(`URL: https://proyecto-final-back-zeta.vercel.app`);
  console.log(`CORS: ACTIVADO PARA TODOS LOS ORÍGENES`);
  console.log(`\n ENDPOINTS DISPONIBLES:`);
  console.log(`   GET  /test          - Test CORS GET`);
  console.log(`   POST /test-post     - Test CORS POST`);
  console.log(`   POST /googleLogin   - Login con Google`);
  console.log(`   GET  /health        - Health check`);
});