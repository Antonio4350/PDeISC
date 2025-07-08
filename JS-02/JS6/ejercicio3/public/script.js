let usuarios = [];

fetch("/api/usuarios")//uso el mismo fetch como anteriormente 
  .then(res => res.json())
  .then(data => {
    usuarios = data;
    mostrarUsuarios(usuarios);
  })
  .catch(() => {
    document.getElementById("lista").textContent = "error al cargar usuarios";
  });

document.getElementById("busca").addEventListener("input", (e) => {//filtra segun el valor del input y muestra la lista resultante
  const texto = e.target.value.toLowerCase();
  const filtrados = usuarios.filter(user => user.name.toLowerCase().includes(texto));
  mostrarUsuarios(filtrados);
});

function mostrarUsuarios(lista) {//funcion para mostrar la lista de los usuarios 
  const ul = document.getElementById("lista");
  ul.innerHTML = "";
  lista.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.name}`;
    ul.appendChild(li);
  });
}
