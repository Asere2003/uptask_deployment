const Sequelize = require('sequelize');

const db = require('../config/db');

const Proyecto = require('../models/Proyectos');

const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            isEmail:{
                msg : 'Agrega un correo valido'
            },
            notEmpty : {
                msg : 'El e-mail no puede ir vacio'
            }
        },
        unique: {
                arg: true,
                msg: 'Usuario ya registrado'
            }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate : {
            notEmpty : {
                msg : 'El password no puede ir vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING, 
    expiration: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));

        }
    }
});

//métodos personalizados con el .prototype nos aseguramos que todos los usuarios creados dispongan de esta función
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

//Los usuarios pueden crear varios proyectos
Usuarios.hasMany(Proyecto);

// Exportamos el proyecto
module.exports = Usuarios;

