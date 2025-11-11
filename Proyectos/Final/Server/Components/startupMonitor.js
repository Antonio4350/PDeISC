const pool = require('./database');

class StartupMonitor {
  // Verificar conexión a la base de datos
  async checkDatabaseConnection() {
    try {
      const startTime = Date.now();
      const { rows } = await pool.query('SELECT 1 as connected');
      const ping = Date.now() - startTime;
      
      return {
        status: '✅ CONECTADA',
        ping: `${ping}ms`,
        message: 'Conexión exitosa a PostgreSQL (Neon)',
        success: true
      };
    } catch (error) {
      return {
        status: '❌ DESCONECTADA',
        ping: null,
        message: `Error: ${error.message}`,
        success: false
      };
    }
  }

  // Obtener IP local
  getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    return 'localhost';
  }

  // Mostrar información del sistema
  async displayStartupInfo(port) {
    console.log('\n🚀 INICIANDO SERVIDOR ANTONIOPCBUILDER');
    console.log('=========================================\n');
    
    // Verificar base de datos
    console.log('🔍 Verificando conexión a la base de datos...');
    const dbStatus = await this.checkDatabaseConnection();
    console.log(`   Base de Datos: ${dbStatus.status}`);
    console.log(`   Ping: ${dbStatus.ping || 'N/A'}`);
    console.log(`   Mensaje: ${dbStatus.message}\n`);
    
    // Información de red
    const localIP = this.getLocalIP();
    console.log('🌐 Información de red:');
    console.log(`   Local: http://localhost:${port}`);
    console.log(`   Red: http://${localIP}:${port}`);
    console.log(`   Puerto: ${port}\n`);
    
    // Información del entorno
    console.log('⚙️  Configuración:');
    console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Base de datos: PostgreSQL (Neon)`);
    console.log(`   Host BD: ${process.env.DATABASE_URL ? 'Neon Cloud' : 'No configurado'}\n`);
    
    return {
      dbStatus,
      localIP,
      port
    };
  }

  // Mostrar información cuando el servidor esté listo
  displayServerReady(info) {
    console.log('✅ SERVIDOR INICIADO CORRECTAMENTE');
    console.log('=========================================');
    console.log(`📍 URL Local: http://localhost:${info.port}`);
    console.log(`📍 URL Red: http://${info.localIP}:${info.port}`);
    console.log(`⏰ Iniciado: ${new Date().toLocaleString()}`);
    console.log('=========================================\n');
    
    // Resumen final
    console.log('📋 RESUMEN INICIAL:');
    console.log(`   Backend: ✅ ACTIVO`);
    console.log(`   Base de Datos: ${info.dbStatus.status}`);
    if (info.dbStatus.ping) {
      console.log(`   Tiempo respuesta BD: ${info.dbStatus.ping}`);
    }
    console.log('\n🎯 Endpoints disponibles:');
    console.log(`   GET  /health ✅`);
    console.log(`   POST /login ✅`); 
    console.log(`   POST /register ✅`);
    console.log(`   POST /googleLogin ✅`);
    console.log('=========================================\n');
  }
}

module.exports = new StartupMonitor();