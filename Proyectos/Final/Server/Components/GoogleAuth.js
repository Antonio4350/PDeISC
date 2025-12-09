// Components/GoogleAuth.js
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = "58585220959-2ii0sgs43cp9ja7rtm9gaemo4hqb7vvh.apps.googleusercontent.com"; // Tu CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);

async function googleLogin(idToken, accessToken) {
  try {
    console.log('🔍 GoogleAuth.js - Iniciando verificación...');
    console.log('CLIENT_ID:', CLIENT_ID);
    console.log('Tiene idToken?:', !!idToken);
    console.log('Tiene accessToken?:', !!accessToken);
    
    let email, name, googleId, picture;
    
    // PRIMERO: Intentar con idToken (más confiable)
    if (idToken) {
      console.log('🔑 Usando ID Token...');
      try {
        const ticket = await client.verifyIdToken({
          idToken: idToken,
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
        
        console.log('✅ ID Token verificado - Email:', email);
        console.log('Payload completo:', payload);
        
      } catch (idTokenError) {
        console.error('❌ Error con ID Token:', idTokenError.message);
        // Continuar con accessToken
      }
    }
    
    // SEGUNDO: Si no tenemos email del idToken, usar accessToken
    if (!email && accessToken) {
      console.log('🔑 Usando Access Token (fallback)...');
      try {
        // Hacer la request a Google API
        console.log('🌐 Llamando a Google API...');
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
        });
        
        console.log('📊 Google API Status:', userInfoRes.status);
        console.log('📊 Google API Headers:', [...userInfoRes.headers.entries()]);
        
        if (!userInfoRes.ok) {
          const errorText = await userInfoRes.text();
          console.error('❌ Google API Error response:', errorText);
          throw new Error(`Google API Error: ${userInfoRes.status} - ${errorText}`);
        }
        
        const userInfo = await userInfoRes.json();
        console.log('✅ Google API Response:', userInfo);
        
        if (!userInfo.email) {
          throw new Error('No se pudo obtener email del usuario');
        }
        
        email = userInfo.email;
        name = userInfo.name;
        googleId = userInfo.sub;
        picture = userInfo.picture;
        
        console.log('✅ Usuario obtenido con Access Token:', email);
        
      } catch (accessTokenError) {
        console.error('❌ Error con Access Token:', accessTokenError.message);
        throw accessTokenError;
      }
    }
    
    // Si no tenemos email de ningún método
    if (!email) {
      console.error('❌ No se pudo obtener email de ningún método');
      return { 
        success: false, 
        error: "No se pudo autenticar con Google. Intenta nuevamente." 
      };
    }

    console.log(`✅ Usuario Google autenticado: ${email}, Nombre: ${name}`);

    return { 
      success: true, 
      mail: email,  // Mantener 'mail' para compatibilidad con frontend
      email: email,
      name: name,
      googleId: googleId,
      picture: picture
    };
    
  } catch (err) {
    console.error('💥 Error en googleLogin:', err);
    console.error('Stack:', err.stack);
    return { 
      success: false, 
      error: err.message || 'Error de autenticación con Google' 
    };
  }
}

export { googleLogin };