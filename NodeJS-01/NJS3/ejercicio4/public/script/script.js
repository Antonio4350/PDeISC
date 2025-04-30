document.getElementById("btn").addEventListener("click",()=>{
    const $a = document.createElement('a')
    $a.href="https://www.facebook.com/";
    $a.textContent="Facebook";
    $a.target="_blank";
    document.body.appendChild($a);
})