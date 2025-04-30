let timeout;
document.body.addEventListener('mousemove', () => {
  document.getElementById("evento").textContent = "El mouse se esta moviendo.";
      
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    document.getElementById("evento").textContent = "El mouse esta quieto.";
  }, 100);
});