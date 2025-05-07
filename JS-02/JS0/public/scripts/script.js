const nombre = document.getElementById("nombre");//declaro las constantes de todos los ids
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

chHijos.addEventListener("change", () => {//esto es para que se vea el campo del hijo
    if (chHijos.checked) {
      hijos.classList.remove("hidden");
      hijos.setAttribute("required", "true");
    } else {
      hijos.classList.add("hidden");
      hijos.removeAttribute("required");
      hijos.value = "";
    }
  });

form.addEventListener("submit", e => {
    e.preventDefault();// con esta linea hacemos que no se recarge la pagina al darle submit y declaro el entrar
    let entrar = false;// que va a servir para saber si algo esta mal y lo muestre
    let warnings = "";
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    parrafo.innerHTML = "";

    if (nombre.value.length < 4) {//esto se repite en cada campo para validar el registro
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

    if (estadoCivil.value === "") {
        warnings += 'Debe seleccionar un estado civil<br>';
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

    if (chHijos.checked && (hijos.value === "" || hijos.value < 1)) {
        warnings += 'Ingrese una cantidad válida de hijos<br>';
        entrar = true;
    }

    if (!chHijos.checked && hijos.value > 0) {
        warnings += 'Marcá la casilla de hijos si ingresaste cantidad<br>';
        entrar = true;
    }

    if (entrar) {
        parrafo.innerHTML = warnings;//mostramos los problemas si no se envio
    } else {
        parrafo.textContent = "Enviado exitosamente";//aca se envia y modificamos los campos para mostrar la lista
        const lista = document.getElementById("listaPersonas");
        const li = document.createElement("li");
        li.textContent = `${nombre.value} ${apellido.value}`;
        lista.appendChild(li);
    }
});
