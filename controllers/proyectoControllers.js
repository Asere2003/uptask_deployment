//importamos el modelo de proyectos
const Proyectos = require('../models/Proyectos');

//importamos el modelo de tareas
const Tareas = require('../models/tareas');


//Para las url mas cómodas de leer
const slug = require('slug');

exports.proyectosHome = async (req, res) => {
    //log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});  

    res.render('index.pug', {
        nombrePagina : 'Proyectos',
        proyectos
    });
};

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});  

    res.render('nuevoProyecto.pug', {
        nombrePagina : 'Nuevo proyecto',
        proyectos
    });
};

exports.nuevoProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});  
    //agregar a la consola lo que el usuario escriba
    //console.log(req.body);
    //Validar que tengamos algo en el input
    const {nombre} = req.body;
    //console.log('a ver si sale vacio el nombre : =>' + nombre);
    let errores = []; 

    if(!nombre){
        errores.push({'texto':'Agregar un nombre al proyecto'});
    }
    //si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto.pug',{
            nombrePagina : 'Nuevo Proyecto',
            proyectos,
            errores
        });
    }else{
        // recuperamos el usuario para  poder saber cuendo se crea un proyecto saber el usuario que lo crea y que vea solo sus proyectos
        const usuarioId = res.locals.usuario.id;
        // No hay errores insertamos el usuario
        await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
    }

}

exports.proyectoPorUrl = async (req, res, next) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});  

    const proyectoPromise = Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    });
    //Como la ejecución de una consulta no depende de la otra utilizamos un Promise y un solo await
    const [proyectos,proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas por proyecto
    const tareas = await Tareas.findAll({
        where : {
            proyectoId : proyecto.id
        }
        //Esto es para relacionar si nos hiciera falta el Proyecto y las tareas
        /*include: [
            {
                model : Proyecto
            }
        ]*/
    });


    if(!proyecto) return next();

    res.render('tareas.pug',{
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        tareas,
        proyectos
    })
}

exports.formularioEditar = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});  

    const proyectoPromise = Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    });

    //Como la ejecución de una consulta no depende de la otra utilizamos un Promise y un solo await

    const [proyectos,proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto.pug', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto    
    })

}

//Actualizar 
exports.actulizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}}); 

    //Validar que tengamos algo en el input
    const {nombre} = req.body;

    let errores = []; 

    if(!nombre){
        errores.push({'texto':'Agregar un nombre al proyecto'});
    }
    //si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto.pug',{
            nombrePagina : 'Nuevo Proyecto',
            proyectos,
            errores
        });
    }else{
        await Proyectos.update(
            {nombre : nombre},
            {where:{id:req.params.id}}
        );
        res.redirect('/');
    }

}

//Eliminar proyecto
exports.eliminarProyecto = async (req,res,next) => {
    //console.log(req);
    const {urlProyecto} = req.query;
    
    const resultado = await Proyectos.destroy({where: {url: urlProyecto}});

    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto eliminado correctamente');   
}

