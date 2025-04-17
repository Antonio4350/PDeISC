import { createServer } from 'node:http';//importamos createserver y el resto de modulos
import { muestrohost } from './host.js';
import { muestrasearch } from './search.js';
import { muestropath } from './path.js';

const serv = createServer(async(req, res)=> {
    //definimos el tipo de archivo que va a leer
    res.writeHead(200, {'Content-Type':'text/html' });
    res.write('<h1>host: '+ muestrohost(req.url)+'</h1>');//llamamos las funciones pero me dan undefinidas, null y vacio
    res.write('<h1>search: '+ muestrasearch(req.url)+'</h1>');
    res.write('<h1>path: '+ muestropath(req.url)+'</h1>');
    res.end();

})

serv.listen(8081, '127.0.0.1', () => {
    console.log('List 8081, 127.0.0.1');//mmuestro en .log la url
});