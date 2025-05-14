// Se agrega el evento submit a los formularios para llamar a las funciones correspondientes.
document.getElementById("form1").addEventListener("submit",ag1);
document.getElementById("form2").addEventListener("submit",ag2);
document.getElementById("form3").addEventListener("submit",ag3);
// Se crean los arrays donde se guardaran los valores ingresados.
let array1 = [];
let array2 = [];
let array3 = [];
// Se obtienen los elementos del DOM donde se mostraran los mensajes.
let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");
// Funcion que maneja el primer formulario
function ag1(e){
    e.preventDefault();// Se evita que se recargue la pagina al enviar el formulario

    let validar = true;
    let id1 = document.getElementById("id1").value;// Se obtiene el valor del campo id1
// Se valida que el campo no este vacio
    if (id1== "") {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = "Introduzca un texto en el campo:";
        validar = false;
    }
// Si la validacion es correcta, se agrega el elemento al array y se muestra el resultado
    if (validar) {
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        array1.push(id1);// Se agrega el elemento al array

        let aux = array1.reduce((acum, tex) => acum + tex, '');//sumo todos los elementos del array

        parrafo1.innerHTML = "Textos ingresados: ";
        array1.forEach(re => {
            parrafo1.innerHTML += re + ", ";// Se muestran
        });

        parrafo1.innerHTML += "<br>Textos juntos: " + aux;
    }
}

function ag2(e){
    e.preventDefault();

    let validar = true;
    let id2 = document.getElementById("id2").value;

    if (id2 == ""||isNaN(id2)) {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = "Introduzca un numero en el campo:";
        validar = false;
    }

    if (validar) {
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        array2.push(id2);

        let aux = array2.reduce((acum, num) => acum * num, 1);//multiplico todos los elementos del array y su valor inicial es 1

        parrafo2.innerHTML = "Numeros ingresados: ";
        array2.forEach(re => {
            parrafo2.innerHTML += re + ", ";
        });

        parrafo2.innerHTML += "<br>Numeros multiplicados: " + aux;
    }
}

function ag3(e){
    e.preventDefault();

    let validar = true;
    let id3 = document.getElementById("id3").value;

    if (id3 == ""||isNaN(id3)) {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = "Introduzca un numero(precio) en el campo:";
        validar = false;
    }

    if (validar) {
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        
        let precio= {
            precio : parseInt(id3),
        }
        array3.push(precio);
        let aux = array3.reduce((acum, num) => acum + num.precio, 0);//obtengo el total de todo el array sumado iniciando con el valor 0

        parrafo3.innerHTML = "Precios ingresados: ";
        array3.forEach(re => {
            parrafo3.innerHTML += re.precio + ", ";
        });
        parrafo3.innerHTML += "<br>Total de los Precios: " + aux;
    }
}