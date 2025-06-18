export class Animal {

  constructor(nombre, jaula, tipo, peso) {
    this.id = Date.now();
    this.nombre = nombre;
    this.jaula = parseInt(jaula);
    this.tipo = tipo.toLowerCase();
    this.peso = parseFloat(peso);
  }
}