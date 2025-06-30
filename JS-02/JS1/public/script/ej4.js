//declaro arrays y los objetos
const numeros = [];
const mensajes = [];
const clientes = [];

const parrafo1 = document.getElementById("warning1");
const parrafo2 = document.getElementById("warning2");
const parrafo3 = document.getElementById("warning3");

const contenedorNumeros = document.getElementById("listaNumeros");
const contenedorMensajes = document.getElementById("listaMensajes");
const contenedorClientes = document.getElementById("listaClientes");

// form 1
document.getElementById("form1").addEventListener("submit", (e) => {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("numero").value.trim();
  parrafo1.textContent = "";
  contenedorNumeros.textContent = "";
  //valido
  if (input === "" || isNaN(input)) {
    parrafo1.textContent = "Introduzca un numero valido";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego
  numeros.push(input);
  contenedorNumeros.textContent = numeros.join(", ");
  parrafo1.textContent = "Numero agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";
  input.value = "";
});

document.getElementById("eliminarNumero").addEventListener("click", (e) => {
  e.preventDefault();
  //valido numeros restantes
  if (numeros.length === 0) {
    parrafo1.textContent = "No hay numeros por eliminar.";
    parrafo1.className = "text-sm text-center text-red-400";
    contenedorNumeros.textContent = "";
    return;
  }
  //elimino del array y muestro
  numeros.shift();
  contenedorNumeros.textContent = numeros.join(", ");
  parrafo1.textContent = "Primer numero eliminado";
  parrafo1.className = "text-sm text-center text-yellow-400";
});

// form 2
document.getElementById("form2").addEventListener("submit", (e) => {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("mensaje").value.trim();
  parrafo2.textContent = "";
  contenedorMensajes.textContent = "";
  //valido
  if (input === "") {
    parrafo2.textContent = "Introduzca un mensaje";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }
  //hago .push y muestro
  mensajes.push(input);
  contenedorMensajes.textContent = mensajes.join(", ");
  parrafo2.textContent = "Mensaje agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";
  input.value = "";
});

document.getElementById("eliminarMensaje").addEventListener("click", (e) => {
  e.preventDefault();
  //valido
  if (mensajes.length === 0) {
    parrafo2.textContent = "No hay mensajes por eliminar.";
    parrafo2.className = "text-sm text-center text-red-400";
    contenedorMensajes.textContent = "";
    return;
  }
  //elimino del array y muestro
  mensajes.shift();
  contenedorMensajes.textContent = mensajes.join(", ");
  parrafo2.textContent = "Primer mensaje eliminado";
  parrafo2.className = "text-sm text-center text-yellow-400";
});

// form 3
document.getElementById("form3").addEventListener("submit", (e) => {
  e.preventDefault();
  //inicializo
  const input = document.getElementById("cliente").value.trim();
  parrafo3.textContent = "";
  contenedorClientes.textContent = "";
  //valido
  if (input === "") {
    parrafo3.textContent = "Introduzca un cliente";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }
  //agrego y muestro
  clientes.push(input);
  contenedorClientes.textContent = clientes.join(", ");
  parrafo3.textContent = "Cliente agregado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";
  input.value = "";
});

document.getElementById("eliminarCliente").addEventListener("click", (e) => {
  e.preventDefault();
  //valido
  if (clientes.length === 0) {
    parrafo3.textContent = "No hay clientes por atender.";
    parrafo3.className = "text-sm text-center text-red-400";
    contenedorClientes.textContent = "";
    return;
  }
  //elimino y muestro
  clientes.shift();
  contenedorClientes.textContent = clientes.join(", ");
  parrafo3.textContent = "Primer cliente atendido";
  parrafo3.className = "text-sm text-center text-yellow-400";
});
