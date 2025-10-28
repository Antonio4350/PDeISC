const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar autenticación Google
const { googleLogin } = require('./Components/googleAuth');

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

// Ruta de login con Google
app.post("/googleLogin", async (req, res) => {
  const { idToken, accessToken } = req.body;
  
  try {
    const result = await googleLogin(idToken, accessToken);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// Ruta de login normal (para implementar después)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  // Simulación de login
  console.log('Login normal:', { email, password });
  
  // Aquí irá la lógica real de autenticación
  res.json({ 
    success: true, 
    message: 'Login exitoso',
    user: { email, name: 'Usuario Demo' }
  });
});

// Ruta de registro normal (para implementar después)
app.post("/register", async (req, res) => {
  const { nombre, apellido, email, password, telefono } = req.body;
  
  // Simulación de registro
  console.log('Registro normal:', { nombre, apellido, email, telefono });
  
  // Aquí irá la lógica real de registro
  res.json({ 
    success: true, 
    message: 'Usuario registrado exitosamente',
    user: { email, nombre, apellido }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal en el servidor' });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor ProyectoFinalACV en puerto ${PORT}`);
});