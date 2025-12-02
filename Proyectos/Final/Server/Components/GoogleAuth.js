import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = "58585220959-fltgp46dkjjrcdo144gqeib2c5tqg58c.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

async function googleLogin(idToken, accessToken) {
  try {
    console.log('🔍 Verificando tokens de Google...', { 
      hasIdToken: !!idToken, 
      hasAccessToken: !!accessToken 
    });
    
    let email, name, googleId, picture;
    
    if (idToken) {
      console.log('✅ Usando ID Token para verificación...');
      const ticket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new Error('Payload vacío en ID Token');
      }
      
      email = payload.email;
      name = payload.name;
      googleId = payload.sub;
      picture = payload.picture;
      
      console.log('✅ Usuario verificado con ID Token:', email);
      
    } else if (accessToken) {
      console.log('✅ Usando Access Token para obtener información...');
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (!userInfoRes.ok) {
        throw new Error(`Error de Google API: ${userInfoRes.status}`);
      }
      
      const userInfo = await userInfoRes.json();
      
      if (!userInfo.email) {
        throw new Error('No se pudo obtener email del usuario');
      }
      
      email = userInfo.email;
      name = userInfo.name;
      googleId = userInfo.sub;
      picture = userInfo.picture;
      
      console.log('✅ Usuario obtenido con Access Token:', email);
    } else {
      return { 
        success: false, 
        error: "Se requiere ID Token o Access Token" 
      };
    }

    console.log(`✅ Usuario Google autenticado: ${email}, Nombre: ${name}`);

    return { 
      success: true, 
      mail: email,  // Mantener 'mail' para compatibilidad con frontend
      email: email, // Agregar también 'email'
      name: name,
      googleId: googleId,
      picture: picture
    };
    
  } catch (err) {
    console.error('❌ Error en googleLogin:', err);
    return { 
      success: false, 
      error: err.message || 'Error de autenticación con Google' 
    };
  }
}

export { googleLogin };