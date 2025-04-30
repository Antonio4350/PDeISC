function crear() {
    const $a = document.createElement("a");
    const $p = document.createElement("p");//creo a y p 

    $a.href = "https://facebook.com";//pongo que a vale la pag de face
    $a.textContent = "Facebook";

    $p.textContent = $a.href;
    $p.id = $a.href;//p va a empezar valiendo lo mismo

    document.body.appendChild($a);
    document.body.appendChild($p);//se muestra
}

function href() {
    const $a = document.querySelectorAll("a");//recupero y con foreach cambio la url vieja por la de google
    $a.forEach(a => {
        const oldHref = a.href;
        a.href = "https://google.com";
        a.textContent = "Google";

        const $p = document.getElementById(oldHref);
        if ($p) {
            $p.textContent = a.href;//actualizo con el nuevo href a no ser que sea nulo 
            $p.id = a.href;
        }
    });
}
