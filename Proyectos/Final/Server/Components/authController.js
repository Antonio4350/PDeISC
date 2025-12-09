import userService from './userService.js';
import { googleLogin } from './GoogleAuth.js';
import jwt from 'jsonwebtoken';

class AuthController {
  // Login con Google
  // Login con Google
async googleLogin(req, res) {
  try {
    const { idToken, accessToken } = req.body;
    
    console.log('\n=== 🔐 GOOGLE LOGIN INICIADO ===');
    console.log('📦 Request Body recibido:', { 
      hasIdToken: !!idToken,
      hasAccessToken: !!accessToken,
      idTokenLength: idToken?.length || 0,
      accessTokenLength: accessToken?.length || 0
    });
    console.log('🌐 Origin:', req.headers.origin);
    console.log('📱 User-Agent:', req.headers['user-agent']?.substring(0, 100));
    
    // Validar que tenemos al menos un token
    if (!accessToken && !idToken) {
      console.log('❌ Error: No tokens recibidos');
      return res.status(400).json({
        success: false,
        error: 'Token de acceso o ID token requerido',
        code: 'NO_TOKENS'
      });
    }

    console.log('🔍 Llamando a googleLogin (GoogleAuth.js)...');
    
    // Verificar tokens con Google
    const googleResult = await googleLogin(idToken, accessToken);
    
    console.log('📊 Resultado de GoogleAuth:', {
      success: googleResult.success,
      error: googleResult.error,
      mail: googleResult.mail,
      name: googleResult.name
    });
    
    if (!googleResult.success) {
      console.log('❌ Error de Google Auth:', googleResult.error);
      return res.status(401).json({
        success: false,
        error: googleResult.error || 'Error en autenticación con Google',
        code: 'GOOGLE_AUTH_FAILED',
        details: {
          hasIdToken: !!idToken,
          hasAccessToken: !!accessToken
        }
      });
    }

    if (!googleResult.mail) {
      console.log('❌ Error: No se pudo obtener el email');
      return res.status(401).json({
        success: false,
        error: 'No se pudo obtener el email del usuario de Google',
        code: 'NO_EMAIL'
      });
    }

    console.log(`✅ Google Auth exitoso: ${googleResult.mail}`);
    
    // Buscar usuario por email
    console.log(`🔍 Buscando usuario en BD: ${googleResult.mail}`);
    const existingUser = await userService.findUserByEmail(googleResult.mail);
    
    if (existingUser) {
      console.log('✅ Usuario existente encontrado:', {
        id: existingUser.id,
        email: existingUser.email,
        nombre: existingUser.nombre
      });
      
      // Usuario existe - actualizar si es necesario
      if (!existingUser.google_id && googleResult.googleId) {
        console.log(`🔄 Actualizando Google ID: ${googleResult.googleId}`);
        await userService.updateGoogleId(existingUser.id, googleResult.googleId);
      }
      
      // Generar token JWT
      console.log('🔑 Generando JWT...');
      const token = generateToken(existingUser);

      console.log('🎉 Login exitoso (usuario existente)');
      
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
        token: token,
        isNewUser: false
      });
    } else {
      console.log('🆕 Creando nuevo usuario para:', googleResult.mail);
      
      // Crear nuevo usuario
      const newUserData = {
        email: googleResult.mail,
        nombre: googleResult.name,
        google_id: googleResult.googleId,
        avatar_url: googleResult.picture
      };
      
      console.log('📝 Datos del nuevo usuario:', newUserData);
      
      const newUser = await userService.createGoogleUser(newUserData);

      if (!newUser) {
        console.log('❌ Error: No se pudo crear el usuario');
        throw new Error('No se pudo crear el usuario');
      }

      console.log('✅ Usuario creado:', {
        id: newUser.id,
        email: newUser.email
      });

      // Generar token JWT
      console.log('🔑 Generando JWT para nuevo usuario...');
      const token = generateToken(newUser);

      console.log('🎉 Login exitoso (nuevo usuario)');
      
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
        token: token,
        isNewUser: true
      });
    }
  } catch (err) {
    console.error('\n💥💥💥 ERROR EN GOOGLE LOGIN 💥💥💥');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Request body:', req.body);
    console.error('Request headers:', req.headers);
    console.error('=== FIN ERROR ===\n');
    
    // Asegurar headers CORS incluso en errores
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Error interno del servidor',
      code: 'INTERNAL_ERROR'
    });
  }
}

  // Registro normal
  async normalRegister(req, res) {
    const { nombre, apellido, email, password, telefono } = req.body;
    
    try {
      console.log('Solicitud Registro:', { nombre, apellido, email, telefono });
      
      // Validaciones básicas
      if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Todos los campos obligatorios deben ser completados' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          success: false, 
          error: 'La contraseña debe tener al menos 6 caracteres' 
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await userService.findUserByEmail(email);
      
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          error: 'Ya existe un usuario con este email' 
        });
      }

      // Crear usuario
      const newUser = await userService.createUser({
        nombre,
        apellido,
        email,
        password,
        telefono
      });

      // Generar token JWT
      const token = generateToken(newUser);

      res.status(201).json({ 
        success: true, 
        message: 'Usuario registrado exitosamente',
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
      console.error('Error en registro:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error creando usuario' 
      });
    }
  }

  // Obtener perfil de usuario
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
        error: 'Error interno del servidor' 
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
        error: 'Error interno del servidor'
      });
    }
  }
}

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de acceso requerido'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Token inválido o expirado'
      });
    }

    req.user = user;
    next();
  });
};

// Función para generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      rol: user.rol 
    },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  );
};

// Crear instancia del controlador
const authControllerInstance = new AuthController();

// Exportar una instancia de la clase Y las funciones adicionales
export default {
  // Métodos del controlador
  googleLogin: authControllerInstance.googleLogin.bind(authControllerInstance),
  normalLogin: authControllerInstance.normalLogin.bind(authControllerInstance),
  normalRegister: authControllerInstance.normalRegister.bind(authControllerInstance),
  getUserProfile: authControllerInstance.getUserProfile.bind(authControllerInstance),
  verifyToken: authControllerInstance.verifyToken.bind(authControllerInstance),
  
  // Funciones adicionales
  authenticateToken,
  generateToken
};