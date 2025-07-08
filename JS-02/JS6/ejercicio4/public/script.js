fetch("/api/alumnos")//uso el fetch para mostrar los datos, alumnos y edad
  .then(res => res.json())
  .then(alumnos => {
    const ul = document.getElementById("listaAlumnos");
    alumnos.forEach(alumno => {
      const li = document.createElement("li");
      li.textContent = `${alumno.nombre} (Edad: ${alumno.edad})`;
      ul.appendChild(li);
    });
  })
  .catch(() => {//muestro error en la lista 
    document.getElementById("listaAlumnos").textContent = "error al cargar alumnos";
  });