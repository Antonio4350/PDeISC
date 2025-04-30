let timeout;
document.body.addEventListener('mousemove', () => {
  document.getElementById("evento").textContent = "El mouse se esta moviendo!!!!!!!!!!!!!!.";
      //predeterminadamente va a aparecer el evento en mouse quiero, cuando detecte lo contratio el evento mostrara que se mueve
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    document.getElementById("evento").textContent = "El mouse esta quieto.";
  }, 100);//este 100 es del delay que le puse por eso puede llegar a travarse si es mayor 
});