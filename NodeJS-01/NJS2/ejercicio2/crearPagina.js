import{writeFile as fswriteFile } from 'node:fs';//importamos writefile

export function writeFile() {
    const pag = fswriteFile('./pagina.html', '<!DOCTYPE html><head><meta charset="UTF-8"><title>Document</title></head><body<h1>Hola Mundo</h1></body></html>', function (err) {// creamos la pagina sobreescrita
        if (err) throw err;
        console.log('Saved!');
    });
    return 'Pagina creada<br>';
}
