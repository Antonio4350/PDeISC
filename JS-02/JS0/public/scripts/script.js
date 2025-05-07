const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const edad = document.getElementById("edad");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const masculino = document.getElementById("masculino");
const femenino = document.getElementById("femenino");
const dni = document.getElementById("dni");
const estadoCivil = document.getElementById("estadoCivil");
const nacionalidad = document.getElementById("nacionalidad");
const tel = document.getElementById("tel");
const mail = document.getElementById("mail");
const chHijos = document.getElementById("chHijos");
const hijos = document.getElementById("hijos");
const form = document.getElementById("form");
const parrafo = document.getElementById("warning");

form.addEventListener("submit", e => {
    e.preventDefault();
    let entrar = false;
    let warnings = "";
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    parrafo.innerHTML = "";

    if (nombre.value.length < 4) {
        warnings += 'El nombre es demasiado corto<br>';
        entrar = true;
    }

    if (apellido.value.length < 2) {
        warnings += 'El apellido es demasiado corto<br>';
        entrar = true;
    }

    if (edad.value < 0 || edad.value > 120 || edad.value === "") {
        warnings += 'Edad inválida<br>';
        entrar = true;
    }

    if (!fechaNacimiento.value) {
        warnings += 'Debe ingresar la fecha de nacimiento<br>';
        entrar = true;
    }

    if (!masculino.checked && !femenino.checked) {
        warnings += 'Debe seleccionar un género<br>';
        entrar = true;
    }

    if (dni.value.length < 7 || dni.value.length > 9) {
        warnings += 'DNI inválido<br>';
        entrar = true;
    }

    if (estadoCivil.value.length < 3) {
        warnings += 'Estado civil inválido<br>';
        entrar = true;
    }

    if (nacionalidad.value.length < 3) {
        warnings += 'Nacionalidad inválida<br>';
        entrar = true;
    }

    if (tel.value.length < 6) {
        warnings += 'Teléfono inválido<br>';
        entrar = true;
    }

    if (!regexEmail.test(mail.value)) {
        warnings += 'Correo electrónico no válido<br>';
        entrar = true;
    }

    if (chHijos.checked && (hijos.value === "" || hijos.value < 0)) {
        warnings += 'Ingrese una cantidad válida de hijos<br>';
        entrar = true;
    }

    if (!chHijos.checked && hijos.value > 0) {
        warnings += 'Marcá la casilla de hijos si ingresaste cantidad<br>';
        entrar = true;
    }

    if (entrar) {
        parrafo.innerHTML = warnings;
    } else {
        parrafo.innerHTML = "Enviado exitosamente";
    }
});
