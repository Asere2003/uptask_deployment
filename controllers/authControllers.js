const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//Función para revisar si el usuario esta logado
exports.usuarioAutenticado = (req, res, next) => {

    //Si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    
    //Si no esta autenticado
    return res.redirect('/iniciar-sesion');
}


//Cerrar sesión
exports.cerrarSesion = (req, res) => {

    // Como hemos importado session pues la variable session existe en el contexto global de la aplicación
    // Solo la destruimos y listo
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); // al cerrar la sesion nos lleva a la página de iniciar cesión

    })

}

// Genera un Token si el usuario es valido
exports.enviarToken = async (req, res) => {
    // Verificamos que el usuario existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: {email}});

    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // Usuario existe(email-existe)
    // Creamos el token
    usuario.token = crypto.randomBytes(20).toString('hex');

    // Creamos la expiración(una hora)
    usuario.expiration = Date.now() + 3600000;

    // guardamos en la base de datos
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject : 'Password Reset',
        resetUrl,
        archivo : 'reestablecer-password'
    });

    req.flash('Correcto' , 'Se ha enviado un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

    
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    });

    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    res.render('resetPassword.pug', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

// Para actualizar Password
exports.actualizarPassword = async (req, res) => {  

    // Verifica Token valido y tambíen la expiración
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiration: {
                [Op.gte]: Date.now()
            }
        }
    });

    // verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No Valido'),
        res.redirect('/reestablecer.pug');
    }

    // hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiration = null;

    // Guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}