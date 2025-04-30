function crear() {
    const $a = document.createElement("a");
    const $p = document.createElement("p");

    $a.href = "https://facebook.com";
    $a.textContent = "Facebook";

    $p.textContent = $a.href;
    $p.id = $a.href;

    document.body.appendChild($a);
    document.body.appendChild($p);
}

function href() {
    const $a = document.querySelectorAll("a");
    $a.forEach(a => {
        const oldHref = a.href;
        a.href = "https://google.com";
        a.textContent = "Google";

        const $p = document.getElementById(oldHref);
        if ($p) {
            $p.textContent = a.href;
            $p.id = a.href; // actualizar también el id
        }
    });
}
