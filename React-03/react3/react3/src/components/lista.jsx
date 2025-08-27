useEffect(() => {
  fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(data => setUsuarios(data))
    .catch(err => alert(err));
}, []);
