const $btn = document.getElementById("btn");//creo la const btn con la id btn

$btn.addEventListener("click", () => {//creo el h1 y coloco el texto
    const $h1 = document.createElement("h1");
    $h1.textContent = "Hola Mundo(h1)";
    document.body.appendChild($h1);
});

document.getElementById("btnRemove").addEventListener("click",() =>{
    const $h1 = document.querySelector("h1");//recupero el h1 ya creado y lo elimino
    document.body.removeChild($h1);
});

document.getElementById("btnCambiarTexto").addEventListener("click",()=>{
    const $h1 = document.querySelector("h1");//crecupero y cambio el texto
    $h1.textContent = "Chau Mundo(h1)";
});

document.getElementById("btnCambiarColor").addEventListener("click", ()=>{
    const $h1 = document.querySelector("h1");//recupero y cambio el color
    $h1.style.color ="#32a852";
});

document.getElementById("btnImg").addEventListener("click", ()=>{
    const $img =document.createElement("img");//creo la imagen y le coloco la url y la id
    $img.src="https://portalechero.com/wp-content/uploads/2024/03/roquefort.jpg";
    $img.id = "img";
    document.body.appendChild($img);
});

document.getElementById("btnImgR").addEventListener("click", ()=>{
    const $img = document.getElementById("img");//recupero la id de la imagen y la saco
    document.body.removeChild($img);
});

document.getElementById("btnImgAj").addEventListener("click", ()=>{
    const $img = document.getElementById("img");//recupero la imagen y le mando un tamaño
    $img.style.width =("250px");
    $img.style.height =("250px"); 
});

document.getElementById("btnImgCambiar").addEventListener("click", ()=>{
    const $img = document.getElementById("img");//hago que la id tenga otra url y la muestro
    $img.src="https://media.nergiza.com/comparativa-baterias-litio-18650.jpg?1511774457";
    $img.id = "img";
    document.body.appendChild($img);
});