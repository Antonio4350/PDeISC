import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// ========== MIDDLEWARE ==========
// Configuración de CORS SIMPLIFICADA
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:19006', 
    'http://localhost:8081', 
    'exp://localhost:19000', 
    'http://localhost:19000',
    'https://proyecto-final-front-xi.vercel.app', // TU FRONTEND
    'https://proyecto-final-back-zeta.vercel.app'  // TU BACKEND
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

app.options('*', cors());
app.use(express.json());

// Logging de requests
app.use((req, res, next) => {
  console.log(`\n=== 🌐 REQUEST ${req.method} ${req.url} ===`);
  console.log('📋 Origin:', req.headers.origin);
  console.log('📦 Body:', req.body);
  next();
});

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
    frontend_url: 'https://proyecto-final-front-xi.vercel.app'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: 'POST /login, POST /register',
      components: 'GET /components/:type',
      projects: 'GET /api/projects'
    }
  });
});

// ========== RUTAS DE AUTENTICACIÓN ==========
// RUTAS GET PARA PRUEBAS (AGREGA ESTAS)
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
    message: 'Usa POST para Google login'
  });
});

// RUTAS POST REALES
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
    timestamp: new Date().toISOString()
  });
});

// ========== MANEJO DE ERRORES ==========
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor'
  });
});

// Ruta no encontrada - MODIFICADA
app.use('*', (req, res) => {
  console.log(`🔍 Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  
  // Si es una ruta de API, devolver JSON
  if (req.originalUrl.startsWith('/api') || 
      req.originalUrl.startsWith('/login') ||
      req.originalUrl.startsWith('/register') ||
      req.originalUrl.startsWith('/components') ||
      req.originalUrl.startsWith('/user') ||
      req.originalUrl.startsWith('/properties')) {
    
    res.status(404).json({ 
      success: false,
      message: 'Ruta de API no encontrada',
      endpoint: req.originalUrl,
      method: req.method,
      suggestion: 'Verifica la URL y el método HTTP'
    });
  } else {
    // Para otras rutas (como favicon.ico)
    res.status(404).json({ 
      success: false,
      message: 'Ruta no encontrada'
    });
  }
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 SERVIDOR INICIADO 🚀`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌍 Producción: https://proyecto-final-back-zeta.vercel.app`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📋 RUTAS DISPONIBLES:`);
  console.log(`   GET  /                    - Home`);
  console.log(`   GET  /health              - Health check`);
  console.log(`   GET  /login               - Info login (POST para auth)`);
  console.log(`   POST /login               - Login real`);
  console.log(`   POST /register            - Registro`);
});