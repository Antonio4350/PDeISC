//importamos el servidor de node
import { createServer } from 'node:http';

//declaramos una constante y le mandamos la funcion CreateServer
const serv = createServer((requerimiento, respuesta)=> {
    //definimos el tipo de archivo que va a leer
    respuesta.writeHead(200, {'Content-Type':'text/html' });
    //.end es la linea final y puede tener contenido 
    respuesta.end('<h1 style="color:green">Hola</h1>');

})

//escuchamos en el puesto 8081 y avisamos en la consola el puerto
serv.listen(8081, '127.0.0.1', () => {
    console.log('List 8081, 127.0.0.1');
});