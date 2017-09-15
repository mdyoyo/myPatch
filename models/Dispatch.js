var Sequelize = require('sequelize');
var sequelize = require('../util/seque_mysql.js');

var dispatchModel = sequelize.define('dispatch', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    patch_version: Sequelize.STRING(10),   //版本号
    base_version: Sequelize.STRING(10),   //版本号
    dispatch_time: Sequelize.STRING(45),   //下发时间
    type: Sequelize.INTEGER,       //类型,0-全量,10-设备号,11-设备尾号,12-android版本
    op_user: Sequelize.STRING(20),   //下发操作人
    params: Sequelize.STRING(20)      //参数,和下发类型对应
}, {
    timestamps: false,
    freezeTableName: true //表名不用复数
});
dispatchModel.sync({
    force: false
});
exports.Dispatch = dispatchModel;

