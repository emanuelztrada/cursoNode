const debug = require('debug')('app:inicio');
// const dbDebug = require('debug')('app:db'); 
const express = require('express');
const config = require('config');
const morgan = require('morgan');
const logger = require('./logger');
const Joi = require('joi');
// creamos una instancia
const app = express();

//use es una funcion de express, esto es un middleware
app.use(express.json());//body 
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// http://localhost:3000/prueba.txt
//Al momento de ejecturar uno de las funciones de ruta de express
// app.use(function(req, res, next){
//     console.log('Logging'); 
//     next();
// })
// app.use(logger); 
// app.use(function(req, res, next){ 
//     console.log('Autenticando...');
//     next();
// })

//Configuracion de entornos
console.log('Aplicacion: ' + config.get('nombre'));
console.log('DB server: ' + config.get('configDB.host')); 

//Uso de middleware de tercero - Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny')); 
    // console.log('Morgan habilitado');
    debug('Morgan esta habilitado');
}

//trabajos con la base de datos ejemplo
debug('Conectando con la db...'); 


const usuarios = [
    {id:1, nombre:'Emanuel'},
    {id:2, nombre:'Josue'},
    {id:3, nombre:'Celano'}
]

// get ---------------------------------------------------------------------------
app.get('/', (req, res) =>{
    res.send('Hola mundo desde express');
}); //peticion

app.get('/api/usuarios', (req, res)=>{
    // res.send(['Grover', 'Luis', 'Ana']);
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res)=>{
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
    }else {
        res.send(usuario);
    }
}); 

app.get('/api/usuarios/:id/:year/:mes', (req, res)=>{
    // res.send(req.params);
    res.send(req.query); //Para obtener un parametro de nuestra ruta
});

// Post ---------------------------------------------------------------------------
app.post('/api/usuarios', (req, res)=>{

    // let body = req.body; 
    // console.log(body.nombre);
    // res.json({
    //     body
    // })
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    const {error, value} = schema.validate({ nombre: req.body.nombre});
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message;
        // const msj = error.details[0].context.key
        res.status(400).send(mensaje);
    }
    // if(!req.body.nombre || req.body.nombre.length <= 2){
    //     //400 Bad request
    //     res.status(400).send('Debe ingresar algun nombre, que tenga minimo 3 letras');
    //     //return para que termine y no cree el usuario
    //     return; 
    // }
    

}); //envio datos

// Puth ---------------------------------------------------------------------------

app.put('/api/usuarios/:id', (req, res) =>{
    //Encontrar si existe el objeto usuario
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if(!usuario) res.status(404).send('El usuario no fue encontrado');

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    const {error, value} = schema.validate({ nombre: req.body.nombre});
    if(error){
        const mensaje = error.details[0].message;
        // const msj = error.details[0].context.key
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre; 
    res.send(usuario);

}); //actualizacion



const port = process.env.PORT || 3000; 

//En que puerto sera escuchado
app.listen(port, () =>{
    console.log(`Conectado ${port}..`);
})

// app.delete(); //eliminacion

