//importamos el servidor de node
import { createServer } from 'node:http';
import { suma, resta, multiplica, divide} from'./calculos.js';

//declaramos una constante y le mandamos la funcion CreateServer
const serv = createServer((req, res)=> {
    //definimos el tipo de archivo que va a leer
    res.writeHead(200, {'Content-Type':'text/html' });
    res.write("<style>table {width: 50%;border-collapse: collapse; }th, td {border: 1px solid black; padding: 8px; text-align: left; }th {background-color: #f2f2f2;}</style> ")//coloco el style de la pagina
    res.write("<table><thead><tr><th>Operacion</th><th>Respuesta</th></tr></thead><tbody><tr><td>suma(5,3)</td><td>"+ suma(5,3)+"</td></tr><tr><td>resta(8-6)</td><td>"+resta(8,6) +"</td></tr><tr><td>multiplicacion(3*11)</td><td>"+multiplica(3,11) +"</td></tr><tr><td>divide(30/5)</td><td>"+divide(30,5) +"</td></tr></tbody></table>")//coloco la tabla con sus

})

//escuchamos en el puesto 8081 y avisamos en la consola el puerto
serv.listen(8081, '127.0.0.1', () => {
    console.log('List 8081, 127.0.0.1');
});