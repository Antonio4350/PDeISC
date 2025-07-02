
document.getElementById("getFetch").addEventListener("click", () => {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(data => mostrarRes("get con fetch", data))
    .catch(err => mostrarRes("error con fetch", err));
});

document.getElementById("getAxios").addEventListener("click", () => {
  axios.get("https://jsonplaceholder.typicode.com/users")
    .then(res => mostrarRes("get con axios", res.data))
    .catch(err => mostrarRes("error con axios", err));
});

function mostrarRes(titulo, datos) {
  const div = document.getElementById("res");

  let contenido = `<h2>${titulo}</h2><ul>`;

  datos.forEach(usuario => {
    contenido += `<li> ${usuario.name} - ${usuario.email}</li>`;
  });
  contenido += `</ul>`;
  div.innerHTML = contenido;
}