import {Estudiante} from "./estudiante.js";
let alumno = new Estudiante ("Jeronimo","Impecable","18");
alumno.saludar();

import { Alfajor } from "./alfajor.js";
let alfajor = new Alfajor ("Impecable","Bufet","5gm",1500);
console.log(alfajor);
alfajor.precio=3000;
console.log(alfajor.precio);