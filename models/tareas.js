//Nos traemos el orm que estamos utilizando
const Sequelize = require('sequelize');

//Nos traemos una instancia de la bbdd
const db = require('../config/db');

//Importamos Pproyecytos para hace la relación entre tablas
const Proyectos = require('./Proyectos');

//Definiendo el modelo
const Tareas = db.define('tareas', {
    id:{
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea:Sequelize.STRING(100),
    estado:Sequelize.INTEGER(1)
});

// para que varias tareas pertenescan a un proyecto
Tareas.belongsTo(Proyectos);

module.exports = Tareas;

