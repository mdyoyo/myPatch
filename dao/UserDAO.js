/**
 * Created by chen on 17/8/30.
 */
//数据库
var User = require('../models/User.js').User;

var UserDAO = function() {};
//新增用户到数据库
UserDAO.prototype.addUser = function (obj, success, fail) {
    User.create({
        username: obj.username,
        password: obj.password,
        level: obj.level,
        status: obj.status,
        create_time: obj.create_time
    }).then(success).catch(fail);
};
//检查用户名重复
UserDAO.prototype.findUserByName = function (obj, success, fail) {
    User.findOne({
        where: {
            username: obj.toString()
        }
    }).then(success).catch(fail);
};
//分页获取
UserDAO.prototype.getUserByLimit = function (obj, success, fail) {
    User.findAndCountAll({
        offset: (obj.currentPage - 1) * obj.limit,
        limit: obj.limit
    }).then(success).catch(fail);
};
//更新某个字段的值
UserDAO.prototype.updateUserStatus = function (id, value, success, fail) {
    User.update({
        status: value
    }, {
        where: {
            id: id
        }
    }).then(success).catch(fail);
};
UserDAO.prototype.updateUserLevel = function (id, value, success, fail) {
    User.update({
         level: value
    }, {
        where: {
            id: id
        }
    }).then(success).catch(fail);
};
UserDAO.prototype.updatePwd = function (username, value, success, fail) {
    User.update({
        password: value
    }, {
        where: {
            username: username
        }
    }).then(success).catch(fail);
};
module.exports = new UserDAO();

//检查用户名重复
//UserDAO.prototype.findUserByName = function (obj, success, fail) {
//    var querySql = "select * from user where username = ?";
//    var queryParams = obj.toString();
//    db.query(querySql, queryParams, callback);
//    user.findOne({ where: {username: obj.toString()} })
//        .then(success).catch(fail);
//};
/*
 // 根据id查询
 Project.findById(123).then(project => {
 // project will be an instance of Project and stores the content of the table entry
 // with id 123. if such an entry is not defined you will get null
 })

 // search for attributes
 Project.findOne({ where: {title: 'aProject'} }).then(project => {
 // project will be the first entry of the Projects table with the title 'aProject' || null
 })


 Project.findOne({
 where: {title: 'aProject'},
 attributes: ['id', ['name', 'title']]
 }).then(project => {
 // project will be the first entry of the Projects table with the title 'aProject' || null
 // project.title will contain the name of the project
 })

 */
//sequelize.query('SELECT * FROM projects WHERE status = ?',
//    { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(function(projects) {
//        console.log(projects)
//    });
