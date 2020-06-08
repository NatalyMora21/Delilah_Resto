const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const bcrypt  = require('bcrypt');
const sequelize = require('../db/conexion');


//Middleware para validar que el usario aún no esté registrado
let usuarioregistrado = (req, res, next) => {
    sequelize.query(`SELECT * FROM usuarios WHERE correo="${req.body.correo}"`, { type: sequelize.QueryTypes.SELECT }
    ).then(function (results) {
        if (results.length > 0) {
            res.status(401).json({ "Error": "El Usuario ya se encuentra registrado" });
        }
        else {
            //Es un fragmento aleatorio que se usará para generar el hash asociado a la password
            bcrypt.hash(req.body.contrasena, 10, function(err, hash) {
                if (err) {
                return next(err);
                }
                req.contrasenaincriptada= hash;
                console.log(req.contrasenaincriptada);
                next();
                
             })
        }
    }).catch((err) => {
        res.json(err);
    });
};

//Middleware para validar que el usuario y contraseña estén incorrectos
let validaradatosacceso = (req, res, next) => {
    const { usuario, contrasena } = req.body;
    //sequelize.query(`SELECT * FROM usuarios WHERE correo="${usuario}" AND contrasena="${contrasena}"`,
    sequelize.query(`SELECT * FROM usuarios WHERE correo="${usuario}"`,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (results) {
        //Datos correctos
        if (results.length > 0) {

            bcrypt . compare ( req.body.contrasena,  results[0].contrasena, function ( err , result ) {   
                //  resultado == verdadero
                if(result){
                    req.rol=results[0].rol_id;
                    next();
                }
                else{
                    res.status(401).json({ "error": "Usuario o contraseña errados" });
                } 
            } ) ;



        }
        else {
            res.status(401).json({ "error": "Usuario o contraseña errados" });
        }

    }).catch((err) => {
        res.json(err);
    });
}

//Middleware para validar el tipo de usuarios
let permisosusuario = (req, res, next) => {
    try {
      
        let token = req.headers.authorization.split(' ')[1];
        console.log(token);
        //Si no es correcto va el catch
        let verificarcToken = jwt.verify(token, 'v*4cl0s/-Utpctt');
        console.log(verificarcToken.rol);
        if (verificarcToken) {
            if (verificarcToken.rol == 1) {
                req.usuario = verificarcToken;
                return next();
            }
            else {
                res.status(401).json({ "Error": "Usuario no tiene permisos para realizar esta acción" });
            }
        }
    }
    catch (err) {
        res.status(404).json({ "error": 'Error al validar el usuario' });
    }
};

//Validar el token
let autenticarusuario = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        //Devuelve el pyload
        let verificarcToken = jwt.verify(token, 'v*4cl0s/-Utpctt');

        //console.log(req.usuario);
        if (verificarcToken) {
            req.usuario = verificarcToken.usuario;
            req.rol = verificarcToken.rol
            return next();
        }
    }
    catch (err) {
        res.status(400).json({ "error": 'Error al validar el usuario' });
    }
};



module.exports = { usuarioregistrado, validaradatosacceso, permisosusuario, autenticarusuario};

