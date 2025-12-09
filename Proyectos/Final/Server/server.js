import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// ========== CONFIGURACIÓN CORS SIMPLIFICADA Y EFECTIVA ==========
// Opción 1: Permitir todos los orígenes (más fácil para debug)
app.use(cors({
  origin: '*', // Permitir TODOS los orígenes temporalmente
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept', 
    'Origin',
    'X-Requested-With',
    'X-CSRF-Token',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
}));

// ========== MIDDLEWARE PARA DEBUG CORS ==========
app.use((req, res, next) => {
  console.log('\n=== 🌐 REQUEST INCOMING ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Origin:', req.headers.origin || 'No origin header');
  console.log('User-Agent:', req.headers['user-agent']?.substring(0, 50) + '...');
  
  // Headers CORS manuales POR SI ACASO
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight OPTIONS request handled');
    return res.status(200).json({});
  }
  
  next();
});

// ========== MANEJAR OPTIONS GLOBALMENTE ==========
app.options('*', (req, res) => {
  console.log('🌐 Global OPTIONS request for:', req.path);
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});

app.use(express.json());

// Importar componentes
import authController from './Components/authController.js';
import componentController from './Components/componentController.js';
import propertyController from './Components/propertyController.js';
import projectController from './Components/projectController.js';

// Extraer middleware
const { authenticateToken } = authController;

// ========== RUTAS DE PRUEBA Y DIAGNÓSTICO ==========
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Backend de ProyectoFinalACV funcionando',
    project: 'AntonioPCBuilder',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    frontend_url: 'https://proyecto-final-front-xi.vercel.app',
    backend_url: 'https://proyecto-final-back-zeta.vercel.app',
    cors_status: 'ACTIVADO',
    endpoints: {
      auth: ['POST /googleLogin', 'POST /login', 'POST /register'],
      test: ['GET /health', 'GET /test-cors']
    }
  });
});

// Health check mejorado
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cors: {
      enabled: true,
      origin: req.headers.origin || 'none',
      method: req.method
    }
  });
});

// Endpoint ESPECÍFICO para testear CORS
app.get('/test-cors', (req, res) => {
  console.log('🧪 Test CORS endpoint llamado desde origen:', req.headers.origin);
  
  res.json({
    success: true,
    message: '✅ CORS está funcionando correctamente',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    method: req.method,
    server: 'proyecto-final-back-zeta.vercel.app',
    allowed: true
  });
});

app.post('/test-cors', (req, res) => {
  console.log('🧪 Test CORS POST llamado desde origen:', req.headers.origin);
  console.log('Body recibido:', req.body);
  
  res.json({
    success: true,
    message: '✅ CORS POST está funcionando correctamente',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    method: req.method,
    body_received: req.body,
    allowed: true
  });
});

// ========== RUTAS DE AUTENTICACIÓN ==========
// RUTAS GET PARA PRUEBAS
app.get('/login', (req, res) => {
  res.json({
    success: false,
    message: 'Usa POST para login',
    ejemplo: 'POST /login con {email, password}',
    frontend: 'https://proyecto-final-front-xi.vercel.app'
  });
});

app.get('/register', (req, res) => {
  res.json({
    success: false,
    message: 'Usa POST para registro',
    ejemplo: 'POST /register con {nombre, apellido, email, password}'
  });
});

app.get('/googleLogin', (req, res) => {
  res.json({
    success: false,
    message: 'Usa POST para Google login',
    ejemplo: 'POST /googleLogin con {idToken, accessToken}'
  });
});

// ========== MIDDLEWARE ESPECÍFICO PARA GOOGLE LOGIN (CORS EXTRA) ==========
app.use('/googleLogin', (req, res, next) => {
  console.log('🔐 Middleware específico para /googleLogin');
  console.log('Origin:', req.headers.origin);
  console.log('Method:', req.method);
  
  // Headers CORS explícitos para esta ruta
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight OPTIONS para /googleLogin manejado');
    return res.status(200).end();
  }
  
  next();
});

// RUTAS POST REALES DE AUTENTICACIÓN
app.post("/googleLogin", (req, res) => {
  console.log('📨 GoogleLogin POST recibido');
  console.log('Body keys:', Object.keys(req.body));
  console.log('Tiene accessToken?', !!req.body.accessToken);
  console.log('Tiene idToken?', !!req.body.idToken);
  
  // Verificar que tenemos al menos un token
  if (!req.body.accessToken && !req.body.idToken) {
    return res.status(400).json({
      success: false,
      error: 'Se requiere accessToken o idToken'
    });
  }
  
  // Llamar al controlador
  authController.googleLogin(req, res);
});

app.post("/login", (req, res) => authController.normalLogin(req, res));
app.post("/register", (req, res) => authController.normalRegister(req, res));
app.get("/user/:id", (req, res) => authController.getUserProfile(req, res));

// ========== RUTAS DE COMPONENTES ==========
// ... (tus rutas existentes de componentes se mantienen igual) ...

// PROCESADORES
app.get("/components/processors", (req, res) => componentController.getProcessors(req, res));
app.get("/components/processors/:id", (req, res) => componentController.getProcessorById(req, res));
app.post("/components/processors", (req, res) => componentController.createProcessor(req, res));
app.put("/components/processors/:id", (req, res) => componentController.updateProcessor(req, res));
app.delete("/components/processors/:id", (req, res) => componentController.deleteProcessor(req, res));

// MOTHERBOARDS
app.get("/components/motherboards", (req, res) => componentController.getMotherboards(req, res));
app.get("/components/motherboards/:id", (req, res) => componentController.getMotherboardById(req, res));
app.post("/components/motherboards", (req, res) => componentController.createMotherboard(req, res));
app.put("/components/motherboards/:id", (req, res) => componentController.updateMotherboard(req, res));
app.delete("/components/motherboards/:id", (req, res) => componentController.deleteMotherboard(req, res));

// MEMORIAS RAM
app.get("/components/ram", (req, res) => componentController.getRAM(req, res));
app.get("/components/ram/:id", (req, res) => componentController.getRAMById(req, res));
app.post("/components/ram", (req, res) => componentController.createRAM(req, res));
app.put("/components/ram/:id", (req, res) => componentController.updateRAM(req, res));
app.delete("/components/ram/:id", (req, res) => componentController.deleteRAM(req, res));

// TARJETAS GRÁFICAS
app.get("/components/tarjetas_graficas", (req, res) => componentController.getGPUs(req, res));
app.post("/components/tarjetas_graficas", (req, res) => componentController.createGPU(req, res));
app.get("/components/tarjetas_graficas/:id", (req, res) => componentController.getGPUById(req, res));
app.put("/components/tarjetas_graficas/:id", (req, res) => componentController.updateGPU(req, res));
app.delete("/components/tarjetas_graficas/:id", (req, res) => componentController.deleteGPU(req, res));

// ALMACENAMIENTO
app.get("/components/almacenamiento", (req, res) => componentController.getStorage(req, res));
app.post("/components/almacenamiento", (req, res) => componentController.createStorage(req, res));
app.get("/components/almacenamiento/:id", (req, res) => componentController.getStorageById(req, res));
app.put("/components/almacenamiento/:id", (req, res) => componentController.updateStorage(req, res));
app.delete("/components/almacenamiento/:id", (req, res) => componentController.deleteStorage(req, res));

// FUENTES DE PODER
app.get("/components/fuentes_poder", (req, res) => componentController.getPSUs(req, res));
app.post("/components/fuentes_poder", (req, res) => componentController.createPSU(req, res));
app.get("/components/fuentes_poder/:id", (req, res) => componentController.getPSUById(req, res));
app.put("/components/fuentes_poder/:id", (req, res) => componentController.updatePSU(req, res));
app.delete("/components/fuentes_poder/:id", (req, res) => componentController.deletePSU(req, res));

// GABINETES
app.get("/components/gabinetes", (req, res) => componentController.getCases(req, res));
app.post("/components/gabinetes", (req, res) => componentController.createCase(req, res));
app.get("/components/gabinetes/:id", (req, res) => componentController.getCaseById(req, res));
app.put("/components/gabinetes/:id", (req, res) => componentController.updateCase(req, res));
app.delete("/components/gabinetes/:id", (req, res) => componentController.deleteCase(req, res));

// ========== COMPATIBILIDAD ==========
app.post("/components/compatibility", (req, res) => componentController.checkCompatibility(req, res));

// RUTAS DINÁMICAS PARA TIPOS DE COMPONENTES
app.get("/components/:type", (req, res) => componentController.getComponentsByType(req, res));

// ========== RUTAS DE PROPIEDADES ==========
app.get("/properties", (req, res) => propertyController.getAllProperties(req, res));
app.get("/properties/form", (req, res) => propertyController.getFormProperties(req, res));
app.get("/properties/:type", (req, res) => propertyController.getPropertiesByType(req, res));
app.post("/properties", (req, res) => propertyController.addProperty(req, res));
app.delete("/properties/:id", (req, res) => propertyController.deleteProperty(req, res));
app.get("/properties/with-ids", (req, res) => propertyController.getAllPropertiesWithIds(req, res));
app.post("/properties/find-id", (req, res) => propertyController.findPropertyId(req, res));

// ========== RUTAS DE PROYECTOS ==========
app.get('/api/projects', authenticateToken, projectController.getUserProjects);
app.get('/api/projects/:id', authenticateToken, projectController.getProjectById);
app.post('/api/projects', authenticateToken, projectController.createProject);
app.put('/api/projects/:id', authenticateToken, projectController.updateProject);
app.delete('/api/projects/:id', authenticateToken, projectController.deleteProject);
app.post('/api/projects/:projectId/components', authenticateToken, projectController.addComponentToProject);
app.delete('/api/projects/:projectId/components/:tipoComponente', authenticateToken, projectController.removeComponentFromProject);
app.get('/api/projects/:projectId/compatibility', authenticateToken, projectController.checkProjectCompatibility);

// ========== RUTA DE PRUEBA SIN AUTENTICACIÓN ==========
app.post('/api/projects/test', (req, res) => {
  res.json({
    success: true,
    message: 'Ruta de prueba funciona',
    timestamp: new Date().toISOString(),
    cors: 'ACTIVADO'
  });
});

// ========== MANEJO DE ERRORES ==========
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err.stack);
  
  // Headers CORS incluso en errores
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  console.log(`🔍 Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  
  // Headers CORS incluso en 404
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada',
    endpoint: req.originalUrl,
    method: req.method,
    suggestion: 'Verifica la URL y el método HTTP'
  });
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 SERVIDOR INICIADO 🚀`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌍 Producción: https://proyecto-final-back-zeta.vercel.app`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS: ACTIVADO para todos los orígenes`);
  console.log(`\n📋 ENDPOINTS DE TEST:`);
  console.log(`   GET  /test-cors              - Test CORS básico`);
  console.log(`   POST /test-cors              - Test CORS POST`);
  console.log(`   GET  /health                 - Health check`);
  console.log(`   GET  /googleLogin            - Info endpoint Google`);
  console.log(`\n🔗 Frontend: https://proyecto-final-front-xi.vercel.app`);
});