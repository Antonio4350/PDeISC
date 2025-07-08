document.getElementById("getFetch").addEventListener("click", () => {
  fetch("/api/fetch")//hago la peticion 
    .then(res => res.json())//espero la respuesta
    .then(data => mostrarRes("GET desde fetch", data))//muestro el mensaje y la respuesta
    .catch(err => mostrarRes("Error con fetch", err));//muestro el error
});

document.getElementById("getAxios").addEventListener("click", () => {
  fetch("/api/axios")//hago la peticion 
    .then(res => res.json())//espero la respuesta
    .then(data => mostrarRes("GET desde axios", data))//muestro el mensaje y la respuesta
    .catch(err => mostrarRes("Error con axios", err));//muestro el error
});

function mostrarRes(titulo, datos) {//creo la funcion que se devuelve al div de respuesta con el foreach
  const div = document.getElementById("res");
  let contenido = `<h2>${titulo}</h2><ul>`;

  datos.forEach(usuario => {
    contenido += `<li> ${usuario.name} - ${usuario.email}</li>`;
  });

  contenido += `</ul>`;
  div.innerHTML = contenido;
}