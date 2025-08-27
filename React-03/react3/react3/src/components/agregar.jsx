function addUsuario(usuario) {
  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  }).then(() => window.location.href = "/");
}
