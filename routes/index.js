//creando rutas he exportandolas para la página principal 
const express = require('express');
//Modulo de rutas 
const router = express.Router();

//importamos express-validator
const {body} = require('express-validator/check');

//Importamos los controladores de los Proyectos
const proyectosController = require('../controllers/proyectoControllers');

//Importamos los controladores de las tareas
const tareasControllers = require('../controllers/tareasControllers');

//Importamos los controladores de los usuarios
const usuariosControllers = require('../controllers/usuariosControllers');

//Importamos el controlador de iniciar sesión
const authControllers = require('../controllers/authControllers');


//Para exportar el modulo
module.exports = function(){

    //Ruta para el home
    router.get('/', 
        authControllers.usuarioAutenticado,
        proyectosController.proyectosHome
    );
    
    //Ruta Nuevo proyecto
    router.get('/nuevo-proyecto', 
        authControllers.usuarioAutenticado,
        proyectosController.formularioProyecto
    );

    //Ruta formulario Post
    router.post('/nuevo-proyecto',
        authControllers.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);

    //Listar proyectos
    router.get('/proyectos/:url', 
        authControllers.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    // Mostrar proyecto para actualizar
    router.get('/proyecto/editar/:id', 
        authControllers.usuarioAutenticado,
        proyectosController.formularioEditar
        );

    //Actualizar proyecto
    router.post('/nuevo-proyecto/:id',
        authControllers.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actulizarProyecto);

    //Eliminar proyecto
    router.delete('/proyectos/:url', 
        authControllers.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );    

    //Para Agregar una tarea
    router.post('/proyectos/:url', 
        authControllers.usuarioAutenticado,
        tareasControllers.agregarTarea
    );

    //Actualizar estado de una tarea
    router.patch('/tareas/:id' , 
        authControllers.usuarioAutenticado,
        tareasControllers.cambiarEstadoTarea
    );

    //Eliminar tarea
    router.delete('/tareas/:id' , 
        authControllers.usuarioAutenticado,
        tareasControllers.eliminarTarea
    );

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosControllers.formCrearcuenta);
    router.post('/crear-cuenta', usuariosControllers.crearCuenta);
    router.get('/confirmar/:email', usuariosControllers.confirmarcuenta);

    //Iniciar Sesión
    router.get('/iniciar-sesion', usuariosControllers.formIniciarSesion);
    //Autenticar usuario
    router.post('/iniciar-sesion', authControllers.autenticarUsuario);

    //Cerrar sesión
    router.get('/cerrar-sesion', authControllers.cerrarSesion);

    // Reestablecer contraseña
    router.get('/reestablecer', usuariosControllers.formRestablecerPassword);
    router.post('/reestablecer', authControllers.enviarToken);
    router.get('/reestablecer/:token', authControllers.validarToken);
    router.post('/reestablecer/:token', authControllers.actualizarPassword);
        
    return router;
}