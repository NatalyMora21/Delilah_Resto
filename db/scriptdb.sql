CREATE DATABASE delilah_Resto;
USE delilah_Resto;

CREATE TABLE rol (
 id 			INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 categoria      VARCHAR(60) NOT NULL
);
CREATE TABLE estado(
 id 			INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 nombre         VARCHAR(20) NOT NULL
);

CREATE TABLE usuarios (
 id 			INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 nombre_apellido VARCHAR(60) NOT NULL,
 correo 		VARCHAR(60) NOT NULL ,
 telefono		VARCHAR(40) NOT NULL,
 direccion      VARCHAR(60) NOT NULL,
 contrasena		VARCHAR(60) NOT NULL,
 rol_id         INT NOT NULL,
 FOREIGN KEY (rol_id) REFERENCES rol(id)
);

CREATE TABLE productos(
 id 			INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 nombre         VARCHAR(60) NOT NULL,
 cantidad       INT NOT NULL,
 precio         INTEGER NOT NULL,
 imagen         VARCHAR(40) NOT NULL
);

CREATE TABLE pedidos (
 id 			INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 id_usuario     INT NOT NULL,
 fecha          DATE NOT NULL,
 total 			INTEGER,
 id_estado      INT NOT NULL,
 FOREIGN KEY ( id_estado) REFERENCES estado(id),
 FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);



CREATE TABLE pedido_productos (
 id 			INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
 id_producto    INT NOT NULL,
 id_pedido      INT NOT NULL,
 cantidad       INT NOT NULL,
  FOREIGN KEY (id_producto) REFERENCES productos(id),
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id)
);

/*CREACIÓN DEL ESTADOS Y ROLES*/

INSERT INTO ESTADO Values (1,"Pendiente"), (2,"En prceso"),(3,"Terminado");
INSERT INTO ROL Values (1,"Administrador"), (2,"Cliente");



