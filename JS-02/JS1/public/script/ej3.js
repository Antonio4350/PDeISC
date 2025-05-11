document.getElementById("form1").addEventListener("submit",color);
document.getElementById("form2").addEventListener("submit",tarea);
document.getElementById("form3").addEventListener("submit",usuario);

let colores = [];
let tareas = [];
let usuarios = [];

let parrafo1= document.getElementById("warning1");
let parrafo2= document.getElementById("warning2");
let parrafo3= document.getElementById("warning3");

function color(e){
    e.preventDefault();

    let color1 = document.getElementById("color1").value;
    let color2 = document.getElementById("color2").value;
    let color3 = document.getElementById("color3").value;
    
    let validar =true;
    if(color1 == "" || color2 == "" || color3 == ""){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo1.innerHTML = ("Introduzca todo los colores:");
        validar = false;
    }

    if(validar){
        parrafo1.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        colores.unshift(color1);
        colores.unshift(color2);
        colores.unshift(color3);

        parrafo1.innerHTML = "Colores: ";
        colores.forEach(re => {
            parrafo1.innerHTML += re + " ";
        });
    }
}

function tarea(e){
    e.preventDefault();

    let tarea = document.getElementById("tareaComun").value;
    let tareaUrgente = document.getElementById("tareaUrgente").value;
    let validar = true;

    if(tarea == "" ||tareaUrgente == ""){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo2.innerHTML = ("Introduzca ambas Tareas:");
        validar = false;
    }

    if(validar){
        parrafo2.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        tareas.push(tarea);
        tareas.unshift(tareaUrgente);
        
        parrafo2.innerHTML = "Tareas: ";
        tareas.forEach(re =>{
            parrafo2.innerHTML += re + ", ";
        })
    }
}

function usuario(e){
    e.preventDefault();

    let usuari = document.getElementById("usuario").value;
    let validar = true ;

    if(usuari == ""){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-red-100 border border-red-400 text-red-700";
        parrafo3.innerHTML = ("Introduzca un Usuario:");
        validar = false;
    }
    if(validar){
        parrafo3.className="mt-2 px-4 py-2 rounded-lg text-sm text-center bg-green-100 border border-green-400 text-green-700";
        usuarios.unshift(usuari);
        
        parrafo3.innerHTML = "usuarios: ";
        usuarios.forEach(re =>{
            parrafo3.innerHTML += re + ", ";
        })
    }
}