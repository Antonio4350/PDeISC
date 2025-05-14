// Se agrega el evento submit a los formularios para llamar a las funciones correspondientes.
document.getElementById("form1").addEventListener("submit",agNumero);
document.getElementById("form2").addEventListener("submit",agNombre);
document.getElementById("form3").addEventListener("submit",agPrecio);
// Se crean los arrays donde se guardaran los valores ingresados.
let array1 = [];
let array2 = [];
let array3 = [];
// Se obtienen los elementos del DOM donde se mostraran los mensajes.
let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");
// Funcion que maneja el primer formulario
function agNumero(e) {
    e.preventDefault();// Se evita que se recargue la pagina al enviar el formulario

    let validar = true;
    let id1 = document.getElementById("id1").value;// Se obtiene el valor del campo id1
// Se valida que el campo no este vacio y sea un numero
    if (id1 == "" || isNaN(id1)) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = "Introduzca un numero en el campo:";
        validar = false;
    }
// Si la validacion es correcta, se agrega el numero al array y se muestra el resultado
    if (validar) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        array1.push(parseInt(id1));// Se agrega el numero al array

        let aux = array1.map(n => n * 3);//multiplico cada numero *3

        parrafo1.innerHTML = "Numeros ingresados: ";
        array1.forEach(re => {
            parrafo1.innerHTML += re + ", ";// Se muestran
        });

        parrafo1.innerHTML += "<br>Numeros multiplicados *3: ";
        aux.forEach(re => {
            parrafo1.innerHTML += re + ", ";// Se muestran
        });
    }
}

function agNombre(e) {
    e.preventDefault();

    let validar = true;
    let id2 = document.getElementById("id2").value;

    if (id2 == "") {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = "Introduzca un nombre en el campo:";
        validar = false;
    }

    if (validar) {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        array2.push(id2);

        let aux = array2.map(n => n.toUpperCase() );//paso el array a mayusculas

        parrafo2.innerHTML = "Nombres ingresados: ";
        array2.forEach(re => {
            parrafo2.innerHTML += re + ", ";
        });

        parrafo2.innerHTML += "<br>Nombres en mayusculas: ";
        aux.forEach(re => {
            parrafo2.innerHTML += re + ", ";
        });
    }
}

function agPrecio(e) {
    e.preventDefault();

    let validar = true;
    let id3 = document.getElementById("id3").value;

    if (id3 == "" || isNaN(id3)) {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = "Introduzca un precio en el campo:";
        validar = false;
    }

    if (validar) {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        array3.push(parseInt(id3));

        let aux = array3.map(n => n * 1.21);//le agrego el iva a los precios

        parrafo3.innerHTML = "Precios ingresados: ";
        array3.forEach(re => {
            parrafo3.innerHTML += re + ", ";
        });

        parrafo3.innerHTML += "<br>Precios con IVA: ";
        aux.forEach(re => {
            parrafo3.innerHTML += re + ", ";
        });
    }
}