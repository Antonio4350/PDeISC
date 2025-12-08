import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// ========== MIDDLEWARE ==========
// Configuración de CORS para desarrollo y producción
const allowedOrigins = [
  // Desarrollo local
  'http://localhost:3000', 
  'http://localhost:19006', 
  'http://localhost:8081', 
  'exp://localhost:19000', 
  'http://localhost:19000',
  
  // Producción - URLs de Vercel (REEMPLAZA CON TUS URLS REALES)
  'https://proyectofinalacv.vercel.app',
  'https://proyectofinalacv-frontend.vercel.app',
  'https://proyectofinalacv-backend.vercel.app',
  
  // También acepta cualquier origen en desarrollo
  ...(process.env.NODE_ENV === 'development' ? ['*'] : [])
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origen (como apps móviles)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // En producción, verificar origen
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.includes(origin) || origin === undefined) {
        return callback(null, true);
      } else {
        console.warn(`⚠️ Origen CORS bloqueado en producción: ${origin}`);
        return callback(new Error('CORS no permitido'), false);
      }
    }
    
    // En desarrollo, permitir todo
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

app.options('*', cors());
app.use(express.json());

// Logging de requests (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
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
}

// Importar componentes
import authController from './Components/authController.js';
import componentController from './Components/componentController.js';
import propertyController from './Components/propertyController.js';
import projectController from './Components/projectController.js';

// Extraer middleware
const { authenticateToken } = authController;

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend de ProyectoFinalACV funcionando',
    project: 'AntonioPCBuilder',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    baseUrl: req.protocol + '://' + req.get('host')
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
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

// RUTAS ESPECÍFICAS
app.get("/components/stats", (req, res) => componentController.getComponentStats(req, res));
app.get("/components/form-options", (req, res) => componentController.getFormOptions(req, res));

// PROCESADORES
app.get("/components/processors", (req, res) => componentController.getProcessors(req, res));
app.get("/components/processors/:id", (req, res) => {
  console.log(`🔍 GET /components/processors/${req.params.id} llamado`);
  componentController.getProcessorById(req, res);
});
app.post("/components/processors", (req, res) => componentController.createProcessor(req, res));
app.put("/components/processors/:id", (req, res) => {
  console.log(`✏️ PUT /components/processors/${req.params.id} llamado`);
  console.log('📦 Body:', req.body);
  componentController.updateProcessor(req, res);
});
app.delete("/components/processors/:id", (req, res) => componentController.deleteProcessor(req, res));

// MOTHERBOARDS
app.get("/components/motherboards", (req, res) => componentController.getMotherboards(req, res));
app.get("/components/motherboards/:id", (req, res) => {
  console.log(`🔍 GET /components/motherboards/${req.params.id} llamado`);
  componentController.getMotherboardById(req, res);
});
app.post("/components/motherboards", (req, res) => componentController.createMotherboard(req, res));
app.put("/components/motherboards/:id", (req, res) => {
  console.log(`✏️ PUT /components/motherboards/${req.params.id} llamado`);
  console.log('📦 Body:', req.body);
  componentController.updateMotherboard(req, res);
});
app.delete("/components/motherboards/:id", (req, res) => componentController.deleteMotherboard(req, res));

// MEMORIAS RAM
app.get("/components/ram", (req, res) => componentController.getRAM(req, res));
app.get("/components/ram/:id", (req, res) => {
  console.log(`🔍 GET /components/ram/${req.params.id} llamado`);
  componentController.getRAMById(req, res);
});
app.post("/components/ram", (req, res) => componentController.createRAM(req, res));
app.put("/components/ram/:id", (req, res) => {
  console.log(`✏️ PUT /components/ram/${req.params.id} llamado`);
  console.log('📦 Body:', req.body);
  componentController.updateRAM(req, res);
});
app.delete("/components/ram/:id", (req, res) => componentController.deleteRAM(req, res));

// TARJETAS GRÁFICAS
app.get("/components/tarjetas_graficas", (req, res) => componentController.getGPUs(req, res));
app.post("/components/tarjetas_graficas", (req, res) => componentController.createGPU(req, res));
app.get("/components/tarjetas_graficas/:id", (req, res) => {
  console.log(`🔍 GET /components/tarjetas_graficas/${req.params.id} llamado`);
  componentController.getGPUById(req, res);
});
app.put("/components/tarjetas_graficas/:id", (req, res) => {
  console.log(`✏️ PUT /components/tarjetas_graficas/${req.params.id} llamado`);
  console.log('📦 Body:', req.body);
  componentController.updateGPU(req, res);
});
app.delete("/components/tarjetas_graficas/:id", (req, res) => componentController.deleteGPU(req, res));

// ALMACENAMIENTO
app.get("/components/almacenamiento", (req, res) => componentController.getStorage(req, res));
app.post("/components/almacenamiento", (req, res) => componentController.createStorage(req, res));
app.get("/components/almacenamiento/:id", (req, res) => {
  console.log(`🔍 GET /components/almacenamiento/${req.params.id} llamado`);
  componentController.getStorageById(req, res);
});
app.put("/components/almacenamiento/:id", (req, res) => {
  console.log(`✏️ PUT /components/almacenamiento/${req.params.id} llamado`);
  console.log('📦 Body:', req.body);
  componentController.updateStorage(req, res);
});
app.delete("/components/almacenamiento/:id", (req, res) => componentController.deleteStorage(req, res));

// FUENTES DE PODER
app.get("/components/fuentes_poder", (req, res) => componentController.getPSUs(req, res));
app.post("/components/fuentes_poder", (req, res) => componentController.createPSU(req, res));
app.get("/components/fuentes_poder/:id", (req, res) => {
  console.log(`🔍 GET /components/fuentes_poder/${req.params.id} llamado`);
  componentController.getPSUById(req, res);
});
app.put("/components/fuentes_poder/:id", (req, res) => {
  console.log(`✏️ PUT /components/fuentes_poder/${req.params.id} llamado`);
  console.log('📦 Body:', req.body);
  componentController.updatePSU(req, res);
});
app.delete("/components/fuentes_poder/:id", (req, res) => componentController.deletePSU(req, res));

// GABINETES
app.get("/components/gabinetes", (req, res) => componentController.getCases(req, res));
app.post("/components/gabinetes", (req, res) => componentController.createCase(req, res));
app.get("/components/gabinetes/:id", (req, res) => {
  console.log(`🔍 GET /components/gabinetes/${req.params.id} llamado`);
  componentController.getCaseById(req, res);
});
app.put("/components/gabinetes/:id", (req, res) => {
  console.log(`✏️ PUT /components/gabinetes/${req.params.id} llamado`);
  console.log('📦 Body:', req.body);
  componentController.updateCase(req, res);
});
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
    timestamp: new Date().toISOString()
  });
});

// ========== MANEJO DE ERRORES ==========
app.use((err, req, res, next) => {
  console.error('\n💥💥💥 ERROR NO MANEJADO:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
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
const PORT = parseInt(process.env.PORT, 10) || 5000;

function startServer() {
  try {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀🚀🚀 SERVIDOR EXPRESS INICIADO 🚀🚀🚀`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 URL Externa: https://proyectofinalacv-backend.vercel.app`);
      console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Puerto: ${PORT}`);
      
      console.log(`\n📋 ENDPOINTS PRINCIPALES:`);
      console.log(`   GET  /health                - Health check`);
      console.log(`   POST /login                 - Login usuario`);
      console.log(`   POST /register              - Registrar usuario`);
      console.log(`   GET  /components/:type      - Obtener componentes`);
    });

    server.on('error', (err) => {
      console.error('\n💥💥💥 ERROR CRÍTICO EN EL SERVIDOR:');
      console.error(err);
      process.exit(1);
    });

  } catch (error) {
    console.error('\n💥💥💥 ERROR AL INICIAR EL SERVIDOR:');
    console.error(error);
    process.exit(1);
  }
}

console.log('\n🔧 INICIANDO SERVIDOR...');
startServer();