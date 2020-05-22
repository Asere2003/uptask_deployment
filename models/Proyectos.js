//Nos traemos una instancia del orm que se va a autilizar
const Sequelize = require('Sequelize');

//Para generar id unicos y añadirselos a las url
const  shortid = require('shortid');

//Para las url mas cómodas de leer
const slug = require('slug');

//Nos traemos la cofiguraocion de la bbdd
const db = require('../config/db');

//Definiendo el modelo
const Proyectos = db.define('proyectos' , {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: Sequelize.STRING(100),
    url : Sequelize.STRING(100)

},
{
    hooks : {
        beforeCreate(proyecto){
            const url = slug(proyecto.nombre).toLocaleLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
}
);

module.exports = Proyectos;