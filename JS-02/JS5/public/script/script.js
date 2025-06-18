const form = document.getElementById("animalForm");
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    
    const name = document.getElementById("nombre").value;
    const jaula = document.getElementById("jaula").value;
    const tipo = document.getElementById("tipoAnimal").value;
    const peso = document.getElementById("peso").value;
    
    const campos = {name, jaula, tipo, peso};
    
    const config = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(campos)
    };
    fetch("/guardar",config).then((res) => console.log(res));
    fetch("/mostrar").then((res) => res.json()).then((data) => mostrarTabla(data));
})

function mostrarTabla(data) {
  const tbody = document.getElementById("tablaAnimales");
  tbody.innerHTML = "";
    console.log(data);
  data.forEach((animal) => {
    const tr = document.createElement("tr");
    tr.classList.add(
      "border-b",
      "border-gray-700",
      "hover:bg-gray-700",
      "transition-colors"
    );

    tr.innerHTML = `
        <td class="px-4 py-2">${animal.nombre}</td>
        <td class="px-4 py-2">${animal.jaula}</td>
        <td class="px-4 py-2">${animal.tipo}</td>
        <td class="px-4 py-2">${animal.peso.toFixed(2)}</td>
      `;

    tbody.appendChild(tr);
  });

  const tbody1 = document.getElementById("tablaAnimalesfiltrado1");
  tbody1.innerHTML = "";
    console.log(data);
  data.filter(animal => animal.jaula==5 && animal.peso <=3).forEach((animal) => {
    const tr = document.createElement("tr");
    tr.classList.add(
      "border-b",
      "border-gray-700",
      "hover:bg-gray-700",
      "transition-colors"
    );

    tr.innerHTML = `
        <td class="px-4 py-2">${animal.nombre}</td>
        <td class="px-4 py-2">${animal.jaula}</td>
        <td class="px-4 py-2">${animal.tipo}</td>
        <td class="px-4 py-2">${animal.peso.toFixed(2)}</td>
      `;

    tbody1.appendChild(tr);
  });

  const tbody2 = document.getElementById("tablaAnimalesfiltrado2");
  tbody2.innerHTML = "";
    console.log(data);
  data.filter(animal => animal.tipo == "felinos" || animal.tipo == "felino" && animal.jaula >=2 && animal.jaula <=5).forEach((animal) => {
    const tr = document.createElement("tr");
    tr.classList.add(
      "border-b",
      "border-gray-700",
      "hover:bg-gray-700",
      "transition-colors"
    );

    tr.innerHTML = `
        <td class="px-4 py-2">${animal.nombre}</td>
        <td class="px-4 py-2">${animal.jaula}</td>
        <td class="px-4 py-2">${animal.tipo}</td>
        <td class="px-4 py-2">${animal.peso.toFixed(2)}</td>
      `;

    tbody2.appendChild(tr);
  });
  
  const tbody3 = document.getElementById("tablaAnimalesfiltrado3");
  tbody3.innerHTML = "";
    console.log(data);
  data.filter(animal => animal.jaula==4 && animal.peso <= 120).forEach((animal) => {
    const tr = document.createElement("tr");
    tr.classList.add(
      "border-b",
      "border-gray-700",
      "hover:bg-gray-700",
      "transition-colors"
    );

    tr.innerHTML = `
        <td class="px-4 py-2">${animal.nombre}</td>
        <td class="px-4 py-2">${animal.jaula}</td>
        <td class="px-4 py-2">${animal.tipo}</td>
        <td class="px-4 py-2">${animal.peso.toFixed(2)}</td>
      `;

    tbody3.appendChild(tr);
  });
}
