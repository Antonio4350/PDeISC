// Declaracion de arrays para almacenar las frutas, amigos y numeros
const fruta = [];
const amigo = [];
const number = [];

// Referencias a los elementos del DOM para mostrar mensajes de error y listas
const parrafo = document.getElementById("warning");
const contenedor = document.getElementById("listaFrutas");

const parrafoAmigo = document.getElementById("warningAmigo");
const contenedorAmigo = document.getElementById("listaAmigos");

const parrafoNumero = document.getElementById("warningNumeros");
const contenedorNumero = document.getElementById("listaNumeros");

// Manejo del primer formulario para ingresar frutas
document.getElementById("formulario1").addEventListener("submit", e => {
    e.preventDefault(); // Previene la recarga de la pagina

    // Limpiar cualquier contenido previo
    parrafo.innerHTML = "";
    contenedor.innerHTML = "";

    // Obtener los valores de las frutas
    const f1 = document.getElementById("fruta1").value.trim();
    const f2 = document.getElementById("fruta2").value.trim();
    const f3 = document.getElementById("fruta3").value.trim();

    // Verificar si todos los campos tienen un valor
    if (f1 === "" || f2 === "" || f3 === "") {
        parrafo.textContent = "Ingrese las 3 frutas"; // Mensaje de error
        parrafo.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center whitespace-pre-line bg-red-100 border border-red-400 text-red-700";
        return; // Sale de la funcion si hay un error
    }

    // Agregar las frutas al array y mostrar en el contenedor
    fruta.push(f1, f2, f3);
    fruta.forEach(f => {
        contenedor.innerHTML += `<p class="text-gray-700">${f}</p>`;
    });

    // Mensaje de exito
    parrafo.textContent = "Frutas ingresadas exitosamente";
    parrafo.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
});

// Manejo del segundo formulario para ingresar amigos
document.getElementById("formulario2").addEventListener("submit", e => {
    e.preventDefault(); // Previene la recarga de la pagina

    // Limpiar cualquier contenido previo
    parrafoAmigo.innerHTML = "";
    contenedorAmigo.innerHTML = "";

    // Obtener los valores de los amigos
    const a1 = document.getElementById("amigo1").value.trim();
    const a2 = document.getElementById("amigo2").value.trim();
    const a3 = document.getElementById("amigo3").value.trim();

    // Verificar si todos los campos tienen un valor
    if (a1 === "" || a2 === "" || a3 === "") {
        parrafoAmigo.textContent = "Ingrese los 3 amigos"; // Mensaje de error
        parrafoAmigo.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center whitespace-pre-line bg-red-100 border border-red-400 text-red-700";
        return; // Sale de la funcion si hay un error
    }

    // Agregar los amigos al array y mostrar en el contenedor
    amigo.push(a1, a2, a3);
    amigo.forEach(a => {
        contenedorAmigo.innerHTML += `<p class="text-gray-700">${a}</p>`;
    });

    // Mensaje de exito
    parrafoAmigo.textContent = "Amigos ingresados exitosamente";
    parrafoAmigo.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
});

// Manejo del tercer formulario para ingresar numeros
document.getElementById("formulario3").addEventListener("submit", e => {
    e.preventDefault(); // Previene la recarga de la pagina

    const input = document.getElementById("number");
    const nuevo = parseFloat(input.value.trim()); // Convertir el valor a numero

    // Verificar si el valor es un numero valido
    if (isNaN(nuevo)) {
        parrafoNumero.textContent = "Ingrese un numero valido"; // Mensaje de error
        parrafoNumero.className = "mt-2 px-4 py-2 rounded-lg text-sm text-left whitespace-pre-line bg-red-100 border border-red-400 text-red-700";
        return; // Sale de la funcion si no es un numero valido
    }

    // Verificar si el numero es mayor que el ultimo ingresado
    if (number.length === 0 || nuevo > number[number.length - 1]) {
        number.push(nuevo); // Agregar el numero al array
    } else {
        parrafoNumero.textContent = "El numero debe ser mayor al ultimo ingresado"; // Mensaje de error
        parrafoNumero.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center whitespace-pre-line bg-red-100 border border-red-400 text-red-700";
        return; // Sale de la funcion si no cumple la condicion
    }

    // Limpiar cualquier contenido previo
    parrafoNumero.innerHTML = "";
    contenedorNumero.innerHTML = "";

    // Mostrar la lista de numeros
    number.forEach(n => {
        contenedorNumero.innerHTML += `<p class="text-gray-700">${n}</p>`;
    });

    // Limpiar el campo de entrada
    input.value = "";

    // Mensaje de exito
    parrafoNumero.textContent = "Numero ingresado exitosamente";
    parrafoNumero.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
});
