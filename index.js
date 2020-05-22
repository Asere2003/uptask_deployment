
//Creando servidor
const express = require('express');
const routes = require('./routes'); 
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//const expressValidator = require('express-validator');
//importando librería para validar formularios 
const flash = require('connect-flash');
//importando las funciones para usarlas en toda la aplicacíon 
const helpers = require('./helpers');
//Creando la coneccíon a la db
const db = require('./config/db');
//Importando passport para la autenticación
const passport = require('./config/passport');

require('dotenv').config({ path: 'variables.env' })



// Importando los modelos
require('./models/Proyectos');
require('./models/tareas');
require('./models/Usuarios');



//Método para crear la estructura en la base de datos.
db.sync()
    .then(() => console.log('conectado al servidor'))
    .catch(error => console.log(error));

//Crea una aplicacción de express(Servidor)
const app = express();

//Configuración archivos estaticos, le decimos donde están las hojas de estílos
app.use(express.static('public'));

//Habilitar Pug
app.set('wiew engie', 'pug');

//Habilitar body-parse para leer formularios
app.use(bodyParser.urlencoded({extended: true}));

//Añadir la carpeta de las vistas
app.set('views' , path.join(__dirname, './views') );

//Agregar connect-flash para si poder vlidar email y varios campos por parte del servidor
app.use(flash());

app.use(cookieParser());

//Agregar las sesiones nos permiten navegar entre distintas páginas sin identificarte
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());


//Pasar las variables para poder usarlas en todas partes de la palicación
app.use((req, res, next) => {
    //creando variables para que esten en toda la aplicación
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})

//Añadir las rutas 
app.use('/', routes());

// Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});




