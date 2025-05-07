const fruta = [];
const amigo = [];
const number = [];

const parrafo = document.getElementById("warning");
const contenedor = document.getElementById("listaFrutas");

const parrafoAmigo = document.getElementById("warningAmigo");
const contenedorAmigo = document.getElementById("listaAmigos");

const parrafoNumero = document.getElementById("warningNumeros");
const contenedorNumero = document.getElementById("listaNumeros");

document.getElementById("formulario1").addEventListener("submit", e => {
    e.preventDefault();

    parrafo.innerHTML = "";
    contenedor.innerHTML = "";

    const f1 = document.getElementById("fruta1").value.trim();
    const f2 = document.getElementById("fruta2").value.trim();
    const f3 = document.getElementById("fruta3").value.trim();

    if (f1 === "" || f2 === "" || f3 === "") {
        parrafo.textContent = "Ingrese las 3 frutas";
        parrafo.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center whitespace-pre-line bg-red-100 border border-red-400 text-red-700";
        return;
    }

    fruta.push(f1, f2, f3);

    fruta.forEach(f => {
        contenedor.innerHTML += `<p class="text-gray-700">${f}</p>`;
    });

    parrafo.textContent = "Frutas ingresadas exitosamente";
    parrafo.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
    });

document.getElementById("formulario2").addEventListener("submit", e => {
    e.preventDefault();

    parrafoAmigo.innerHTML = "";
    contenedorAmigo.innerHTML = "";

    const a1 = document.getElementById("amigo1").value.trim();
    const a2 = document.getElementById("amigo2").value.trim();
    const a3 = document.getElementById("amigo3").value.trim();

    if (a1 === "" || a2 === "" || a3 === "") {
        parrafoAmigo.textContent = "Ingrese los 3 amigos";
        parrafoAmigo.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center whitespace-pre-line bg-red-100 border border-red-400 text-red-700";
        return;
    }

    amigo.push(a1, a2, a3);

    amigo.forEach(a => {
        contenedorAmigo.innerHTML += `<p class="text-gray-700">${a}</p>`;
    });

    parrafoAmigo.textContent = "Amigos ingresados exitosamente";
    parrafoAmigo.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
});

document.getElementById("formulario3").addEventListener("submit", e => {
    e.preventDefault();

    const input = document.getElementById("number");
    const nuevo = parseFloat(input.value.trim());

    if (isNaN(nuevo)) {
        parrafoNumero.textContent = "Ingrese un número válido";
        parrafoNumero.className = "mt-2 px-4 py-2 rounded-lg text-sm text-left whitespace-pre-line bg-red-100 border border-red-400 text-red-700";
        return;
    }

    if (number.length === 0 || nuevo > number[number.length - 1]) {
        number.push(nuevo);
    } else {
        parrafoNumero.textContent = "El número debe ser mayor al último ingresado";
        parrafoNumero.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center whitespace-pre-line bg-red-100 border border-red-400 text-red-700";
        return;
    }

    parrafoNumero.innerHTML = "";
    contenedorNumero.innerHTML = "";
    number.forEach(n => {
        contenedorNumero.innerHTML += `<p class="text-gray-700">${n}</p>`;
    });

    input.value = "";
    parrafoNumero.textContent = "Número ingresado exitosamente";
    parrafoNumero.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
});
