# Delilah Resto API

En delilah resto encontrarás la forma de interacción entre el cliente y el administrador con los productos y pedidos.

El proyecto se encuentra realizado en node.js

## Para comenzar debes instalar los siguientes módulos:
* Express: npm i express
* Body Parser: npm i bodyParser
* jwt: npm i jsonwebtoken
* Sequelize: npm i sequelize
* mysql2: npm i mysql2
* bcrypt: npm i bcrypt
* multer: npm i multer
* path: npm i path

## Luego, crear la base de datos en Mysql Workbeanch, el arhivo se encuentra en: /db/scriptdb.sql:


##  Para realizar la conexión a la base de datos debes llenar la información correspondiente que se encuntra en /db/varibles

![](/imagenes/Conexionbd.jpg)

## Para iniciar el proyecto debes correr el siguiente comando:

```shell
    node index.js
```

Con Postam se podrán realizar los siguientes EndPoints (También lo puedes consultar en Swagger):

## USUARIOS

*Agregar un usuario*

**POST** /registro
```bash
http://localhost:3000/registro
```
*-----*

*Logueo*

**POST** /login
```bash
http://localhost:3000/login
```
*-----*

*El administrador podrá consultar todos los usuarios*

*Los Clientes solo tienen acceso a su información personal.*

**GET** /usuarios
```bash
http://localhost:3000/usuarios
```

## PRODUCTOS

*Agregar un producto, para esto se debe en postaman agregar la información en form-data*

**POST** /productos
```bash
http://localhost:3000/productos
```
*-----*

*Consultar todos los  productos*

**GET** /productos
```bash
http://localhost:3000/productos
```

*-----*

*Consultar un producto específico*

**GET** /productos/:id

```bash
http://localhost:3000/productos/4
```
*-----*

*Actualizar producto*

**PUT** /productos/:id

```bash
http://localhost:3000/productos/4
```

*-----*

*Eliminar producto*

**DELETE** /productos/:id

```bash
http://localhost:3000/productos/4
```

## PEDIDOS

*Consultar todos los pedidos*
*El admin puede ver todos los pedidos pero el usuario solo su info personal.*

**GET** /pedidos/

```bash
http://localhost:3000/pedidos
```
*Agregar un pedido*

**POST** /pedidos/

```bash
http://localhost:3000/pedidos
```
*-----*

*Agregar un producto al pedido*

**POST** /pedidos/:id/productos

```bash
http://localhost:3000/pedidos/3/productos
```
*-----*

*Ver todos los productos de un pedido*

*Si el rol es admin puede ver cualquiera, si es cliente solo sus pedidos*

**GET** /pedidos/:id

```bash
http://localhost:3000/pedidos/3
```
*-----*

*Actualizar el estado de un pedido.* ROLES 

**PATCH** /pedidos/:id/productos
    
```bash
http://localhost:3000/pedidos/1?estado=3
```
*-----*

*Eliminar producto*

**DELETE** /pedidos/:id

```bash
http://localhost:3000/pedidos/4
```
