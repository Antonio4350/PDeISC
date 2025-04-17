import{parse} from'node:url';//importo el parse

export function muestrasearch(url){//creo la funcion
    let q = parse(url,true);//creo let con el parse
    return q.search;//muesto el search
}