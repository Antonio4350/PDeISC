const express = require("express");
const app = express();
const path = require("path");//utilizamos el express y el path para el serv
const port =3000;
const personas =[];

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));//carpeta estatica publica donde vamos a estar trabajando

app.post('enviar',(req,res)=>{
    const persona ={
        user:req.body.user,contra:req.body.contra,
    }
    personas.push(persona);
    console.log(personas);
    res.send('persona agregada <a href="/">voler</a>');
});

app.get('/personas', (req,res)=>{
    let lista= '<h1>Lista de Personas</h1><ul>'
    personas.forEach(p=>{
        lista+='<li>'+p.user+ ' '+ p.contra+ '</li>';
    })
    lista += '</ul><a href="/>volver</a>';
    res.send(lista);
});


app.listen(port, () => {//puerto
  console.log("http://localhost:3000");
});
