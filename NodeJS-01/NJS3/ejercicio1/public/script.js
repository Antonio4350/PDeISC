const $btn = document.getElementById("btn");

$btn.addEventListener("click", () => {
    const $h1 = document.createElement("h1");
    $h1.textContent = "Hola Mundo(h1)";
    document.body.appendChild($h1);
});

document.getElementById("btnRemove").addEventListener("click",() =>{
    const $h1 = document.querySelector("h1");
    document.body.removeChild($h1);
});

document.getElementById("btnCambiarTexto").addEventListener("click",()=>{
    const $h1 = document.querySelector("h1");
    $h1.textContent = "Chau Mundo(h1)";
});

document.getElementById("btnCambiarColor").addEventListener("click", ()=>{
    const $h1 = document.querySelector("h1");
    $h1.style.color ="#32a852";
});

document.getElementById("btnImg").addEventListener("click", ()=>{
    const $img =document.createElement("img");
    $img.src="https://portalechero.com/wp-content/uploads/2024/03/roquefort.jpg";
    $img.id = "img";
    document.body.appendChild($img);
});

document.getElementById("btnImgR").addEventListener("click", ()=>{
    const $img = document.getElementById("img");
    document.body.removeChild($img);
});

document.getElementById("btnImgAj").addEventListener("click", ()=>{
    const $img = document.getElementById("img");
    $img.style.width =("250px");
    $img.style.height =("250px"); 
});

document.getElementById("btnImgCambiar").addEventListener("click", ()=>{
    const $img = document.getElementById("img");
    $img.src="https://media.nergiza.com/comparativa-baterias-litio-18650.jpg?1511774457";
    $img.id = "img";
    document.body.appendChild($img);
});