//Importamos passport para la auteticación de usuarios
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Hacer referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// local strategy - Login con credenciales propias (usuario y password)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password 
        //(reescribimos las propiedades para decirle que el email es el usuario, lo ponemos como en el modelo)
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        // relizamos la consulta para saber si estan bien las credenciles
        async (email, password, done) => {
           //por si el usurio no existe en la bbdd
           try {
               const usuario = await Usuarios.findOne({
                   where:{
                       email,
                       activo: 1
                    }
               })
               //El usuario existe, pero el password es incorrecto
               if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    })
               }
               // El email y el password son correctos
               return done(null, usuario);
           } catch (error) {
               //ESE usuario no existe
               return done(null, false, {
                   message: 'Esa cuenta no existe'
               })
           }
        }
    )
);

//Se requiere serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Desserializar el usuario
passport.deserializeUser((usuario,callback) => {
    callback(null, usuario);
});

module.exports = passport;
