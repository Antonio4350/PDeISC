import{parse} from'node:url';//importo el parse

export function muestropath(url){//creo la funcion
    let q =parse(url, true);//creo let con el parse
    return q.pathname;//muestro pathname
}