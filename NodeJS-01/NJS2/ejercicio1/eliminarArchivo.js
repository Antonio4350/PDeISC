import { unlink as fsUnlink } from 'node:fs';//importamos unlink

export function unlink() {
    fsUnlink('myrenamedfile.txt', function (err) {//elimina el archivo con ese nombre
        if (err) throw err;
        console.log('File deleted!');//muestra en consola que fue eliminado
    });
    return 'Archivo eliminado<br>';
}