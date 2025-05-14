// Se agrega el evento submit a los formularios para llamar a las funciones correspondientes.
document.getElementById("form1").addEventListener("submit",agNombre);
document.getElementById("form2").addEventListener("submit",agNumero);
document.getElementById("form3").addEventListener("submit",agPersona);
// Se crean los arrays donde se guardaran los valores ingresados.
let array1 = [];
let array2 = [];
let array3 = [];
// Se obtienen los elementos del DOM donde se mostraran los mensajes.
let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");
// Funcion que maneja el primer formulario
function agNombre(e){
    e.preventDefault();// Se evita que se recargue la pagina al enviar el formulario

    let validar = true;
    let id1 = document.getElementById("id1").value;// Se obtiene el valor del campo id1
// Se valida que el campo no este vacio
    if(id1 == ""){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = ("Introduzca un nombre en el campo:");
        id1 = "";
        validar = false;
    }
// Si la validacion es correcta, se agrega el elemento al array y se muestra el resultado
    if(validar){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        array1.push(id1);// Se agrega el elemento al array
        parrafo1.innerHTML = "Nombres ingresado: ";
        array1.forEach(re =>{
            parrafo1.innerHTML +="Saludos " + re + ", " ;// Se muestran los nombres y saludos
        })
    }
}

function agNumero(e){
    e.preventDefault();

    let validar = true;
    let id2 = document.getElementById("id2").value;

    if(id2 == ""||  isNaN(id2)){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = ("Introduzca un numero en el campo:");
        id2 = "";
        validar = false;
    }

    if(validar){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        array2.push(parseInt(id2));
        parrafo2.innerHTML = "Doble del numero ingresado: ";
        array2.forEach(re =>{
            parrafo2.innerHTML +=re*2 + ", " ;//imprimo el doble del numero
        })
    }
}

function agPersona(e){
    e.preventDefault();

    let validar = true;
    let id3 = document.getElementById("id3").value;
    let id4 = document.getElementById("id4").value;

    if(id3 == ""){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = ("Introduzca un nombre en el campo:");
        id3 = "";
        validar = false;
    }

    if(id4 == ""||  isNaN(id4)){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = ("Introduzca un numero en el campo:");
        id4 = "";
        validar = false;
    }

    if(validar){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        let obj = {
            nombre : id3,
            edad : parseInt(id4),
        };
        array3.push(obj);
        parrafo3.innerHTML = "Doble del numero ingresado: ";
        array3.forEach(re =>{
            parrafo3.innerHTML +=re.nombre + ", " + re.edad;//muestro cada nombre con la edad
        })
    }
}