const numeros = [];
const mensajes = [];
const clientes = [];

const parrafo1 = document.getElementById("warning1");
const parrafo2 = document.getElementById("warning2");
const parrafo3 = document.getElementById("warning3");

const contenedorNumeros = document.getElementById("listaNumeros");
const contenedorMensajes = document.getElementById("listaMensajes");
const contenedorClientes = document.getElementById("listaClientes");

// FORM 1 - NÚMEROS
document.getElementById("form1").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("numero");
  const valor = input.value.trim();

  parrafo1.textContent = "";
  contenedorNumeros.textContent = "";

  if (valor === "" || isNaN(valor)) {
    parrafo1.textContent = "Introduzca un número válido";
    parrafo1.className = "text-sm text-center text-red-400";
    return;
  }

  numeros.push(valor);
  contenedorNumeros.textContent = numeros.join(", ");
  parrafo1.textContent = "Número agregado exitosamente";
  parrafo1.className = "text-sm text-center text-green-400";
  input.value = "";
});

document.getElementById("eliminarNumero").addEventListener("click", (e) => {
  e.preventDefault();
  if (numeros.length === 0) {
    parrafo1.textContent = "No hay números por eliminar.";
    parrafo1.className = "text-sm text-center text-red-400";
    contenedorNumeros.textContent = "";
    return;
  }

  numeros.shift();
  contenedorNumeros.textContent = numeros.join(", ");
  parrafo1.textContent = "Primer número eliminado";
  parrafo1.className = "text-sm text-center text-yellow-400";
});

// FORM 2 - MENSAJES
document.getElementById("form2").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("mensaje");
  const valor = input.value.trim();

  parrafo2.textContent = "";
  contenedorMensajes.textContent = "";

  if (valor === "") {
    parrafo2.textContent = "Introduzca un mensaje";
    parrafo2.className = "text-sm text-center text-red-400";
    return;
  }

  mensajes.push(valor);
  contenedorMensajes.textContent = mensajes.join(", ");
  parrafo2.textContent = "Mensaje agregado exitosamente";
  parrafo2.className = "text-sm text-center text-green-400";
  input.value = "";
});

document.getElementById("eliminarMensaje").addEventListener("click", (e) => {
  e.preventDefault();
  if (mensajes.length === 0) {
    parrafo2.textContent = "No hay mensajes por eliminar.";
    parrafo2.className = "text-sm text-center text-red-400";
    contenedorMensajes.textContent = "";
    return;
  }

  mensajes.shift();
  contenedorMensajes.textContent = mensajes.join(", ");
  parrafo2.textContent = "Primer mensaje eliminado";
  parrafo2.className = "text-sm text-center text-yellow-400";
});

// FORM 3 - CLIENTES
document.getElementById("form3").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("cliente");
  const valor = input.value.trim();

  parrafo3.textContent = "";
  contenedorClientes.textContent = "";

  if (valor === "") {
    parrafo3.textContent = "Introduzca un cliente";
    parrafo3.className = "text-sm text-center text-red-400";
    return;
  }

  clientes.push(valor);
  contenedorClientes.textContent = clientes.join(", ");
  parrafo3.textContent = "Cliente agregado exitosamente";
  parrafo3.className = "text-sm text-center text-green-400";
  input.value = "";
});

document.getElementById("eliminarCliente").addEventListener("click", (e) => {
  e.preventDefault();
  if (clientes.length === 0) {
    parrafo3.textContent = "No hay clientes por atender.";
    parrafo3.className = "text-sm text-center text-red-400";
    contenedorClientes.textContent = "";
    return;
  }

  clientes.shift();
  contenedorClientes.textContent = clientes.join(", ");
  parrafo3.textContent = "Primer cliente atendido";
  parrafo3.className = "text-sm text-center text-yellow-400";
});
