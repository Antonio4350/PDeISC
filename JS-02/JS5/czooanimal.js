export class CZooAnimal{
    constructor(idAnimal,nombre,jaulaNumero,idTipoAnimal,peso){
        this.idAnimal = idAnimal;
        this.nombre = nombre;
        this.jaulaNumero = jaulaNumero;
        this.idTipoAnimal = idTipoAnimal;
        this.peso = peso;
    }

    get tabla(){
        return this.idAnimal,this.nombre,this.jaulaNumero,this.idTipoAnimal,this.peso;
    }

    set nombre(nombreAnimal){
        this.nombre = nombreAnimal;
    }
}