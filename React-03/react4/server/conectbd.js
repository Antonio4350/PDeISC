import mysql from 'mysql2/promise';
export async function connectDB(){
    try{
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'react4bd'
        });
        console.log('conexion establecida');
        return connection;
    }
    catch(err){
        console.log('Error de conexion:', err);
        throw err;  
    }
}