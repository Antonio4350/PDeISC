//Imports
import bcrypt from 'bcrypt';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import multer from 'multer';
import path from 'path';
import { connectBD } from './conectbd.js';

const client = new OAuth2Client(["58585220959-fltgp46dkjjrcdo144gqeib2c5tqg58c.apps.googleusercontent.com", "04903815937-3lf0nukl1hg9t1pj3f819bjl9c5r5coi.apps.googleusercontent.com"]);

const app = express();
const port = 3031; //Puerto asignado
const uploadPath = path.join(process.cwd(), 'uploads');

if(!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

app.use(cors()); //Se utiliza Cors para que se puedan hacer llamados a la API desde el LocalHost
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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

const upload = multer({ storage });

//Funciones para la BD
async function getUsuario(mail, password)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;
        const sql = 'SELECT * FROM usuarios WHERE mail=?';
        const [result] = await db.execute(sql, [mail]);

        if(result.length != 0)
        {
            // Para usuarios de Google que no tienen password
            if (result[0].isGoogleUser) {
                return result;
            }
            
            const match = await bcrypt.compare(password, result[0].password);
            if(match) return result;
        }
        return result;
    } catch(error)
    {
        console.error(error);
        throw error;
    }
};

// Obtener TODOS los usuarios con documentos
async function getAllUsers()
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;
        const sql = 'SELECT nombre, mail, telefono, direccion, foto, documento1, documento2, isGoogleUser FROM usuarios';
        const [result] = await db.execute(sql);
        return result;
    } catch(error)
    {
        console.error(error);
        throw error;
    }
}

// Obtener datos de un usuario específico
async function getData(mail)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return;
        const sql = 'SELECT nombre, mail, telefono, direccion, foto, isGoogleUser FROM usuarios WHERE mail=?';
        const [result] = await db.execute(sql, [mail]);
        return result;
    } catch(error)
    {
        console.error(error);
        throw error;
    }
};

// Obtener documentos de un usuario
async function getDocuments(mail)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return null;
        const sql = 'SELECT documento1, documento2 FROM usuarios WHERE mail=?';
        const [result] = await db.execute(sql, [mail]);
        return result.length > 0 ? result[0] : null;
    } catch(error)
    {
        console.error('Error en getDocuments:', error);
        return null;
    }
};

// Guardar documentos de un usuario
async function saveDocuments(mail, documento1, documento2)
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return { success: false, message: 'Error de conexión a la base de datos' };

        // Verificar si el usuario existe
        const [userCheck] = await db.execute('SELECT * FROM usuarios WHERE mail=?', [mail]);
        if(userCheck.length === 0) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        // Guardar las imágenes en el servidor
        let doc1Path = '';
        let doc2Path = '';

        if (documento1 && documento1.startsWith('data:image')) {
            const base64Data = documento1.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            doc1Path = './uploads/' + Date.now() + '-doc1.jpg';
            fs.writeFileSync(doc1Path, imageBuffer);
            console.log(`Documento 1 guardado en: ${doc1Path}`);
        }

        if (documento2 && documento2.startsWith('data:image')) {
            const base64Data = documento2.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            doc2Path = './uploads/' + (Date.now() + 1) + '-doc2.jpg';
            fs.writeFileSync(doc2Path, imageBuffer);
            console.log(`Documento 2 guardado en: ${doc2Path}`);
        }

        // Actualizar la base de datos
        const sql = 'UPDATE usuarios SET documento1 = ?, documento2 = ? WHERE mail = ?';
        const [result] = await db.execute(sql, [doc1Path || null, doc2Path || null, mail]);
        
        console.log('Documentos actualizados:', result.affectedRows);
        
        if(result.affectedRows > 0) {
            return { success: true, message: 'Documentos guardados correctamente' };
        } else {
            return { success: false, message: 'No se pudieron guardar los documentos' };
        }
    } catch(error)
    {
        console.error('Error en saveDocuments:', error);
        return { success: false, message: 'Error interno del servidor' };
    }
};

//Permite insertar un nuevo usuario
async function insertInto(nombre, password, mail, telefono, direccion, foto, isGoogleUser = false) 
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 4;

        const [re2] = await db.execute("SELECT * FROM usuarios WHERE mail=?", [mail]);
        if(re2.length != 0) return 2;
        
        let hashedPassword = '';
        if (isGoogleUser) {
            // Para usuarios de Google, no hasheamos la contraseña o usamos una vacía
            hashedPassword = '';
        } else {
            // Validar que la contraseña no esté vacía para usuarios normales
            if (!password || password.trim() === '') {
                return 4;
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }
        
        const sql = 'INSERT INTO usuarios (nombre, password, mail, telefono, direccion, foto, isGoogleUser) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [nombre, hashedPassword, mail, telefono, direccion, foto, isGoogleUser]);
        console.log('Usuario insertado:', result.affectedRows);
        return 0;
    } catch(error)
    {
        console.error('Error en insertInto:', error);
        return 4;
    }
};

// Editar un usuario
async function editInto(nombre, password, mail, telefono, direccion, foto, oldmail, oldpassword, isGoogleUser) 
{
    let db;
    try
    {
        db = await connectBD();
        if(!db) return 5;

        // Para usuarios de Google
        if(isGoogleUser === 'true')
        {
            console.log('Editando usuario de Google...');
            
            // Verificar si el nuevo email ya existe (solo si se cambia el email)
            if (mail !== oldmail) {
                const [re2] = await db.execute("SELECT * FROM usuarios WHERE mail=? AND mail<>?", [mail, oldmail]);
                if(re2.length != 0) return 2;
            }
            
            // Actualizar sin verificar contraseña
            const sql = 'UPDATE usuarios SET nombre=?, mail=?, telefono=?, direccion=?, foto=? WHERE mail=?';
            const [result] = await db.execute(sql, [nombre, mail, telefono, direccion, foto, oldmail]);
            console.log('Usuario Google actualizado:', result.affectedRows);
            return result.affectedRows > 0 ? 0 : 1;
        }
        // Para usuarios normales
        else
        {
            console.log('Editando usuario normal...');
            
            // Verificar si el nuevo email ya existe
            if (mail !== oldmail) {
                const [re2] = await db.execute("SELECT * FROM usuarios WHERE mail=? AND mail<>?", [mail, oldmail]);
                if(re2.length != 0) return 2;
            }
            
            // Obtener usuario actual
            let sql = 'SELECT * FROM usuarios WHERE mail=?';
            let [result] = await db.execute(sql, [oldmail]);
            
            if(result.length === 0) {
                return 1; // Usuario no encontrado
            }
            
            console.log('Verificando contraseña antigua...');
            
            // Si se proporcionó contraseña antigua, verificarla
            if (oldpassword && oldpassword.trim() !== '') {
                const match = await bcrypt.compare(oldpassword, result[0].password);
                if(!match) return 3;
            } else {
                // Si no se proporcionó contraseña antigua pero el usuario tiene contraseña
                if (result[0].password && result[0].password.trim() !== '') {
                    console.log('Advertencia: No se proporcionó contraseña antigua para usuario con contraseña');
                }
            }
            
            // Manejar la nueva contraseña
            let hashedPassword = result[0].password; // Mantener la misma contraseña por defecto
            if (password && password.trim() !== '') {
                // Si se proporciona nueva contraseña, hashearla
                hashedPassword = await bcrypt.hash(password, 10);
                console.log('Contraseña actualizada');
            }
            
            // Actualizar usuario
            sql = 'UPDATE usuarios SET nombre=?, password=?, mail=?, telefono=?, direccion=?, foto=? WHERE mail=?';
            [result] = await db.execute(sql, [nombre, hashedPassword, mail, telefono, direccion, foto, oldmail]);
            console.log('Usuario actualizado:', result.affectedRows);
            return result.affectedRows > 0 ? 0 : 1;
        }
    } catch(error)
    {
        console.error('Error en editInto:', error);
        return 5;
    }
};

// Endpoint para guardar documentos
app.post('/saveDocuments', upload.none(), async function(req, res) {
    try {
        console.log('Body recibido en saveDocuments:', req.body);
        
        const { doc1, doc2, mail } = req.body;
        
        if (!mail) {
            return res.json({ success: false, message: 'Email del usuario no proporcionado' });
        }
        
        const result = await saveDocuments(mail, doc1, doc2);
        res.json(result);
    } catch(err) {
        console.error('Error en saveDocuments:', err);
        res.json({ success: false, message: 'Error interno del servidor' });
    }
});

// Google Login
app.post('/googleLogin', express.json(), async (req, res) => {
    const { idToken, accessToken } = req.body;
    try 
    {
        let email, name, picture;
  
        if(idToken) 
        {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: ["58585220959-fltgp46dkjjrcdo144gqeib2c5tqg58c.apps.googleusercontent.com", "04903815937-3lf0nukl1hg9t1pj3f819bjl9c5r5coi.apps.googleusercontent.com"],
            });
            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
        } 
        else if(accessToken) 
        {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const userInfo = await userInfoRes.json();
            email = userInfo.email;
            name = userInfo.name;
            picture = userInfo.picture;
        } 
        else 
        {
            return res.json({ success: false, message: 'Token faltante' });
        }
  
        const db = await connectBD();
        const [existing] = await db.execute('SELECT * FROM usuarios WHERE mail=?', [email]);
  
        let localImagePath = '';
  
        if(existing.length === 0) 
        {
            if(picture) 
            {
                const response = await fetch(picture);
                const buffer = await response.arrayBuffer();
                const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
                const imagePath = path.join(uploadPath, filename);
  
                fs.writeFileSync(imagePath, Buffer.from(buffer));
                console.log(`Imagen de Google guardada en ${imagePath}`);
  
                localImagePath = `./uploads/${filename}`;
            }
  
            const sql = 'INSERT INTO usuarios (nombre, password, mail, telefono, direccion, foto, isGoogleUser) VALUES (?, ?, ?, ?, ?, ?, ?)';
            await db.execute(sql, [name, '', email, '', '', localImagePath, true]);
            console.log(`Usuario Google creado: ${email}`);
        } 
        else 
        {
            console.log(`Usuario Google ya existe: ${email}`);
        }
        res.json({ success: true, mail: email });
    } 
    catch (error) 
    {
      console.error('Error en Google Login:', error);
      res.json({ success: false, error: error.message });
    }
});

// Editar usuario
app.post('/editUsuario', upload.single('image'), async function(req, res){
    try {
        console.log('Body recibido en editUsuario:', req.body);
        console.log('Archivo recibido:', req.file);

        const { nombre, password, mail, telefono, direccion, image, oldmail, oldpassword, isGoogleUser } = req.body;
        const google = isGoogleUser === 'true';
        
        let imag = '';
        if (image && image.startsWith('data:image')) {
            // Manejar imagen en base64
            const base64Data = image.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            imag = './uploads/' + Date.now() + '.jpg';
            fs.writeFileSync(imag, imageBuffer);
            console.log(`Image saved successfully to ${imag}`);
        } else if (req.file) {
            // Usar archivo subido
            imag = req.file.path;
        }

        console.log('Parámetros para editInto:');
        console.log('nombre:', nombre);
        console.log('mail:', mail);
        console.log('telefono:', telefono);
        console.log('direccion:', direccion);
        console.log('oldmail:', oldmail);
        console.log('isGoogleUser:', google);
        console.log('password provided:', !!password);
        console.log('oldpassword provided:', !!oldpassword);
        
        const result = await editInto(nombre, password, mail, telefono, direccion, imag, oldmail, oldpassword, google);
        console.log('Resultado de editInto:', result);
        res.json(result);
    } catch(err) {
        console.error('Error en editUsuario:', err);
        res.status(500).json(5);
    }
});

// Agregar usuario
app.post('/addUsuario', upload.single('image'), async function(req, res){
    try {
        console.log('Body recibido en addUsuario:', req.body);
        console.log('Archivo recibido:', req.file);

        const { nombre, password, mail, telefono, direccion, image, isGoogleUser } = req.body;
        const google = isGoogleUser === 'true';
        
        let imag = '';
        if (image && image.startsWith('data:image')) {
            // Manejar imagen en base64
            const base64Data = image.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            imag = './uploads/' + Date.now() + '.jpg';
            fs.writeFileSync(imag, imageBuffer);
            console.log(`Image saved successfully to ${imag}`);
        } else if (req.file) {
            // Usar archivo subido
            imag = req.file.path;
        }

        const result = await insertInto(nombre, password, mail, telefono, direccion, imag, google);
        console.log('Resultado de insertInto:', result);
        res.json(result);
    } catch(err) {
        console.error('Error en addUsuario:', err);
        res.status(500).json(4);
    }
});

// Obtener usuario (login)
app.post('/getUsuario', express.json(), async function(req, res){
    try {
        const { mail, password } = req.body;
        console.log('Login attempt for:', mail);
        
        const result = await getUsuario(mail, password);
        if(result && result.length > 0) {
            res.json(1);
        } else {
            res.json(0);
        }
    } catch(err) {
        console.error('Error en getUsuario:', err);
        res.status(500).json(0);
    }
});

// Obtener datos de usuario
app.post('/getData', express.json(), async function(req, res){
    try {
        const { mail } = req.body;
        const result = await getData(mail);
        res.json(result);
    } catch(err) {
        console.error('Error en getData:', err);
        res.status(500).json([]);
    }
});

// Obtener documentos de un usuario
app.post('/getDocuments', express.json(), async function(req, res){
    try {
        const { mail } = req.body;
        const result = await getDocuments(mail);
        res.json(result);
    } catch(err) {
        console.error('Error en getDocuments:', err);
        res.status(500).json(null);
    }
});

// Obtener TODOS los usuarios (para lista)
app.get('/getUsuarios', async (req, res) => {
    try {
        let usu = await getAllUsers();
        res.json(usu);
    } catch(err) {
        console.error('Error en getUsuarios:', err);
        res.status(500).json([]);
    }
});

// Ruta de salud para verificar que el servidor funciona
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

//Iniciando el servidor
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});