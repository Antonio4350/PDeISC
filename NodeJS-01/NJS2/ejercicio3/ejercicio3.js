import { createServer } from 'node:http';//importamos createserver

var url = require('url');
var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);


var qdata = q.query;
console.log(qdata.month);

const serv = createServer((req, res)=> {
    //definimos el tipo de archivo que va a leer
    res.writeHead(200, {'Content-Type':'text/html' });
    res.write();//llamamos las funciones
    res.end();
})

serv.listen(8081, '127.0.0.1', () => {
    console.log('List 8081, 127.0.0.1');
});