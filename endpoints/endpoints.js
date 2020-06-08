/*---USUARIOS----*/

const { Router } = require('express');
const router = Router();
const lib = require('./middlewares');
var multer  = require('multer');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../db/conexion');

const jwt = require('jsonwebtoken');
const llave = "v*4cl0s/-Utpctt";
const bcrypt  = require('bcrypt');




//Conexión Multer
let storage= multer.diskStorage({
    //cb es el callback
    //Donde se guardan los archivos
    destination:(req,file,cb)=>{
      cb(null,'./upload');
    },
    filename:(req,file, cb)=>{
      //Nombre del fichero
      cb(null,file.filename="-"+Date.now()+file.originalname);
    }
  });
  const upload= multer({storage});



//1. Agregar un usuario
router.post('/registro', lib.usuarioregistrado, (req, res) => {
    sequelize.query('INSERT INTO usuarios (nombre_apellido, correo, telefono, direccion, contrasena, rol_id) VALUES (?, ?, ?, ?, ?, ?)',
        { replacements: [req.body.nombre_apellido, req.body.correo, req.body.telefono, req.body.direccion, req.contrasenaincriptada, req.body.rol_id] }
    ).then(function (results) {
 
        res.status(201).json({ "ok": `Usuarios ${req.body.correo} fue regitrado con éxito` });
    }).catch((err) => {
        console.log(err);
    });
});

//2. Iniciar sesión
router.post('/login', lib.validaradatosacceso, (req, res) => {
    console.log("Logueado");
    let rol = req.rol;
    let usuario = req.body.usuario;
    let token = jwt.sign({ usuario, rol }, llave);
    res.json({ "toke": token, "Ok": "Usuario logueado" });
});


/*----PRODUCTOS----*/

//1. Agregar un producto por la opción form-data
router.post('/productos', lib.permisosusuario,upload . single ( 'file' ), (req, res) => {
    sequelize.query('INSERT INTO productos (nombre, cantidad, precio, imagen) VALUES (?, ?, ?, ?)',
        { replacements: [req.body.nombre, req.body.cantidad, req.body.precio, req.file.path] }
    ).then(function (results) {
        console.log(results);
        res.status(201).json({ "Ok": "Producto registrado con éxito" });
    }).catch((err) => {
        res.json(err);
    });
});

//2. Consultar todos los  productos, debe estar logueado
router.get('/productos', lib.autenticarusuario, (req, res) => {
    sequelize.query(`SELECT * FROM productos `,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (results) {
        if (results.length > 0) {
            res.json(results);
        }
        else {
            res.status(204).json({ error: "No hay productos disponibles" });
        }
    }).catch((err) => {
        res.json(err);
    });
});

//3. Consultar un producto
router.get('/productos/:id', lib.autenticarusuario, (req, res) => {
    sequelize.query(`SELECT * FROM productos where id=${req.params.id}`,
        { type: sequelize.QueryTypes.SELECT }
    ).then(function (results) {
        if (results.length > 0) {
            res.json(results);
        }
        else {
            res.status(204).json({ error: "Producto no encontrado" });
        }
    }).catch((err) => {
        res.json(err);
    });
});

//4. Actualizar producto VER
router.put('/productos/:id', lib.permisosusuario, (req, res) => {
    sequelize.query("UPDATE productos SET nombre=?,cantidad=?,precio=? WHERE id=?",
        { replacements: [req.body.nombre, req.body.cantidad, req.body.precio, req.params.id] }
    ).then(function (results) {
        console.log(results),
            res.json({ "ok": `Se ha actualizado con éxito el producto` });
    }).catch((err) => {
        res.json(err);
    });
});


//5. Eliminar el producto
router.delete('/productos/:id', lib.permisosusuario, (req, res) => {
    sequelize.query(`DELETE FROM productos where id=${req.params.id}`
    ).then(function (results) {
        console.log(results),
            res.json({ "ok": `El producto se ha eliminado con éxito` });
    }).catch((err) => {
        if (err.parent.errno == 1451) {
            res.json({ "error": `No se puede eiliminar, este producto ya se encuentra asociado a pedidos` });
        }
        else
            res.json(err);
    });
});

//6. Consultar todos los usuarios
//6.1 Los Clientes logueados solo tengan acceso a su información personal.
router.get('/usuarios', lib.autenticarusuario, (req, res) => {

    console.log(req.rol, req.usuario);

    //Muestra todos los usuarios 
    if (req.rol == 1) {
        sequelize.query('SELECT usuarios.nombre_apellido, usuarios.correo, usuarios.telefono, usuarios.direccion, rol.categoria FROM usuarios JOIN rol ON usuarios.rol_id=rol.id',
            { type: sequelize.QueryTypes.SELECT }
        ).then(function (results) {
            console.log(results);
            res.json(results);
        });
    }
    else if (req.rol == 2) {
        sequelize.query(`SELECT usuarios.nombre_apellido, usuarios.correo, usuarios.telefono, usuarios.direccion, rol.categoria FROM usuarios JOIN rol ON usuarios.rol_id=rol.id WHERE rol.id=2 AND usuarios.correo=?`,
            { replacements: [req.usuario], type: sequelize.QueryTypes.SELECT }
        ).then(function (results) {
            console.log(results);
            res.json(results);
        });
    };
});

//7. Consultar todos los pedidos
//7.1 El admin puede ver todos los pedidos pero el usuario solo su info personal.
router.get('/pedidos', lib.autenticarusuario, (req, res) => {

    if (req.rol == 1) {
        //Muestra todos los usuarios
        sequelize.query('SELECT pedidos.id AS Numero_pedido, usuarios.nombre_apellido, usuarios.correo, pedidos.fecha, pedidos.total, estado.nombre as Estado FROM usuarios JOIN pedidos ON pedidos.id_usuario=usuarios.id JOIN estado ON pedidos.id_estado=estado.id',
            {
                type: sequelize.QueryTypes.SELECT
            }
        ).then(function (results) {
            console.log(results);
            res.json(results);
        });
    }
    //Solo muestra los pedido del usuario
    else if (req.rol == 2) {
        sequelize.query(`SELECT pedidos.id AS Numero_pedido, usuarios.nombre_apellido, usuarios.correo, pedidos.fecha, pedidos.total, estado.nombre FROM usuarios JOIN pedidos ON pedidos.id_usuario=usuarios.id JOIN estado ON pedidos.id_estado=estado.id WHERE usuarios.correo=?`,
            {
                replacements: [req.usuario],
                type: sequelize.QueryTypes.SELECT
            }
        ).then(function (results) {
            console.log(results);
            res.json(results);
        });
    };
});

/*---PEDIDOS---*/
//8. Agregar un pedido 

router.post('/pedidos', lib.autenticarusuario, (req, res) => {

    let fechaActual = new Date();

    //Obtner el id que corresponde al correo 
    sequelize.query(`SELECT id, rol_id FROM usuarios WHERE correo="${req.usuario}"`, { type: sequelize.QueryTypes.SELECT }
    ).then(function (results) {
        if (results.length > 0) {
            fechaActual = new Date();
            sequelize.query('INSERT INTO pedidos (id_usuario, fecha,total,id_estado) VALUES (?, ?, ?, ?)',
                { replacements: [results[0].id, fechaActual, 0, 1] }
            ).then(function (results) {
                res.status(201).json({ "ok": `Nuevo pedido agregado al usuario ${req.usuario}` });
            }).catch((err) => {
                res.json(err);
            });
        };
    });

});


//9. Agregar un producto al pedido
router.post('/pedidos/:id/productos', lib.autenticarusuario, (req, res) => {
    //HACERLO EN UNA SOLA CONSULTA
    //Validar que el usuario tenga ese pedido
    sequelize.query(`SELECT * FROM usuarios JOIN pedidos ON usuarios.id=pedidos.id_usuario WHERE usuarios.correo=? AND pedidos.id=?`,
        {
            replacements: [req.usuario, req.params.id],
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function (results) {
        //Tiene el pedido
        if (results.length > 0) {
            //Obtener el id del usuario
            //let idUsuario= results[0].usuario.id;
            console.log(results);

            sequelize.query('INSERT INTO pedido_productos (id_producto, id_pedido, cantidad) VALUES (?, ?, ?) ',
                { replacements: [req.body.id_producto, req.params.id, req.body.cantidad] }
            ).then(function (results) {
                console.log(results);
                res.status(201).json({ "ok": `Producto agregado al pedido # ${req.params.id}` });
            });
        }
        else {
            res.status(204).json({ "error": "Usuario no tiene asociado el pedido" });
        }
    });
});


//10.Ver todos los productos de un pedido
//Si el rol es admin puede ver culquiera, si es cliente solo sus pedidos
router.get('/pedidos/:id', lib.autenticarusuario, (req, res) => {

    //Validar que rol tiene
    if (req.rol == 1) {
        //Muestra todos los usuarios
        sequelize.query(`SELECT pedidos.id, usuarios.correo, productos.nombre, pedido_productos.cantidad FROM usuarios JOIN pedidos ON usuarios.id=pedidos.id_usuario JOIN pedido_productos ON pedidos.id=pedido_productos.id_pedido JOIN productos ON pedido_productos.id_producto=productos.id WHERE pedidos.id=?`
            , { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT }
        ).then(function (results) {

            if (results.length > 0) {
                console.log(results);
                res.json(results);
            }

            else { res.json({ "Mensaje": "El pedido aún no tiene productos relacionados" }) }

        });
    }
    //Solo muestra el pedido del usuario
    else if (req.rol == 2) {

        //Validar si el pedido pertenece al cliente que lo consulta
        sequelize.query(`SELECT pedidos.id AS id_pedido, usuarios.correo, productos.nombre as producto, pedido_productos.cantidad FROM usuarios JOIN pedidos 
        ON usuarios.id=pedidos.id_usuario JOIN pedido_productos on pedidos.id=pedido_productos.id_pedido JOIN productos ON pedido_productos.id_producto=productos.id WHERE pedidos.id=? AND usuarios.correo=?`,
            { replacements: [req.params.id, req.usuario], type: sequelize.QueryTypes.SELECT }
        ).then(function (results) {
            if (results.length > 0) {
                console.log(results);
                res.json(results);
            }
            else {
                res.status(400).json({ "error": "No hay productos asociados al pedido o el Usuario no autorizado a ve la información ya que no tiene asociado ese pedido" });
            }
        }).catch((err) => {
            res.json(err);
        });
    };
});


//11. Actulizar el estado de un pedido.
router.patch('/pedidos/:id', lib.permisosusuario, (req, res) => {
    console.log(req.query.estado);
    sequelize.query(`UPDATE pedidos SET id_estado=${req.query.estado} WHERE id=${req.params.id}`).
    then(function (results) 
    {
            if(results[0].affectedRows==1){
                res.json({"OK":`Pedido #${req.params.id} actualizado `});
            }
            else{
                res.json({"error":`Pedido #${req.params.id} no fue actaulizado ya que tiene el mismo estado `});
            }
    }).catch((err) => {
        res.json(err);
    });
});


//12. Eliminar el pedido
router.delete('/pedidos/:id', lib.permisosusuario, (req, res) => {
    sequelize.query(`DELETE FROM pedidos where id=${req.params.id}`
    ).then(function (results) {
        console.log(results),
            res.json({ "ok": `El pedido se ha eliminado con éxito` });
    }).catch((err) => {
        res.json(err);

    });
});

module.exports=router;