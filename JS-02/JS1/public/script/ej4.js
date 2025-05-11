document.getElementById("form1").addEventListener("submit",agNumero);
document.getElementById("eliminarNumero").addEventListener("click",elNumero);
document.getElementById("form2").addEventListener("submit",agMensaje);
document.getElementById("eliminarMensaje").addEventListener("click",elMensaje);
document.getElementById("form3").addEventListener("submit",agCliente);
document.getElementById("eliminarCliente").addEventListener("click",elCliente);

let numeros = [];
let mensajes = [];
let clientes = [];

let parrafo1 = document.getElementById("warning1");
let parrafo2 = document.getElementById("warning2");
let parrafo3 = document.getElementById("warning3");

function agNumero(e){
    e.preventDefault();
    
    let validar = true;
    let numero = document.getElementById("numero").value;
    
    if(numero == "" || isNaN(numero)){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = ("Introduzca un Numero:");
        validar = false;
    }
    
    if(validar){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        numeros.push(numero);
        
        parrafo1.innerHTML = "Numeros: ";
        numeros.forEach(re =>{
            parrafo1.innerHTML += re + ", ";
        })
    }
}

function elNumero(e){
    e.preventDefault();

    let validar = true;

    if(validar){
        numeros.shift();
        parrafo1.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
        
        parrafo1.innerHTML = "Primer numero eliminado: ";
        numeros.forEach(re =>{
            parrafo1.innerHTML += re + ", ";
        })
    }
    
    if(numeros == ""){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = ("No hay numeros por eliminar.");
        validar = false;
    }
}

function agMensaje(e){
    e.preventDefault();
    validar = true ;

    let mensaje = document.getElementById("mensaje").value;

    if(mensaje == ""){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = ("Introduzca un Mensaje:");
        validar = false;
    }

    if(validar){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        mensajes.push(mensaje);
        
        parrafo2.innerHTML = "Mensaje: ";
        mensajes.forEach(re =>{
            parrafo2.innerHTML += re + ", ";
        })
    }
}

function elMensaje(e){
    e.preventDefault();
    validar = true;

    if(validar){
        mensajes.shift();
        parrafo2.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
        
        parrafo2.innerHTML = "Primer mensaje eliminado: ";
        mensajes.forEach(re =>{
            parrafo2.innerHTML += re + ", ";
        })
    }
    
    if(mensajes == ""){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = ("No hay mensajes por eliminar.");
        validar = false;
    }
}


function agCliente(e){
    e.preventDefault();
    validar = true ;

    let cliente = document.getElementById("cliente").value;

    if(cliente == ""){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = ("Introduzca un Cliente:");
        validar = false;
    }

    if(validar){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        clientes.push(cliente);
        
        parrafo3.innerHTML = "Cliente: ";
        clientes.forEach(re =>{
            parrafo3.innerHTML += re + ", ";
        })
    }
}

function elCliente(e){
    e.preventDefault();
    validar = true;

    if(validar){
        clientes.shift();
        parrafo3.className = "mt-2 px-4 py-2 rounded-lg text-sm text-center bg-yellow-100 border border-yellow-400 text-yellow-700";
        
        parrafo3.innerHTML = "Primer cliente atendido: ";
        clientes.forEach(re =>{
            parrafo3.innerHTML += re + ", ";
        })
    }
    
    if(clientes == ""){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = ("No hay clientes por atender.");
        validar = false;
    }
}

