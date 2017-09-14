var Sequelize = require('sequelize');
var sequelize = require('../util/seque_mysql.js');
var User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username:  Sequelize.STRING(20),   //用户名
    password: Sequelize.STRING(45),    //密码
    level: Sequelize.INTEGER,          //权限级别，0-普通（默认），1-管理员
    status: Sequelize.INTEGER,         //当前状态，0-正常（默认），1-关闭
    create_time: Sequelize.STRING(45)  //注册时间
}, {
    timestamps: false,
    freezeTableName: true //表名不用复数
});
User.sync({
    force: false
});
exports.User = User;




