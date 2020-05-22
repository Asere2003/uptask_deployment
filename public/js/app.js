//Como istalamos babel podemos utilizar la sintaxis del import
import proyecto from './modulos/proyectos.js';
import tarea from './modulos/tareas.js';
import {actualizarAvance} from './funciones/avance.js';

//similar al document.Rady
document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
})