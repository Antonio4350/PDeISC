document.addEventListener("mousedown",contar);
//con esta funcion cuenta los hilos de donde se presiono 
function contar(event)
{
    const elemento = event.target;
    document.body.innerHTML+="<p>Cantidad de hijos: </p>"+elemento.childElementCount;
}