import { writeFile } from "./crearPagina.js";//importamos los archivos
import { readFile } from 'node:fs';//importamos readfile
import { createServer } from 'node:http';//importamos createserver

writeFile();

const serv = createServer((req, res) => {
    readFile('./pagina.html', 'utf8', (err, data) => {//leemos la pagina creada y la guardamos en data
        if (err) {//if por si nos da un error
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error al leer la pagina');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);//muestra la variable data que tiene la pagina
    });
});

serv.listen(8081, '127.0.0.1', () => {
    console.log('List 8081, 127.0.0.1');
});