//Importamos los modelos
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/tareas');

exports.agregarTarea= async (req, res, next) => {

    const proyecto = await Proyectos.findOne({
        where: {url : req.params.url}
    });
    //Leer el valor del input
    const {tarea} = req.body;

    //comprobamos que el input no esta vacio
    let errores = [];

    const proyectos = await Proyectos.findAll();  

    if(!tarea){
        errores.push({'texto':'Agregar un nombre a la Tarea'});
    }

    //Ocmprobamos que no haya errores
    if(errores.length > 0 ){
        res.render('tareas.pug',{
            nombrePagina : 'Tareas del Proyecto',
            proyectos,  
            proyecto,
            errores
        });
    }else{
        //estado 0 = incompleto y id del proyecto
        const estado = 0;
        const proyectoId = proyecto.id;

        //Insertamos la tarea 
        const resultado = await Tareas.create({tarea, estado, proyectoId});

        

        if(!resultado){
            return next();
        }
        //redirecionar al inicio
        res.redirect(`/proyectos/${req.params.url}`);
        }
}  

exports.cambiarEstadoTarea = async (req, res, next) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({where : {id}});

    //Cambiar estado
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();

    //Comprobamos si no hay resultados y ejecutamos return next para que no se ejecute la respuesta
    if(!resultado) return next();

    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req, res, next) => {
    const {id} = req.params;

    //Eliminando la tarea
    const resultado = await Tareas.destroy({where : {id}})

    if(!resultado) return next();


    res.status(200).send('Tarea Eliminada Correctamente');

}