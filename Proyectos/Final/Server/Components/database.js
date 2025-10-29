const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'antoniopcbuilder',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado a la base de datos MySQL');
    connection.release();
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
  }
}

testConnection();

module.exports = pool;