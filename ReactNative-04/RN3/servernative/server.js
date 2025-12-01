//Imports
import bcrypt from 'bcrypt';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import multer from 'multer';
import path from 'path';
import { connectBD } from './conectbd.js';

const client = new OAuth2Client("58585220959-4oh9bhvaf728t0p1cfkgn2ueta80uvvp.apps.googleusercontent.com");

const app = express();
const port = 3031; //Puerto asignado
const uploadPath = path.join(process.cwd(), 'uploads');

if(!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

app.use(cors()); //Se utiliza Cors para que se puedan hacer llamados a la API desde el LocalHost
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage, limits: {
    fieldSize: 25 * 1024 * 1024, // 25 MB máximo por campo
  }, });

// ================== FUNCIONES DE BASE DE DATOS ==================

//Funciones para la BD
async function getUsuario(mail, password, isGoogleUser)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;
        const sql = 'SELECT * FROM usuarios WHERE email=?';
        const [result] = await db.execute(sql, [mail]);

        if(result.length != 0 && !isGoogleUser)
        {
            const match = await bcrypt.compare(password, result[0].password);
            db.end();
            if(match) return result;
        }
        db.end();
        return result;
    } catch(error)
    {
        console.error(error);
    }
};

async function getAllJugadoresEquipo(id_equipo)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;
        const sql = 'SELECT id, nombre, apellido, posicion, imagen, goles FROM jugadores WHERE equipo=?';
        const [result] = await db.execute(sql, [id_equipo]);
        db.end();
        return result;
    } catch(error)
    {
        console.error(error);
    }
}

async function getAllJugadores()
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;
        const sql = 'SELECT id, nombre, apellido, posicion, equipo, imagen, goles FROM jugadores ORDER BY goles DESC';
        const [result] = await db.execute(sql);
        db.end();
        return result;
    } catch(error)
    {
        console.error(error);
    }
}

async function getAllDirectores()
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;
        const sql = 'SELECT id, nombre, apellido, victorias, imagen FROM directores';
        const [result] = await db.execute(sql);
        db.end();
        return result;
    } catch(error)
    {
        console.error(error);
    }
}

async function getAllPartidos()
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;
        const sql = 'SELECT id, equipo1, equipo2, goles1, goles2, terminado, fecha FROM partidos ORDER BY fecha ASC';
        const [result] = await db.execute(sql);
        db.end();
        return result;
    } catch(error)
    {
        console.error(error);
    }
}

async function getAllEquipos()
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;
        const sql = 'SELECT id, nombre, director, escudo, goles, victorias FROM equipos';
        const [result] = await db.execute(sql);
        db.end();
        return result;
    } catch(error)
    {
        console.error(error);
    }
}

async function addUsuario(email, password, isGoogleUser)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;

        let sql = 'SELECT * FROM usuarios WHERE email=?';
        let [r] = await db.execute(sql, [email]);
        if(r.length != 0)
        {
            db.end();
            return 1;
        } 

        if(isGoogleUser)
        {
            sql = 'INSERT INTO usuarios (email, isGoogleUser) VALUES (?,?)'
            await db.execute(sql, [email, isGoogleUser]);
        }
        else
        {
            const hashedPassword = await bcrypt.hash(password, 10);
            sql = 'INSERT INTO usuarios (email, password, isGoogleUser) VALUES (?,?,?)'
            await db.execute(sql, [email, hashedPassword, isGoogleUser]);
        }
        db.end();
        return 0;
    } catch(error)
    {
        console.error(error);
    }
}

async function addJugador(email, imagen, nombre, apellido, posicion, equipo)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;

        let sql = 'INSERT INTO jugadores (nombre, apellido, posicion, imagen, goles, equipo) VALUES (?,?,?,?,?,?)'
        const [result] = await db.execute(sql, [nombre, apellido, posicion, imagen, 0, Number(equipo)]);
        let id = result.insertId;

        sql = 'UPDATE usuarios SET tipo=?, id_tabla=? WHERE email=?'
        await db.execute(sql, [1, id, email]);
        db.end();
        return 0;
    } catch(error)
    {
        console.error(error);
    }
}

async function addDirector(email, imagen, nombre, apellido)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;

        let sql = 'INSERT INTO directores (nombre, apellido, victorias, imagen) VALUES (?,?,?,?)'
        const [result] = await db.execute(sql, [nombre, apellido, 0, imagen]);
        let id = result.insertId;

        sql = 'UPDATE usuarios SET tipo=?, id_tabla=? WHERE email=?'
        await db.execute(sql, [2, id, email]);

        db.end();
        return 0;
    } catch(error)
    {
        console.error(error);
    }
}

async function addPartido(equipo1, equipo2, fecha, goles1 = 0, goles2 = 0, terminado = 0)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;

        // Validar que no sean el mismo equipo
        if (equipo1 === equipo2) {
            db.end();
            return 2; // Código para equipos iguales
        }

        let sql = 'INSERT INTO partidos (equipo1, equipo2, fecha, goles1, goles2, terminado) VALUES (?,?,?,?,?,?)'
        await db.execute(sql, [equipo1, equipo2, fecha, goles1, goles2, terminado]);

        db.end();
        return 0;
    } catch(error)
    {
        console.error(error);
        return 1;
    }
}

async function editJugador(mail, password, oldmail, oldpassword, image, isGoogleUser, nombre, apellido, posicion)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        if(!isGoogleUser)
        {
            const [re2] = await db.execute("SELECT * FROM usuarios WHERE email=? AND email<>?", [mail, oldmail]);
            if(re2.length != 0)
            { 
                db.end();
                return 2;
            }
            let sql = 'SELECT * FROM usuarios WHERE email=?';
            const [result] = await db.execute(sql, [oldmail]);
            if(result.length != 0)
            {
                console.log(oldpassword, result[0].password)
                const match = await bcrypt.compare(oldpassword, result[0].password);
                console.log(match);
                if(!match) 
                {
                   // db.end();
                    return 3;
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            sql = 'UPDATE usuarios SET email=?, password=? WHERE email=?';
            await db.execute(sql, [mail, hashedPassword, oldmail]);
            let [id] = await db.execute("SELECT id_tabla FROM usuarios WHERE email=?", [mail]);
            
            sql = 'UPDATE jugadores SET nombre=?, apellido=?, posicion=?, imagen=? WHERE id=?';
            await db.execute(sql, [nombre, apellido, posicion, image, id[0].id_tabla]);

            db.end();
            return 0;
        }
        else
        {
            let [id] = await db.execute("SELECT id_tabla FROM usuarios WHERE email=?", [oldmail]);
            
            let sql = 'UPDATE jugadores SET nombre=?, apellido=?, posicion=?, imagen=? WHERE id=?';
            await db.execute(sql, [nombre, apellido, posicion, image, id[0].id_tabla]);

            db.end();
            return 0;
        }
    }catch(error)
    {
        console.error(error);
    }
}

async function editDirector(mail, password, oldmail, oldpassword, image, isGoogleUser, nombre, apellido)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        if(!isGoogleUser)
        {
            const [re2] = await db.execute("SELECT * FROM usuarios WHERE email=? AND email<>?", [mail, oldmail]);
            if(re2.length != 0) 
            {
                db.end();
                return 2;
            }
            let sql = 'SELECT * FROM usuarios WHERE email=?';
            const [result] = await db.execute(sql, [oldmail]);
            if(result.length != 0)
            {
                console.log(oldpassword, result[0].password)
                const match = await bcrypt.compare(oldpassword, result[0].password);
                console.log('pe');
                console.log(match);
                if(!match) 
                {
                    //db.end();
                    return 3;
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            sql = 'UPDATE usuarios SET email=?, password=? WHERE email=?';
            await db.execute(sql, [mail, hashedPassword, oldmail]);
            let [id] = await db.execute("SELECT id_tabla FROM usuarios WHERE email=?", [mail]);
            
            sql = 'UPDATE directores SET nombre=?, apellido=?, imagen=? WHERE id=?';
            await db.execute(sql, [nombre, apellido, image, id[0].id_tabla]);

            db.end();
            return 0;
        }
        else
        {
            let [id] = await db.execute("SELECT id_tabla FROM usuarios WHERE email=?", [oldmail]);
            
            let sql = 'UPDATE directores SET nombre=?, apellido=?, imagen=? WHERE id=?';
            await db.execute(sql, [nombre, apellido, image, id[0]]);

            db.end();
            return 0;
        }
    }catch(error)
    {
        console.error(error);
    }
}

async function editEquipo(nombre, director_id, escudo)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;
            
        let sql = 'UPDATE equipos SET nombre=?, escudo=? WHERE director=?';
        let [result] = await db.execute(sql, [nombre, escudo, director_id]);

        db.end();
        if(result.affectedRows == 0) return 1;
        else return 0;
    }catch(error)
    {
        console.error(error);
    }
}
async function editUsuario(mail, password, oldmail, oldpassword, isGoogleUser, nombre, apellido)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        if(!isGoogleUser)
        {
            const [re2] = await db.execute("SELECT * FROM usuarios WHERE email=? AND email<>?", [mail, oldmail]);
            if(re2.length != 0)
            { 
                db.end();
                return 2;
            }
            let sql = 'SELECT * FROM usuarios WHERE email=?';
            const [result] = await db.execute(sql, [oldmail]);
            if(result.length != 0)
            {
                console.log(oldpassword, result[0].password)
                const match = await bcrypt.compare(oldpassword, result[0].password);
                console.log(match);
                if(!match) 
                {
                   // db.end();
                    return 3;
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            sql = 'UPDATE usuarios SET email=?, password=?, nombre=?, apellido=? WHERE email=?';
            await db.execute(sql, [mail, hashedPassword, nombre, apellido, oldmail]);

            db.end();
            return 0;
        }
        else
        {
            let sql = 'UPDATE usuarios SET nombre=?, apellido=? WHERE email=?';
            await db.execute(sql, [nombre, apellido, oldmail]);

            db.end();
            return 0;
        }
    }catch(error)
    {
        console.error(error);
    }
}

async function getUsuarioCompleto(email) {
    let db;
    try {
        db = await connectBD();
        if(!db) return 5;

        let sql = 'SELECT id, email, nombre, apellido, tipo, id_tabla FROM usuarios WHERE email=?';
        const [result] = await db.execute(sql, [email]);
        
        db.end();
        return result;
    } catch(error) {
        console.error(error);
    }
}
async function addVictory(id)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        let [victorias] = await db.execute("SELECT victorias FROM directores WHERE id=?", [id]);
        let [result] = await db.execute("UPDATE directores SET victorias=? WHERE id=?", [victorias[0].victorias+1, id]);
        db.end();
        return result;
    }catch(error)
    {
        console.error(error);
    }
}

async function addGol(id)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        let [golesjug] = await db.execute("SELECT goles, equipo FROM jugadores WHERE id=?", [id]);
        let [result] = await db.execute("UPDATE jugadores SET goles=? WHERE id=?", [golesjug[0].goles+1, id]);
        
        let [goleseq] =  await db.execute("SELECT goles FROM equipos WHERE id=?", [golesjug[0].equipo]);
        let [result2] = await db.execute("UPDATE equipos SET goles=? WHERE id=?", [goleseq[0].goles+1, golesjug[0].equipo]);

        db.end();
        return result;
    }catch(error)
    {
        console.error(error);
    }
}

async function getUsuIDTabla(email)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        let [id] = await db.execute("SELECT id_tabla FROM usuarios WHERE email=?", [email]);
        db.end();
        return id[0].id_tabla;
    }catch(error)
    {
        console.error(error);
    }
}

async function getUsuData(email)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        let [result] = await db.execute("SELECT tipo, id_tabla, nombre, apellido FROM usuarios WHERE email=?", [email]);
        let tipo = result[0].tipo;
        let id_tabla = result[0].id_tabla;
        if(tipo == 1) return await db.execute("SELECT nombre, apellido, posicion, equipo, imagen, goles FROM jugadores WHERE id=?", [id_tabla]);
        else if(tipo == 2) return await db.execute("SELECT nombre, apellido, victorias, imagen FROM directores WHERE id=?", [id_tabla]);
        else return [[{ nombre: result[0].nombre, apellido: result[0].apellido }]]; // Para espectadores
    }catch(error)
    {
        console.error(error);
    }
}

async function getUsuarioData(email)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        let [result] = await db.execute("SELECT id, tipo, id_tabla FROM usuarios WHERE email=?", [email]);
        db.end();
        return result;
    }catch(error)
    {
        console.error(error);
    }
}

async function getDirector(id)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        let [result] = await db.execute("SELECT nombre, apellido, imagen, victorias FROM directores WHERE id=?", [id]);
        db.end();
        return result;
    }catch(error)
    {
        console.error(error);
    }
}

async function getJugador(id)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        let [result] = await db.execute("SELECT nombre, apellido, goles, equipo, imagen, posicion FROM jugadores WHERE id=?", [id]);
        db.end();
        return result;
    }catch(error)
    {
        console.error(error);
    }
}

async function getEquipo(id)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        let [result] = await db.execute("SELECT nombre, escudo, goles, victorias, director FROM equipos WHERE id=?", [id]);
        db.end();
        return result;
    }catch(error)
    {
        console.error(error);
    }
}

async function cambiarEquipo(id_jugador, id_equipo)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        let [result] = await db.execute("UPDATE jugadores SET equipo=? WHERE id=?", [id_equipo, id_jugador]);
        db.end();
        return 0;
    }catch(error)
    {
        console.error(error);
    }
}

async function makeAdmin(email) {
    let db;
    try {
        db = await connectBD();
        if(!db) return;
        
        let sql = 'UPDATE usuarios SET es_administrador=TRUE, tipo=3 WHERE email=?';
        await db.execute(sql, [email]);
        
        db.end();
        return 0;
    } catch(error) {
        console.error(error);
        return 1;
    }
}

async function removeAdmin(email) {
    let db;
    try {
        db = await connectBD();
        if(!db) return;
        
        let sql = 'UPDATE usuarios SET es_administrador=FALSE, tipo=0 WHERE email=?';
        await db.execute(sql, [email]);
        
        db.end();
        return 0;
    } catch(error) {
        console.error(error);
        return 1;
    }
}

async function getAdmins() {
    let db;
    try {
        db = await connectBD();
        if(!db) return;
        
        let sql = 'SELECT id, email, tipo FROM usuarios WHERE es_administrador=TRUE';
        const [result] = await db.execute(sql);
        
        db.end();
        return result;
    } catch(error) {
        console.error(error);
    }
}

async function isAdmin(email) {
    let db;
    try {
        db = await connectBD();
        if(!db) return false;
        
        let sql = 'SELECT es_administrador FROM usuarios WHERE email=?';
        const [result] = await db.execute(sql, [email]);
        
        db.end();
        return result.length > 0 && result[0].es_administrador === 1;
    } catch(error) {
        console.error(error);
        return false;
    }
}

async function deletePartido(id) {
    let db;
    try {
        db = await connectBD();
        if(!db) {
            console.log('❌ No se pudo conectar a la BD');
            return 1;
        }
        
        console.log('🗑️ Conectado a BD - Intentando eliminar partido ID:', id);
        
        // Verificar si el partido existe
        const [checkResult] = await db.execute('SELECT id FROM partidos WHERE id = ?', [id]);
        if (checkResult.length === 0) {
            console.log('❌ Partido no encontrado en BD');
            db.end();
            return 1;
        }
        
        console.log('✅ Partido encontrado, procediendo a eliminar...');
        
        // Eliminar el partido
        const sql = 'DELETE FROM partidos WHERE id = ?';
        const [result] = await db.execute(sql, [id]);
        
        console.log('✅ Eliminación completada - Filas afectadas:', result.affectedRows);
        
        db.end();
        
        if (result.affectedRows > 0) {
            console.log('🎉 Partido eliminado exitosamente');
            return 0; // Éxito
        } else {
            console.log('❌ No se eliminó ningún partido');
            return 1; // Error
        }
        
    } catch(error) {
        console.error('💥 ERROR en deletePartido:', error);
        console.error('💥 Código de error:', error.code);
        console.error('💥 Número de error:', error.errno);
        console.error('💥 Mensaje:', error.message);
        
        if (db) db.end();
        return 1;
    }
}

async function updatePartido(id, equipo1, equipo2, goles1, goles2, terminado, fecha) {
    let db;
    try {
        db = await connectBD();
        if(!db) return;
        
        // Validar que no sean el mismo equipo
        if (equipo1 === equipo2) {
            return 2; // Código para equipos iguales
        }
        
        let sql = 'UPDATE partidos SET equipo1=?, equipo2=?, goles1=?, goles2=?, terminado=?, fecha=? WHERE id=?';
        await db.execute(sql, [equipo1, equipo2, goles1, goles2, terminado, fecha, id]);
        
        db.end();
        return 0;
    } catch(error) {
        console.error(error);
        return 1;
    }
}

async function getPartido(id) {
    let db;
    try {
        db = await connectBD();
        if(!db) return;
        
        let sql = 'SELECT * FROM partidos WHERE id=?';
        const [result] = await db.execute(sql, [id]);
        
        db.end();
        return result;
    } catch(error) {
        console.error(error);
    }
}

async function deleteJugador(id) {
    let db;
    try {
        db = await connectBD();
        if(!db) return;
        
        // Primero actualizar usuarios que referencian este jugador
        let sql = 'UPDATE usuarios SET tipo=0, id_tabla=NULL WHERE id_tabla=? AND tipo=1';
        await db.execute(sql, [id]);
        
        // Luego eliminar el jugador
        sql = 'DELETE FROM jugadores WHERE id=?';
        await db.execute(sql, [id]);
        
        db.end();
        return 0;
    } catch(error) {
        console.error(error);
        return 1;
    }
}

async function deleteDirector(id) {
    let db;
    try {
        db = await connectBD();
        if(!db) return;
        
        // Primero eliminar equipos del director
        let sql = 'DELETE FROM equipos WHERE director=?';
        await db.execute(sql, [id]);
        
        // Actualizar usuarios que referencian este director
        sql = 'UPDATE usuarios SET tipo=0, id_tabla=NULL WHERE id_tabla=? AND tipo=2';
        await db.execute(sql, [id]);
        
        // Luego eliminar el director
        sql = 'DELETE FROM directores WHERE id=?';
        await db.execute(sql, [id]);
        
        db.end();
        return 0;
    } catch(error) {
        console.error(error);
        return 1;
    }
}

async function deleteEquipo(id) {
    let db;
    try {
        db = await connectBD();
        if(!db) return;
        
        // Primero quitar jugadores del equipo
        let sql = 'UPDATE jugadores SET equipo=NULL WHERE equipo=?';
        await db.execute(sql, [id]);
        
        // Luego eliminar el equipo
        sql = 'DELETE FROM equipos WHERE id=?';
        await db.execute(sql, [id]);
        
        db.end();
        return 0;
    } catch(error) {
        console.error(error);
        return 1;
    }
}

async function deleteUsuario(email) {
    let db;
    try {
        db = await connectBD();
        if(!db) return;
        
        let sql = 'DELETE FROM usuarios WHERE email=?';
        await db.execute(sql, [email]);
        
        db.end();
        return 0;
    } catch(error) {
        console.error(error);
        return 1;
    }
}

async function equipoExiste(nombre) {
    let db;
    try {
        db = await connectBD();
        if(!db) return false;
        
        let sql = 'SELECT id FROM equipos WHERE nombre = ?';
        const [result] = await db.execute(sql, [nombre]);
        
        db.end();
        return result.length > 0;
    } catch(error) {
        console.error(error);
        return false;
    }
}

// Función addEquipo con validación (ÚNICA DEFINICIÓN)
async function addEquipo(nombre, director_id, escudo) {
    let db;
    try {
        db = await connectBD();
        if(!db) return;

        // Verificar si el equipo ya existe
        const existe = await equipoExiste(nombre);
        if (existe) {
            db.end();
            return 2; // Código para equipo existente
        }

        let sql = 'INSERT INTO equipos (nombre, director, escudo) VALUES (?,?,?)';
        console.log(nombre + ',' + director_id + ',' + escudo);
        await db.execute(sql, [nombre, director_id, escudo]);

        db.end();
        return 0;
    } catch(error) {
        console.error(error);
        return 1;
    }
}

// Función para actualizar partidos expirados automáticamente
async function actualizarPartidosExpirados() {
    let db;
    try {
        db = await connectBD();
        if(!db) return;
        
        const ahora = new Date().toISOString().split('T')[0];
        const sql = 'UPDATE partidos SET terminado=1 WHERE fecha < ? AND terminado=0';
        await db.execute(sql, [ahora]);
        
        db.end();
    } catch(error) {
        console.error('Error actualizando partidos expirados:', error);
    }
}

// ================== ENDPOINTS ==================

app.post('/debug-delete', express.json(), async (req, res) => {
    console.log('🔔 DEBUG ENDPOINT LLAMADO!');
    console.log('📦 Body recibido:', req.body);
    console.log('📦 Headers:', req.headers);
    
    res.json({ 
        success: true, 
        message: 'Debug endpoint funcionando',
        timestamp: new Date().toISOString()
    });
});

app.post('/loginGoogle', async (req, res) => {
    const { email, name, googleId, photo, isGoogleUser } = req.body;
    
    try {
        // Verificar si el usuario ya existe
        const userExists = await checkUserExists(email);
        
        if (userExists) {
            // Usuario existe, iniciar sesión
            res.json({ success: true, message: 'Login exitoso' });
        } else {
            // Crear nuevo usuario
            const newUser = await createUser({
                email,
                name, 
                googleId,
                photo,
                isGoogleUser: true
            });
            res.json({ success: true, message: 'Usuario creado exitosamente' });
        }
    } catch (error) {
        console.error('Error en login Google:', error);
        res.json({ success: false, message: 'Error en el servidor' });
    }
});

// Endpoints Administrador
app.post('/makeAdmin', express.json(), async function(req,res){
    const { email } = req.body;
    
    await makeAdmin(email)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/removeAdmin', express.json(), async function(req,res){
    const { email } = req.body;
    
    await removeAdmin(email)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.get('/getAdmins', async (req, res) => {
    let admins = await getAdmins();
    res.json(admins);
});

app.post('/isAdmin', express.json(), async function(req,res){
    const { email } = req.body;
    
    await isAdmin(email)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

// Endpoints Partidos
app.post('/updatePartido', express.json(), async function(req,res){
    const { id, equipo1, equipo2, goles1, goles2, terminado, fecha } = req.body;
    
    await updatePartido(id, equipo1, equipo2, goles1, goles2, terminado, fecha)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/deletePartido', express.json(), async function(req, res){
    const { id } = req.body;
    
    console.log('🎯 ENDPOINT deletePartido llamado - ID recibido:', id);
    console.log('🎯 Body completo:', req.body);
    
    if (!id) {
        console.log('❌ Error: ID no proporcionado');
        return res.status(400).json({ 
            success: false, 
            message: 'ID de partido no proporcionado' 
        });
    }
    
    try {
        console.log('🚀 Ejecutando deletePartido...');
        const result = await deletePartido(id);
        console.log('✅ Resultado de deletePartido:', result);
        
        if (result === 0) {
            res.json({ 
                success: true, 
                message: 'Partido eliminado correctamente',
                code: result 
            });
        } else {
            res.json({ 
                success: false, 
                message: 'No se pudo eliminar el partido',
                code: result 
            });
        }
    } catch (error) {
        console.error('💥 ERROR en endpoint deletePartido:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error del servidor al eliminar partido',
            error: error.message 
        });
    }
});

app.post('/getPartido', express.json(), async function(req,res){
    const { id } = req.body;
    
    await getPartido(id)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

// Endpoints Eliminación
app.post('/deleteJugador', express.json(), async function(req,res){
    const { id } = req.body;
    
    await deleteJugador(id)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/deleteDirector', express.json(), async function(req,res){
    const { id } = req.body;
    
    await deleteDirector(id)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/deleteEquipo', express.json(), async function(req,res){
    const { id } = req.body;
    
    await deleteEquipo(id)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/deleteUsuario', express.json(), async function(req,res){
    const { email } = req.body;
    
    await deleteUsuario(email)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});
  
app.post('/editJugador', upload.none(), async function(req,res){
    const { email, password, oldmail, oldpassword, image, isGoogleUser, nombre, apellido, posicion } = req.body; //Valores del usuario
    
    const google = isGoogleUser == 'true';

    const base64Data = image.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    let imag = './uploads/' + Date.now() + '.jpg';
    fs.writeFile(imag, imageBuffer, (err) => {
        if (err) {
            console.error('Error saving image:', err);
        } else {
            console.log(`Image saved successfully to ${imag}`);
        }
    });
    imag = imag.replace('./', '/');

    await editJugador(email, password, oldmail, oldpassword, imag, google, nombre, apellido, posicion)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/editDirector', upload.none(), async function(req,res){
    const { email, password, oldmail, oldpassword, image, isGoogleUser, nombre, apellido } = req.body; //Valores del usuario
    
    const google = isGoogleUser == 'true';

    const base64Data = image.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    let imag = './uploads/' + Date.now() + '.jpg';
    fs.writeFile(imag, imageBuffer, (err) => {
        if (err) {
            console.error('Error saving image:', err);
        } else {
            console.log(`Image saved successfully to ${imag}`);
        }
    });
    imag = imag.replace('./', '/');

    await editDirector(email, password, oldmail, oldpassword, imag, google, nombre, apellido)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/editEquipo', upload.none(), async function(req,res){
    const { email, nombre, escudo } = req.body; //Valores del usuario
    
    const base64Data = escudo.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    let imag = './uploads/' + Date.now() + '.jpg';
    fs.writeFile(imag, imageBuffer, (err) => {
        if (err) {
            console.error('Error saving image:', err);
        } else {
            console.log(`Image saved successfully to ${imag}`);
        }
    });
    imag = imag.replace('./', '/');

    let id = await getUsuIDTabla(email);

    await editEquipo(nombre, id, imag)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/editUsuario', upload.none(), async function(req,res){
    const { email, password, oldmail, oldpassword, isGoogleUser, nombre, apellido } = req.body;
    
    const google = isGoogleUser == 'true';

    await editUsuario(email, password, oldmail, oldpassword, google, nombre, apellido)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/getUsuario', express.json(), async function(req,res){
    const { email } = req.body; 

    await getUsuarioCompleto(email)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/addUsuario', express.json(), async function(req,res){
    const { email, password, isGoogleUser } = req.body; //Valores del usuario

    const google = isGoogleUser == 'true';
    
    await addUsuario(email, password, google)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

//Metodos para que el usuario pueda interactuar con la base de datos
app.post('/addJugador', upload.none(), async function(req,res){
    const { email, image, nombre, apellido, posicion, equipo } = req.body; //Valores del usuario

    const base64Data = image.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    let imag = './uploads/' + Date.now() + '.jpg';
    fs.writeFile(imag, imageBuffer, (err) => {
        if (err) {
            console.error('Error saving image:', err);
        } else {
            console.log(`Image saved successfully to ${imag}`);
        }
    });
    imag = imag.replace('./', '/');
    
    await addJugador(email, imag, nombre, apellido, posicion, equipo)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/addDirector', upload.none(), async function(req,res){
    const { email, image, nombre, apellido } = req.body; //Valores del usuario
    
    const base64Data = image.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    let imag = './uploads/' + Date.now() + '.jpg';
    fs.writeFile(imag, imageBuffer, (err) => {
        if (err) {
            console.error('Error saving image:', err);
        } else {
            console.log(`Image saved successfully to ${imag}`);
        }
    });
    imag = imag.replace('./', '/');

    await addDirector(email, imag, nombre, apellido)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/addEquipo', upload.none(), async function(req,res){
    const { email, nombre, escudo } = req.body; //Valores del usuario
    
    const base64Data = escudo.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    let imag = './uploads/' + Date.now() + '.jpg';
    fs.writeFile(imag, imageBuffer, (err) => {
        if (err) {
            console.error('Error saving image:', err);
        } else {
            console.log(`Image saved successfully to ${imag}`);
        }
    });
    imag = imag.replace('./', '/');

    let id = await getUsuIDTabla(email);

    await addEquipo(nombre, id, imag)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/addPartido', express.json(), async function(req,res){
    const { equipo1, equipo2, fecha, goles1, goles2, terminado } = req.body;
    
    await addPartido(equipo1, equipo2, fecha, goles1, goles2, terminado)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/addVictory', express.json(), async function(req,res){
    const { email } = req.body; 

    let id = await getUsuIDTabla(email);

    await addVictory(id)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/addGol', express.json(), async function(req,res){
    const { id } = req.body; 

    await addGol(id)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/cambiarEquipo', express.json(), async function(req,res){
    const { email, id_equipo } = req.body; 
    
    let id = await getUsuIDTabla(email);

    await cambiarEquipo(id, id_equipo)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/getJugadoresEquipo', express.json(), async function(req,res){
    const { id_equipo } = req.body; 

    await getAllJugadoresEquipo(id_equipo)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/login', express.json(), async function(req,res){
    const { email, password, isGoogleUser } = req.body; 
    const google = isGoogleUser == 'true';
    await getUsuario(email, password, google)
    .then(async result => {
        console.log(result.length)
        res.json(result.length > 0);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/getData', express.json(), async function(req,res){
    const { email } = req.body; 

    await getUsuData(email)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/getUsuarioData', express.json(), async function(req,res){
    const { email } = req.body; 

    await getUsuarioData(email)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/getDirector', express.json(), async function(req,res){
    const { id } = req.body; 

    await getDirector(id)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/getJugador', express.json(), async function(req,res){
    const { id } = req.body; 

    await getJugador(id)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/getEquipo', express.json(), async function(req,res){
    const { id } = req.body; 

    await getEquipo(id)
    .then(async result => {
        res.json(result);
    })
    .catch(err => res.status(500).send(err));
});

app.get('/getJugadores', async (req, res) => {
    let usu = await getAllJugadores();
    res.json(usu);
});

app.get('/getDirectores', async (req, res) => {
    let usu = await getAllDirectores();
    res.json(usu);
});

app.get('/getPartidos', async (req, res) => {
    // Actualizar partidos expirados antes de devolver
    await actualizarPartidosExpirados();
    let usu = await getAllPartidos();
    res.json(usu);
});

app.get('/getEquipos', async (req, res) => {
    let usu = await getAllEquipos();
    res.json(usu);
});

//Iniciando el servidor
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});