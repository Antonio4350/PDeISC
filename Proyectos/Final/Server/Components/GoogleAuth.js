const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
  "58585220959-2ii0sgs43cp9ja7rtm9gaemo4hqb7vvh.apps.googleusercontent.com"
);

async function googleLogin(idToken, accessToken) {
  try {
    let email, name, googleId, picture;
    
    if (idToken) {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: "58585220959-2ii0sgs43cp9ja7rtm9gaemo4hqb7vvh.apps.googleusercontent.com",
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      googleId = payload.sub;
      picture = payload.picture;
    } else if (accessToken) {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await userInfoRes.json();
      email = userInfo.email;
      name = userInfo.name;
      googleId = userInfo.sub;
      picture = userInfo.picture;
    } else {
      return { success: false, message: "Token faltante" };
    }

    console.log(`Usuario Google autenticado: ${email}, Nombre: ${name}`);

    return { 
      success: true, 
      mail: email,
      name: name,
      googleId: googleId,
      picture: picture
    };
    
  } catch (err) {
    console.error('Error en googleLogin:', err);
    return { success: false, error: err.message };
  }
}

module.exports = { googleLogin };