document.getElementById("pag3").addEventListener('mouseenter', () =>{//con este evento muestro la imagen y ya se le asigna una id para despues mostrarla
    const img = document.createElement("img");
    img.src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwfGB6dUnr2_mIK2bbLG3JM0IWyfATg0efwQ&s";
    img.id="gato";
    document.body.appendChild(img);
});
document.getElementById("pag3").addEventListener('mouseleave', () =>{//con este otro evento saco la imagen 
    const img = document.getElementById("gato");
    document.body.removeChild(img);
});