//declaro arrays y obtengo los objetos
const fruta = [];
const amigo = [];
const number = [];

const parrafo = document.getElementById("warning");
const contenedor = document.getElementById("listaFrutas");

const parrafoAmigo = document.getElementById("warningAmigo");
const contenedorAmigo = document.getElementById("listaAmigos");

const parrafoNumero = document.getElementById("warningNumeros");
const contenedorNumero = document.getElementById("listaNumeros");

//frutas
document.getElementById("formulario1").addEventListener("submit", (e) => {
  e.preventDefault();
  //inicio variables
  const input = document.getElementById("frutaInput").value.trim();
  parrafo.innerHTML = "";
  contenedor.innerHTML = "";
  //valido
  if (input === "" || !isNaN(parseInt(input))) {
    parrafo.textContent = "Ingrese una fruta";
    parrafo.className = "text-sm text-center text-red-400";
    return;
  }
  //.push a frutas y muestro
  fruta.push(input);
  contenedor.textContent = fruta.join(", ");
  parrafo.textContent = "Fruta agregada exitosamente";
  parrafo.className = "text-sm text-center text-green-400";
  input.value = "";
});

//amigos
document.getElementById("formulario2").addEventListener("submit", (e) => {
  e.preventDefault();
  //inicio variables
  const input = document.getElementById("amigoInput").value.trim();
  parrafoAmigo.innerHTML = "";
  contenedorAmigo.innerHTML = "";
  //valido
  if (input === "" || !isNaN(parseInt(input))) {
    parrafoAmigo.textContent = "Ingrese un amigo";
    parrafoAmigo.className = "text-sm text-center text-red-400";
    return;
  }
  //.push a amigos y muestro
  amigo.push(input);
  contenedorAmigo.textContent = amigo.join(", ");
  parrafoAmigo.textContent = "Amigo agregado exitosamente";
  parrafoAmigo.className = "text-sm text-center text-green-400";
  input.value = "";
});

//numeros
document.getElementById("formulario3").addEventListener("submit", (e) => {
  e.preventDefault();
  //inicio variables
  const input = parseFloat(document.getElementById("number").value.trim());
  parrafoNumero.innerHTML = "";
  contenedorNumero.innerHTML = "";
  //valido
  if (isNaN(input)) {
    parrafoNumero.textContent = "Ingrese un numero valido";
    parrafoNumero.className = "text-sm text-center text-red-400";
    return;
  }
  //aplico la condicion para agregar numeros
  if (number.length === 0 || input > number[number.length - 1]) {
    number.push(input);
    contenedorNumero.textContent = number.join(", ");
    parrafoNumero.textContent = "Numero agregado exitosamente";
    parrafoNumero.className = "text-sm text-center text-green-400";
  } else {
    parrafoNumero.textContent = "El numero debe ser mayor al ultimo ingresado";
    parrafoNumero.className = "text-sm text-center text-red-400";
    return;
  }

  input.value = "";
});
