const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar componentes
const authController = require('./Components/authController');
const startupMonitor = require('./Components/startupMonitor');
const componentController = require('./Components/componentController');
const propertyController = require('./Components/propertyController');

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

// RUTAS DINÁMICAS PARA TIPOS DE COMPONENTES (DEBE IR AL FINAL)
app.get("/components/:type", (req, res) => componentController.getComponentsByType(req, res));

// COMPATIBILIDAD
app.post("/components/compatibility", (req, res) => componentController.checkCompatibility(req, res));

app.get("/properties", (req, res) => propertyController.getAllProperties(req, res));
app.get("/properties/form", (req, res) => propertyController.getFormProperties(req, res));
app.get("/properties/:type", (req, res) => propertyController.getPropertiesByType(req, res));
app.post("/properties", (req, res) => propertyController.addProperty(req, res));
app.delete("/properties/:id", (req, res) => propertyController.deleteProperty(req, res));
// ========== MANEJO DE ERRORES ==========
app.get("/properties/with-ids", (req, res) => propertyController.getAllPropertiesWithIds(req, res));

app.post("/properties/find-id", (req, res) => propertyController.findPropertyId(req, res));

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
// ========== RUTAS DELETE ==========
app.delete("/components/processors/:id", (req, res) => componentController.deleteProcessor(req, res));
app.delete("/components/motherboards/:id", (req, res) => componentController.deleteMotherboard(req, res));
app.delete("/components/ram/:id", (req, res) => componentController.deleteRAM(req, res));
// Iniciar servidor
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Mostrar información de inicio
    const startupInfo = await startupMonitor.displayStartupInfo(PORT);
    
    // Iniciar servidor
    app.listen(PORT,'192.168.1.35', () => {
      startupMonitor.displayServerReady(startupInfo);
    });
    
  } catch (error) {
    console.log('\n💥 ERROR AL INICIAR EL SERVIDOR:');
    console.log(error);
    process.exit(1);
  }
}

// Manejo de errores global
process.on('unhandledRejection', (err) => {
  console.log('\n❌ ERROR CRÍTICO:');
  console.log(err);
  process.exit(1);
});

// Iniciar
startServer();