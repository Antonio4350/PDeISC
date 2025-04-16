import { rename as fsRename } from 'node:fs';//importamos rename

export function rename() {
    fsRename('mynewfile2.txt', 'myrenamedfile.txt', function (err) {//cambiamos nombre del archivo
        if (err) throw err;
        console.log('File Renamed!');//mostramos el cambio por consola
    });
    return 'Archivo renombrado<br>';//devolveemos archivo renombrado
}