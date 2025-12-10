// Components/GoogleAuth.js
import { OAuth2Client } from 'google-auth-library';

// ✅ TODOS los client IDs que usas
const CLIENT_IDS = [
  "58585220959-8capru7gmaertcnsvoervkm3vsef6q3l",  // Android
  "58585220959-fltgp46dkjjrcdo144gqeib2c5tqg58c",  // Web
  "58585220959-2ii0sgs43cp9ja7rtm9gaemo4hqb7vvh"   // Actual (probablemente otro)
];

// Crear cliente sin ID específico inicialmente
const client = new OAuth2Client();

async function googleLogin(idToken, accessToken, platform = 'web') {
  try {
    console.log('GoogleAuth.js - Iniciando verificación...');
    console.log('Platform:', platform);
    console.log('Tiene idToken?:', !!idToken);
    console.log('Tiene accessToken?:', !!accessToken);
    
    let email, name, googleId, picture;
    let usedClientId = null;
    
    // PRIMERO: Intentar con idToken (más confiable)
    if (idToken) {
      console.log('Usando ID Token...');
      
      // ✅ INTENTAR con CADA CLIENT ID hasta que uno funcione
      for (const clientId of CLIENT_IDS) {
        try {
          console.log(`Intentando con clientId: ${clientId.substring(0, 20)}...`);
          
          const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: clientId, // Probar cada clientId
          });
          
          const payload = ticket.getPayload();
          
          if (payload && payload.email) {
            email = payload.email;
            name = payload.name;
            googleId = payload.sub;
            picture = payload.picture;
            usedClientId = clientId;
            
            console.log('✅ ID Token verificado con clientId:', clientId.substring(0, 20));
            console.log('Email:', email);
            break; // ¡Éxito! Salir del bucle
          }
        } catch (err) {
          console.log(`❌ ClientId ${clientId.substring(0, 20)} no funcionó:`, err.message);
          // Continuar con el siguiente
        }
      }
    }
    
    // SEGUNDO: Si no tenemos email del idToken, usar accessToken
    if (!email && accessToken) {
      console.log('🔑 Usando Access Token (fallback)...');
      try {
        // Hacer la request a Google API
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
        });
        
        console.log('Google API Status:', userInfoRes.status);
        
        if (!userInfoRes.ok) {
          throw new Error(`Google API Error: ${userInfoRes.status}`);
        }
        
        const userInfo = await userInfoRes.json();
        
        if (!userInfo.email) {
          throw new Error('No se pudo obtener email del usuario');
        }
        
        email = userInfo.email;
        name = userInfo.name;
        googleId = userInfo.sub;
        picture = userInfo.picture;
        
        console.log('✅ Usuario obtenido con Access Token');
        
      } catch (accessTokenError) {
        console.error('Error con Access Token:', accessTokenError.message);
        // No lanzar error todavía, verificar abajo
      }
    }
    
    // Si no tenemos email de ningún método
    if (!email) {
      console.error('No se pudo obtener email de ningún método');
      console.error('Client IDs intentados:', CLIENT_IDS);
      return { 
        success: false, 
        error: "No se pudo autenticar con Google. Verifica las credenciales." 
      };
    }

    console.log(`✅ Usuario Google autenticado: ${email}`);
    console.log(`✅ ClientId usado: ${usedClientId || 'Access Token'}`);

    return { 
      success: true, 
      mail: email,  // Mantener 'mail' para compatibilidad
      email: email,
      name: name,
      googleId: googleId,
      picture: picture
    };
    
  } catch (err) {
    console.error('Error en googleLogin:', err);
    return { 
      success: false, 
      error: err.message || 'Error de autenticación con Google' 
    };
  }
}

export { googleLogin };