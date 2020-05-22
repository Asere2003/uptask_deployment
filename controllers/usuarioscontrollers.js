//importamos el modelo de proyectos
const Proyecto = require('../models/Proyectos');

//importamos el modelo de usuarios
const Usuarios = require('../models/Usuarios');

const enviarEmail = require('../handlers/email');

exports.formCrearcuenta = (req, res) => {
    res.render('crearCuenta.pug', {
        nombrePagina : 'Crear Cuenta en Uptask'

    })
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion.pug', {
        nombrePagina : 'Inicia Sesión en Uptask',
        error
    })
}

exports.crearCuenta = async (req, res) => {
    //leer los datos
    //se puede leer asi por el request.body toma el nombre de los
    //name de los input
    const {email, password} = req.body;
    try {
        //Crear el usuario
        await Usuarios.create({
            email,
            password
        });

        //Crear una URL de confirmación
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //Crear el objeto de usuario
        const usuario = {
            email
        }
        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject : 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo : 'confirmar-cuenta'
        });
        //redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta.pug', {
            mensajes : req.flash(),
            nombrePagina : 'Crear Cuenta en Uptask',
            email,
            password
    
        })
    }

}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer.pug' , {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

exports.confirmarcuenta = async (req, res) => {
     const usuario = await Usuarios.findOne({
         where:{
             email: req.params.email
         }
     });

    // si no existe el usuario
     if(!usuario){
        req.flash('Error', 'no valido');
        res.redirect('/crear-cuenta');
     }
    usuario.activo = 1;
    await usuario.save(); 

    req.flash('Correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}
