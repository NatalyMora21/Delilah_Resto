const express = require('express');
const bodyParser = require('body-parser');

let app = express();
//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//Rutas
app.use(require('./endpoints/endpoints.js'));
//Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado!');
});

