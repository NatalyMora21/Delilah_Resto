const db = require('./variables');
const Sequelize = require('sequelize');


const sequelize=new Sequelize(db.confdb_name,db.confdb_user,db.confdb_contraseña,{
    host: db.confdb_host,
    dialect: 'mysql',
    port: db.confdb_puerto,
    dialectOptions:{
        multipleStatements: true
    }
});

module.exports = sequelize;
