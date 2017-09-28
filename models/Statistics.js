var Sequelize = require('sequelize');
var sequelize = require('../util/seque_mysql.js');
var Stat = sequelize.define('stat', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    eventId: Sequelize.STRING(45),         //事件id
    key_appversion: Sequelize.STRING(10), //基线版本
    key_patch_version:  Sequelize.STRING(10),   //patch版本
    key_etime: Sequelize.STRING(45),       //上报时间
    key_targetsdk: Sequelize.STRING(5),    //target23
    key_devid: Sequelize.STRING(45),       //设备id
    key_hw: Sequelize.STRING(200),         //硬件信息
    key_storage_size: Sequelize.STRING(45),//剩余可用空间
    key_error_code: Sequelize.STRING(5),   //错误码
    key_error_msg: Sequelize.STRING(45),   //错误信息
    key_patch_time: Sequelize.STRING(45),  //时间上报
    patch_success_version: Sequelize.STRING(10)  //成功version
}, {
    timestamps: false,
    freezeTableName: true //表名不用复数
});
Stat.sync({
    force: false
});
exports.Stat = Stat;




