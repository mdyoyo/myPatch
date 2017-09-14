var Sequelize = require('sequelize');
var sequelize = require('../util/seque_mysql.js');

var baseModel = sequelize.define('base', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    version: Sequelize.STRING(10),     //版本号
    create_time: Sequelize.STRING(45)  //注册时间
}, {
    timestamps: false,
    freezeTableName: true //表名不用复数
});
baseModel.sync({
    force: false
});
exports.Base = baseModel;

