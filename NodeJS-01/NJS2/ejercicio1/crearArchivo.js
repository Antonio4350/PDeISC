import{appendFile as fsAppendFile } from 'node:fs';//importamos appenfile

export function appendFile() {
    fsAppendFile('mynewfile2.txt', 'Hello content!', function (err) {//Creamos el archivo y le ponemos un contenido
        if (err) throw err;
        console.log('Saved!');//mostramos en consola que se guardo
    });
    return 'Archivo creado<br>';
}
