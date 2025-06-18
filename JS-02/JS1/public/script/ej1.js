const fruta = [];
const amigo = [];
const number = [];

const parrafo = document.getElementById("warning");
const contenedor = document.getElementById("listaFrutas");

const parrafoAmigo = document.getElementById("warningAmigo");
const contenedorAmigo = document.getElementById("listaAmigos");

const parrafoNumero = document.getElementById("warningNumeros");
const contenedorNumero = document.getElementById("listaNumeros");

// FRUTAS
document.getElementById("formulario1").addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("frutaInput");
    const valor = input.value.trim();
    parrafo.innerHTML = "";
    contenedor.innerHTML = "";

    if (valor === "") {
        parrafo.textContent = "Ingrese una fruta";
        parrafo.className = "text-sm text-center text-red-400";
        return;
    }

    fruta.push(valor);
    contenedor.textContent = fruta.join(", ");
    parrafo.textContent = "Fruta agregada exitosamente";
    parrafo.className = "text-sm text-center text-green-400";
    input.value = "";
});

// AMIGOS
document.getElementById("formulario2").addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("amigoInput");
    const valor = input.value.trim();
    parrafoAmigo.innerHTML = "";
    contenedorAmigo.innerHTML = "";

    if (valor === "") {
        parrafoAmigo.textContent = "Ingrese un amigo";
        parrafoAmigo.className = "text-sm text-center text-red-400";
        return;
    }

    amigo.push(valor);
    contenedorAmigo.textContent = amigo.join(", ");
    parrafoAmigo.textContent = "Amigo agregado exitosamente";
    parrafoAmigo.className = "text-sm text-center text-green-400";
    input.value = "";
});

// NÚMEROS
document.getElementById("formulario3").addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("number");
    const valor = parseFloat(input.value.trim());
    parrafoNumero.innerHTML = "";
    contenedorNumero.innerHTML = "";

    if (isNaN(valor)) {
        parrafoNumero.textContent = "Ingrese un número válido";
        parrafoNumero.className = "text-sm text-center text-red-400";
        return;
    }

    if (number.length === 0 || valor > number[number.length - 1]) {
        number.push(valor);
        contenedorNumero.textContent = number.join(", ");
        parrafoNumero.textContent = "Número agregado exitosamente";
        parrafoNumero.className = "text-sm text-center text-green-400";
    } else {
        parrafoNumero.textContent = "El número debe ser mayor al último ingresado";
        parrafoNumero.className = "text-sm text-center text-red-400";
        return;
    }

    input.value = "";
});
