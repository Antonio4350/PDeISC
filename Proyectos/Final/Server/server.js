
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar componentes
import authController from './Components/authController.js';
import startupMonitor from './Components/startupMonitor.js';
import componentController from './Components/componentController.js';
import propertyController from './Components/propertyController.js';
import projectController from './Components/projectController.js';
import compatibilityController from './Components/compatibilityController.js';

// Extraer middleware
const { authenticateToken } = authController;

// Middleware CORS mejorado
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:19006', 'exp://localhost:19000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend de ProyectoFinalACV funcionando',
    project: 'AntonioPCBuilder',
    status: 'OK'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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

// TARJETAS GRÁFICAS - RUTAS ESPECÍFICAS
app.get("/components/tarjetas_graficas", (req, res) => componentController.getGPUs(req, res));
app.post("/components/tarjetas_graficas", (req, res) => componentController.createGPU(req, res));
app.get("/components/tarjetas_graficas/:id", (req, res) => componentController.getGPUById(req, res));
app.put("/components/tarjetas_graficas/:id", (req, res) => componentController.updateGPU(req, res));
app.delete("/components/tarjetas_graficas/:id", (req, res) => componentController.deleteGPU(req, res));

// ALMACENAMIENTO - RUTAS ESPECÍFICAS
app.get("/components/almacenamiento", (req, res) => componentController.getStorage(req, res));
app.post("/components/almacenamiento", (req, res) => componentController.createStorage(req, res));
app.get("/components/almacenamiento/:id", (req, res) => componentController.getStorageById(req, res));
app.put("/components/almacenamiento/:id", (req, res) => componentController.updateStorage(req, res));
app.delete("/components/almacenamiento/:id", (req, res) => componentController.deleteStorage(req, res));

// FUENTES DE PODER - RUTAS ESPECÍFICAS
app.get("/components/fuentes_poder", (req, res) => componentController.getPSUs(req, res));
app.post("/components/fuentes_poder", (req, res) => componentController.createPSU(req, res));
app.get("/components/fuentes_poder/:id", (req, res) => componentController.getPSUById(req, res));
app.put("/components/fuentes_poder/:id", (req, res) => componentController.updatePSU(req, res));
app.delete("/components/fuentes_poder/:id", (req, res) => componentController.deletePSU(req, res));

// GABINETES - RUTAS ESPECÍFICAS
app.get("/components/gabinetes", (req, res) => componentController.getCases(req, res));
app.post("/components/gabinetes", (req, res) => componentController.createCase(req, res));
app.get("/components/gabinetes/:id", (req, res) => componentController.getCaseById(req, res));
app.put("/components/gabinetes/:id", (req, res) => componentController.updateCase(req, res));
app.delete("/components/gabinetes/:id", (req, res) => componentController.deleteCase(req, res));

// ========== RUTAS DE COMPATIBILIDAD AVANZADA ==========

app.post("/compatibility/socket", (req, res) => compatibilityController.validateSocket(req, res));
app.post("/compatibility/ram", (req, res) => compatibilityController.validateRAM(req, res));
app.post("/compatibility/storage", (req, res) => compatibilityController.validateStorage(req, res));
app.post("/compatibility/gpu", (req, res) => compatibilityController.validateGPU(req, res));
app.post("/compatibility/format", (req, res) => compatibilityController.validateFormat(req, res));
app.post("/compatibility/power", (req, res) => compatibilityController.validatePower(req, res));
app.post("/compatibility/complete-build", (req, res) => compatibilityController.validateCompleteBuild(req, res));

// COMPATIBILIDAD
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
app.get('/api/projects', authenticateToken, projectController.getUserProjects);
app.post('/api/projects', authenticateToken, projectController.createProject);
app.get('/api/projects/:id', authenticateToken, projectController.getProjectById);
app.delete('/api/projects/:id', authenticateToken, projectController.deleteProject);
app.post('/api/projects/:projectId/components', authenticateToken, projectController.addComponentToProject);
app.delete('/api/projects/:projectId/components/:tipoComponente', authenticateToken, projectController.removeComponentFromProject);
app.get('/api/projects/:projectId/compatibility', authenticateToken, projectController.checkProjectCompatibility);

// ========== MANEJO DE ERRORES ==========

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Algo salió mal en el servidor',
    error: err.message 
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

// ========== INICIAR SERVIDOR ==========

// Iniciar servidor
const PORT = parseInt(process.env.PORT, 10) || 5000;
const PREFERRED_HOSTS = ["0.0.0.0", process.env.HOST_IP || '192.168.1.38', '127.0.0.1'];

function listenOnce(host, port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, host, () => resolve(server));
    server.on('error', (err) => reject(err));
  });
}

async function startServer() {
  try {
    // Mostrar información de inicio
    const startupInfo = await startupMonitor.displayStartupInfo(PORT);

    let server = null;
    let tried = [];
    let portToTry = PORT;

    for (const host of PREFERRED_HOSTS) {
      try {
        console.log(`Intentando bind en ${host}:${portToTry} ...`);
        server = await listenOnce(host, portToTry);
        console.log(`Bind correcto en ${host}:${portToTry}`);
        break;
      } catch (err) {
        console.log(`No se pudo bind en ${host}:${portToTry}: ${err.code || err.message}`);
        tried.push({ host, port: portToTry, error: err });
      }
    }

    // If no host succeeded, try alternate port
    if (!server) {
      const altPort = PORT === 5000 ? 5001 : PORT + 1;
      console.log(`Intentando puerto alternativo ${altPort} en 0.0.0.0 ...`);
      try {
        server = await listenOnce('0.0.0.0', altPort);
        portToTry = altPort;
        console.log(`Bind correcto en 0.0.0.0:${altPort}`);
      } catch (err) {
        console.log(`Fallo bind alternativo: ${err.code || err.message}`);
      }
    }

    if (!server) {
      console.log('\n💥 No se pudo iniciar el servidor en los hosts/puertos intentados:');
      console.log(tried);
      process.exit(1);
    }

    // Mostrar listo
    startupMonitor.displayServerReady({ ...startupInfo, port: portToTry });

    // Manejo de errores del servidor
    server.on('error', (err) => {
      console.log('\n💥 ERROR EN EL SERVIDOR:');
      console.log(err);
      process.exit(1);
    });

  } catch (error) {
    console.log('\n💥 ERROR AL INICIAR EL SERVIDOR:');
    console.log(error);
    process.exit(1);
  }
}

// Manejo de errores global
process.on('unhandledRejection', (err) => {
  console.log('\n❌ ERROR CRÍTICO (Rejection):');
  console.log(err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log('\n❌ ERROR CRÍTICO (Exception):');
  console.log(err);
  process.exit(1);
});

// Iniciar
startServer().catch((err) => {
  console.log('\n💥 ERROR EN startServer:');
  console.log(err);
  process.exit(1);
});