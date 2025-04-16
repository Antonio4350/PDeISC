import{ appendFile } from'./crearArchivo.js';//importamos los archivos
import { unlink } from './eliminarArchivo.js';//importamos los archivos
import { rename } from './cambiarNombreArchivo.js';//importamos los archivos
import { createServer } from 'node:http';//importamos los archivos

const serv = createServer((req, res)=> {
    //definimos el tipo de archivo que va a leer
    res.writeHead(200, {'Content-Type':'text/html' });
    res.write(appendFile());//llamamos las funciones
    res.write(rename());//llamamos las funciones
    res.write(unlink());//llamamos las funciones
    res.end();
})

serv.listen(8081, '127.0.0.1', () => {
    console.log('List 8081, 127.0.0.1');
});