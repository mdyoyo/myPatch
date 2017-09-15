var Sequelize = require('sequelize');
var sequelize = require('../util/seque_mysql.js');

var patchModel = sequelize.define('patch', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    version: Sequelize.STRING(10),  //版本号
    base_version: Sequelize.STRING(10), //基线包版本号
    size: Sequelize.DOUBLE(10,2),         //大小
    link: Sequelize.STRING(500),    //下载地址
    create_time: Sequelize.STRING(45),//创建时间
    desc: Sequelize.STRING(200),    //描述,200字以内
    status: Sequelize.INTEGER,      //状态,0-未下发,1-已下发
    op_user: Sequelize.STRING(20),   //操作用户名
    info_addr: Sequelize.STRING(200) //配置信息
}, {
    timestamps: false,
    freezeTableName: true //表名不用复数
});
patchModel.sync({
    force: false
});
exports.Patch = patchModel;

