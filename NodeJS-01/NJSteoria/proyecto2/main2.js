const express = require ('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
});
app.get('/hola',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','hola.html'));
});
app.get('/hola2',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','hola2.html'));
});

app.listen(3000, ()=>{
    console.log("Puerto 3000");
});