document.getElementById("pag3").addEventListener('mouseenter', () =>{
    const img = document.createElement("img");
    img.src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwfGB6dUnr2_mIK2bbLG3JM0IWyfATg0efwQ&s";
    img.id="gato";
    document.body.appendChild(img);
});
document.getElementById("pag3").addEventListener('mouseleave', () =>{
    const img = document.getElementById("gato");
    document.body.removeChild(img);
});