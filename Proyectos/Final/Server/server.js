import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// ========== MIDDLEWARE ==========
// CORS COMPLETO Y FUNCIONAL
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:19006', 'http://localhost:8081', 'exp://localhost:19000', 'http://localhost:19000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Manejar preflight OPTIONS
app.options('*', cors());

app.use(express.json());

// Logging de requests MEJORADO
app.use((req, res, next) => {
  console.log(`\n=== 🌐 REQUEST INCOMING ===`);
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('📋 Headers:', {
    authorization: req.headers.authorization ? 'PRESENTE' : 'NO',
    origin: req.headers.origin,
    'content-type': req.headers['content-type']
  });
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', JSON.stringify(req.body).substring(0, 200) + '...');
  }
  console.log(`=== END REQUEST ===\n`);
  next();
});

// Importar componentes
import authController from './Components/authController.js';
import startupMonitor from './Components/startupMonitor.js';
import componentController from './Components/componentController.js';
import propertyController from './Components/propertyController.js';
import projectController from './Components/projectController.js';
import compatibilityController from './Components/compatibilityController.js';

// Extraer middleware
const { authenticateToken } = authController;

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend de ProyectoFinalACV funcionando',
    project: 'AntonioPCBuilder',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    endpoints: {
      projects: '/api/projects',
      components: '/components',
      auth: '/login, /register'
    }
  });
});

// ========== RUTAS DE AUTENTICACIÓN ==========
app.post("/googleLogin", (req, res) => authController.googleLogin(req, res));
app.post("/login", (req, res) => authController.normalLogin(req, res));
app.post("/register", (req, res) => authController.normalRegister(req, res));
app.get("/user/:id", (req, res) => authController.getUserProfile(req, res));

// ========== RUTAS DE COMPONENTES ==========

// RUTAS ESPECÍFICAS (DEBEN IR ANTES de la ruta dinámica :type)
app.get("/components/stats", (req, res) => componentController.getComponentStats(req, res));
app.get("/components/form-options", (req, res) => componentController.getFormOptions(req, res));

// PROCESADORES
app.get("/components/processors", (req, res) => componentController.getProcessors(req, res));
app.get("/components/processors/:id", (req, res) => componentController.getProcessorById(req, res));
app.post("/components/processors", (req, res) => componentController.createProcessor(req, res));
app.put("/components/processors/:id", (req, res) => componentController.updateProcessor(req, res));
app.delete("/components/processors/:id", (req, res) => componentController.deleteProcessor(req, res));

// MOTHERBOARDS
app.get("/components/motherboards", (req, res) => componentController.getMotherboards(req, res));
app.post("/components/motherboards", (req, res) => componentController.createMotherboard(req, res));
app.put("/components/motherboards/:id", (req, res) => componentController.updateMotherboard(req, res));
app.delete("/components/motherboards/:id", (req, res) => componentController.deleteMotherboard(req, res));

// MEMORIAS RAM
app.get("/components/ram", (req, res) => componentController.getRAM(req, res));
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

// RUTAS DINÁMICAS PARA TIPOS DE COMPONENTES (DEBE IR AL FINAL)
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

// ✅ RUTA GET PROYECTOS CON LOGS MEJORADOS
app.get('/api/projects', authenticateToken, (req, res, next) => {
  console.log('🔐 MIDDLEWARE authenticateToken ejecutado para GET /api/projects');
  console.log('  User ID:', req.user?.id);
  console.log('  User email:', req.user?.email);
  console.log('  Token recibido:', req.headers.authorization?.substring(0, 50) + '...');
  next();
}, projectController.getUserProjects);

// ✅ RUTA GET PROYECTO POR ID
app.get('/api/projects/:id', authenticateToken, (req, res, next) => {
  console.log('🔐 MIDDLEWARE authenticateToken ejecutado para GET /api/projects/:id');
  console.log('  User ID:', req.user?.id);
  console.log('  Project ID:', req.params.id);
  next();
}, projectController.getProjectById);

// ✅ RUTA POST CREAR PROYECTO
app.post('/api/projects', authenticateToken, (req, res, next) => {
  console.log('🔐 MIDDLEWARE authenticateToken ejecutado para POST /api/projects');
  console.log('  User ID:', req.user?.id);
  console.log('  Body recibido:', req.body);
  next();
}, projectController.createProject);

// ✅ RUTA PUT ACTUALIZAR PROYECTO
app.put('/api/projects/:id', authenticateToken, (req, res, next) => {
  console.log('🔐 MIDDLEWARE authenticateToken ejecutado para PUT /api/projects/:id');
  console.log('  User ID:', req.user?.id);
  console.log('  Project ID:', req.params.id);
  console.log('  Body recibido:', req.body);
  next();
}, projectController.updateProject);

// ✅ RUTA DELETE ELIMINAR PROYECTO CON LOGS MEJORADOS
app.delete('/api/projects/:id', authenticateToken, (req, res, next) => {
  console.log('🔐 MIDDLEWARE authenticateToken ejecutado para DELETE /api/projects/:id');
  console.log('  User ID:', req.user?.id);
  console.log('  User email:', req.user?.email);
  console.log('  Project ID a eliminar:', req.params.id);
  console.log('  Token recibido:', req.headers.authorization?.substring(0, 50) + '...');
  console.log('  Headers completos:', {
    authorization: req.headers.authorization ? 'PRESENTE' : 'NO',
    'content-type': req.headers['content-type'],
    origin: req.headers.origin
  });
  next();
}, projectController.deleteProject);

// ✅ OTRAS RUTAS DE PROYECTOS
app.post('/api/projects/:projectId/components', authenticateToken, projectController.addComponentToProject);
app.delete('/api/projects/:projectId/components/:tipoComponente', authenticateToken, projectController.removeComponentFromProject);
app.get('/api/projects/:projectId/compatibility', authenticateToken, projectController.checkProjectCompatibility);

// ========== RUTA DE PRUEBA SIN AUTENTICACIÓN ==========
app.post('/api/projects/test', (req, res) => {
  console.log('🧪 RUTA DE PRUEBA SIN AUTH llamada');
  console.log('  Headers:', req.headers);
  console.log('  Body:', req.body);
  
  res.json({
    success: true,
    message: 'Ruta de prueba funciona',
    receivedHeaders: {
      authorization: req.headers.authorization || 'NO',
      contentType: req.headers['content-type'] || 'NO'
    },
    receivedBody: req.body,
    timestamp: new Date().toISOString()
  });
});

// ========== MANEJO DE ERRORES ==========
app.use((err, req, res, next) => {
  console.error('\n💥💥💥 ERROR NO MANEJADO:', err.stack);
  console.error('💥 Request que causó el error:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  console.log(`🔍 Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  console.log('📋 Headers recibidos:', req.headers);
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      auth: ['POST /login', 'POST /register', 'POST /googleLogin'],
      components: ['GET /components/:type', 'GET /components/processors', 'GET /components/motherboards', 'etc'],
      projects: [
        'GET /api/projects',
        'POST /api/projects',
        'GET /api/projects/:id',
        'PUT /api/projects/:id',
        'DELETE /api/projects/:id'
      ],
      test: ['POST /api/projects/test (sin auth)']
    }
  });
});

// ========== INICIAR SERVIDOR ==========
const PORT = parseInt(process.env.PORT, 10) || 5000;

function startServer() {
  try {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀🚀🚀 SERVIDOR EXPRESS INICIADO 🚀🚀🚀`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📍 URL alternativas: http://127.0.0.1:${PORT}, http://0.0.0.0:${PORT}`);
      console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Escuchando en todos los interfaces de red`);
      
      console.log(`\n📋 RUTAS PRINCIPALES:`);
      console.log(`   GET  /                    - Health check`);
      console.log(`   POST /api/projects        - Crear proyecto (requiere auth)`);
      console.log(`   PUT  /api/projects/:id    - Actualizar proyecto (requiere auth) ✅`);
      console.log(`   DELETE /api/projects/:id  - Eliminar proyecto (requiere auth) ✅`);
      console.log(`   POST /api/projects/test   - Prueba SIN auth`);
      console.log(`   GET  /api/projects        - Obtener proyectos (requiere auth)`);
      console.log(`   POST /login              - Iniciar sesión`);
      console.log(`   POST /register           - Registrarse`);
      
      console.log(`\n🔧 PARA PROBAR:`);
      console.log(`   1. Abre: http://localhost:${PORT}/`);
      console.log(`   2. Prueba auth: POST http://localhost:${PORT}/login`);
      console.log(`   3. Prueba crear proyecto: POST http://localhost:${PORT}/api/projects`);
      console.log(`   4. Prueba eliminar proyecto: DELETE http://localhost:${PORT}/api/projects/1`);
      console.log(`   5. Prueba ruta test: POST http://localhost:${PORT}/api/projects/test`);
      
      console.log(`\n📝 LOGS ACTIVADOS:`);
      console.log(`   • Todas las requests se registran con detalles`);
      console.log(`   • Headers de autenticación visibles`);
      console.log(`   • Body de requests visibles`);
      console.log(`   • Errores detallados con stack trace`);
    });

    server.on('error', (err) => {
      console.error('\n💥💥💥 ERROR CRÍTICO EN EL SERVIDOR:');
      console.error(err);
      console.error('\nPOSIBLES SOLUCIONES:');
      console.error('   1. El puerto 5000 podría estar ocupado');
      console.error('   2. Ejecuta: lsof -i :5000  (para ver qué usa el puerto)');
      console.error('   3. O usa otro puerto: PORT=5001 node server.js');
      process.exit(1);
    });

  } catch (error) {
    console.error('\n💥💥💥 ERROR AL INICIAR EL SERVIDOR:');
    console.error(error);
    process.exit(1);
  }
}

// Iniciar
console.log('\n🔧 INICIANDO SERVIDOR...');
console.log('🔧 CORS configurado para:');
console.log('   - http://localhost:3000');
console.log('   - http://localhost:19006');
console.log('   - http://localhost:8081');
console.log('   - exp://localhost:19000');
console.log('   - http://localhost:19000');
console.log('🔧 Métodos permitidos: GET, POST, PUT, DELETE, OPTIONS, PATCH');
console.log('🔧 Headers permitidos: Content-Type, Authorization, Accept, Origin, X-Requested-With');
console.log('🔧 Credenciales: permitidas');

startServer();