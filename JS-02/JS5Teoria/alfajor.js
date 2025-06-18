export class Alfajor{
    constructor(nombre,marca,peso,valor){
        this.nombre = nombre;
        this.marca = marca;
        this.peso = peso;
        this._precio = valor;
    }
    get precio(){
        return this._precio;
    }
    set precio(nuevoPrecio){
        this._precio=nuevoPrecio;
    }
}