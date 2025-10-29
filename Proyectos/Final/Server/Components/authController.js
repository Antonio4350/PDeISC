const userService = require('./userService');
const { googleLogin } = require('./GoogleAuth');

class AuthController {
  // Login con Google
  async googleLogin(req, res) {
    const { idToken, accessToken } = req.body;
    
    try {
      console.log('Solicitud Google Login recibida');
      
      // Verificar tokens con Google
      const googleResult = await googleLogin(idToken, accessToken);
      
      if (!googleResult.success) {
        return res.json(googleResult);
      }

      // Buscar usuario por email
      const existingUser = await userService.findUserByEmail(googleResult.mail);
      
      if (existingUser) {
        // Usuario existe - actualizar si es necesario
        if (!existingUser.google_id && googleResult.googleId) {
          await userService.updateGoogleId(existingUser.id, googleResult.googleId);
        }
        
        return res.json({
          success: true,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            nombre: existingUser.nombre || googleResult.name,
            apellido: existingUser.apellido,
            rol: existingUser.rol,
            avatar_url: existingUser.avatar_url
          }
        });
      } else {
        // Crear nuevo usuario
        const newUser = await userService.createGoogleUser({
          email: googleResult.mail,
          nombre: googleResult.name,
          google_id: googleResult.googleId,
          avatar_url: googleResult.picture
        });

        return res.json({
          success: true,
          user: {
            id: newUser.id,
            email: newUser.email,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            rol: newUser.rol,
            avatar_url: newUser.avatar_url
          }
        });
      }
    } catch (err) {
      console.error('Error en Google login:', err);
      res.json({ 
        success: false, 
        error: err.message || 'Error interno del servidor' 
      });
    }
  }

  // Login normal
  async normalLogin(req, res) {
    const { email, password } = req.body;
    
    try {
      console.log('Solicitud Login normal:', { email });
      
      if (!email || !password) {
        return res.json({ 
          success: false, 
          error: 'Email y contraseña son requeridos' 
        });
      }

      // Buscar usuario por email
      const user = await userService.findUserByEmail(email);
      
      if (!user) {
        return res.json({ 
          success: false, 
          error: 'Usuario no encontrado' 
        });
      }

      // Verificar si es usuario de Google
      if (user.google_id && !user.password) {
        return res.json({ 
          success: false, 
          error: 'Este usuario está registrado con Google. Usá el login con Google.' 
        });
      }

      // Verificar contraseña
      if (user.password !== password) {
        return res.json({ 
          success: false, 
          error: 'Contraseña incorrecta' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Login exitoso',
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          rol: user.rol,
          telefono: user.telefono
        }
      });
    } catch (error) {
      console.error('Error en login normal:', error);
      res.json({ 
        success: false, 
        error: 'Error interno del servidor' 
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
        return res.json({ 
          success: false, 
          error: 'Todos los campos obligatorios deben ser completados' 
        });
      }

      if (password.length < 6) {
        return res.json({ 
          success: false, 
          error: 'La contraseña debe tener al menos 6 caracteres' 
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await userService.findUserByEmail(email);
      
      if (existingUser) {
        return res.json({ 
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

      res.json({ 
        success: true, 
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          email: newUser.email,
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          telefono: newUser.telefono,
          rol: newUser.rol
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.json({ 
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
        return res.json({ 
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
      res.json({ 
        success: false, 
        error: 'Error interno del servidor' 
      });
    }
  }
}

// Exportar una instancia de la clase
module.exports = new AuthController();