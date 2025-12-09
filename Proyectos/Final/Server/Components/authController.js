import userService from './userService.js';
import { googleLogin as googleAuth } from './GoogleAuth.js';
import jwt from 'jsonwebtoken';

class AuthController {
  // Login con Google
  async googleLogin(req, res) {
    const { idToken, accessToken } = req.body;
    try {
      console.log('🔐 Google Login recibido');
      
      if (!accessToken && !idToken) {
        return res.status(400).json({
          success: false,
          error: 'Token requerido'
        });
      }

      // Verificar con Google
      const googleResult = await googleAuth(idToken, accessToken);
      
      if (!googleResult.success) {
        return res.status(401).json({
          success: false,
          error: googleResult.error
        });
      }

      // Buscar usuario
      const existingUser = await userService.findUserByEmail(googleResult.mail);
      
      if (existingUser) {
        // Generar JWT
        const token = jwt.sign(
          { id: existingUser.id, email: existingUser.email, rol: existingUser.rol },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: '30d' }
        );

        return res.json({
          success: true,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            nombre: existingUser.nombre || googleResult.name,
            apellido: existingUser.apellido,
            rol: existingUser.rol,
            avatar_url: existingUser.avatar_url || googleResult.picture
          },
          token: token
        });
      } else {
        // Crear nuevo usuario
        const newUser = await userService.createGoogleUser({
          email: googleResult.mail,
          nombre: googleResult.name,
          google_id: googleResult.googleId,
          avatar_url: googleResult.picture
        });

        const token = jwt.sign(
          { id: newUser.id, email: newUser.email, rol: newUser.rol },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: '30d' }
        );

        return res.json({
          success: true,
          user: {
            id: newUser.id,
            email: newUser.email,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            rol: newUser.rol,
            avatar_url: newUser.avatar_url
          },
          token: token
        });
      }
    } catch (err) {
      console.error('Error Google login:', err);
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

  // Login normal
  async normalLogin(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email y contraseña requeridos' 
        });
      }

      const user = await userService.findUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Usuario no encontrado' 
        });
      }

      if (user.google_id && !user.password) {
        return res.status(401).json({ 
          success: false, 
          error: 'Usa login con Google' 
        });
      }

      if (!await userService.verifyPassword(password, user.password)) {
        return res.status(401).json({ 
          success: false, 
          error: 'Contraseña incorrecta' 
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '30d' }
      );

      res.json({ 
        success: true, 
        message: 'Login exitoso',
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol,
          telefono: user.telefono,
          avatar_url: user.avatar_url
        },
        token: token
      });
    } catch (error) {
      console.error('Error login normal:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error interno' 
      });
    }
  }

  // Registro normal
  async normalRegister(req, res) {
    const { nombre, apellido, email, password, telefono } = req.body;
    try {
      if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Todos los campos obligatorios' 
        });
      }

      const existingUser = await userService.findUserByEmail(email);
      
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          error: 'Ya existe un usuario con este email' 
        });
      }

      const newUser = await userService.createUser({
        nombre,
        apellido,
        email,
        password,
        telefono
      });

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, rol: newUser.rol },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '30d' }
      );

      res.status(201).json({ 
        success: true, 
        message: 'Usuario registrado',
        user: {
          id: newUser.id,
          email: newUser.email,
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          telefono: newUser.telefono,
          rol: newUser.rol,
          avatar_url: newUser.avatar_url
        },
        token: token
      });
    } catch (error) {
      console.error('Error registro:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error creando usuario' 
      });
    }
  }

  // Obtener perfil
  async getUserProfile(req, res) {
    try {
      const userId = req.params.id;
      const user = await userService.findUserById(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'Usuario no encontrado' 
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          telefono: user.telefono,
          rol: user.rol,
          avatar_url: user.avatar_url,
          fecha_creacion: user.fecha_creacion
        }
      });
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error interno' 
      });
    }
  }

  // Verificar token
  async verifyToken(req, res) {
    try {
      const user = await userService.findUserById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol,
          telefono: user.telefono,
          avatar_url: user.avatar_url
        }
      });
    } catch (error) {
      console.error('Error verificando token:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno'
      });
    }
  }
}

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token requerido'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Token inválido'
      });
    }

    req.user = user;
    next();
  });
};

// Función para generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  );
};

// Crear instancia
const authControllerInstance = new AuthController();

// Exportar como objeto simple
export default {
  googleLogin: (req, res) => authControllerInstance.googleLogin(req, res),
  normalLogin: (req, res) => authControllerInstance.normalLogin(req, res),
  normalRegister: (req, res) => authControllerInstance.normalRegister(req, res),
  getUserProfile: (req, res) => authControllerInstance.getUserProfile(req, res),
  verifyToken: (req, res) => authControllerInstance.verifyToken(req, res),
  authenticateToken,
  generateToken
};