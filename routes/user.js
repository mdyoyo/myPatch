//用户相关的路由
var crypto = require('crypto');
var moment = require('moment');
var UserDAO = require('../dao/UserDAO.js');

/******登录 start******/
exports.getLoginPage = function(req, resp) {
    console.log('进入登录页');
    resp.render('user/mylogin');
};
exports.checkLogin = function(req, resp) {
    console.log('检查登录');
    var username = req.query.username;
    var password = req.query.password;
    var status = false;
    UserDAO.findUserByName(username,
        function(user) {
            if (user == null) {
                console.log('check login, 用户不存在');
                status = false;
            } else {
                //校验密码
                var md5 = crypto.createHash('md5'),
                    md5Password = md5.update(password).digest('hex');
                console.log(user.password, md5Password);
                if (user.password !== md5Password) {
                    console.log('密码错误');
                    status = false;
                } else {
                    console.log('登录成功');
                    status = true;
                    user.password = null;
                    delete user.password;
                    req.session.user = user; //保存到session中
                }
            }
            resp.send({
                'status' : status
            })
        },
        function(err) {
            console.log('check login, query failed:', err.message);
            return resp.redirect('/user/mylogin');
        });
};
exports.checkNoLogin = function(req, resp, next) {
    if (!req.session.user) {
        console.log('未登录');
        return resp.redirect('/login');
    }
    next();
};
exports.checkHighLevel = function(req, resp, next) {
    if (req.session.user.level === 0) {
        console.log('无权查看');
        return;
    }
    next();
};
exports.checkNormalStatus = function(req, resp, next) {
    if (req.session.user.status === 1) {
        console.log('状态异常');
        return;
    }
    next();
};
/******登录 end******/
/******注册 start******/
exports.getRegisterPage = function(req, resp) {
    console.log('进入注册页');
    resp.render('user/myregister');
};
exports.doRegisterUser = function(req, resp) {
    //req中取出表单数据
    console.log("吱一声以示存在");
    var username = req.body.username,
        password = req.body.password;
    var md5 = crypto.createHash('md5'),
        md5Password = md5.update(password).digest('hex');
    var insertUser = {
        username: username,
        password: md5Password,
        level: 0,
        status: 0,
        create_time: parseInt(Date.now() / 1000)
    };
    UserDAO.addUser(insertUser, function (result) {
            console.log("insert success:", result.dataValues.id);
            //route到登录页
            resp.redirect('/login');
        }, function (err) {
            if (err) {
                console.log("insert failed:", err.message);
            }
        }
    );
};
exports.checkNameRepeat = function (req, resp) {
    console.log('检查用户名重复');
    var username = req.query.username;
    UserDAO.findUserByName(username, function(result) {
        var existed = false;
        var msg = '恭喜，用户名可用';
        console.log('query success', result);
        if (result != null) {
            console.log('用户名已存在');
            existed = true;
            msg = '用户名已存在，请修改';
        }
        resp.send({
            'status' : existed,
            'msg' : msg
        });
    },function(err) {
        console.log("check username, query failed:", err.message)
        //TODO 优化提示
        return resp.redirect('/register');
    })
};
/******注册 end******/

/******成员列表 start******/
exports.getUsers = function(req, resp) {
    //todo 从数据库中查询所有用户
    console.log('获取成员列表');
    var currentPage = req.query.page;
    if (currentPage == null || currentPage < 1) {
        currentPage = 1;
    }
    var page = {
        limit: 5,
        currentPage: currentPage
    };
    UserDAO.getUserByLimit(page, function(result) {
        var totalCount = result.count;
        var userList = result.rows;
        console.log("query users success:", totalCount);
        page['totalPages'] = Math.ceil(totalCount / 5);    //总页数
        page['numberOf'] = 5;//一页的个数
        return resp.render('user/list', {
            user: req.session.user,
            userList: userList,
            page: page,
            moment: moment,
            totalCount: totalCount
        });
    }, function (err) {
        console.log("query users failed:", err.message);
        return resp.render('user/list', {
            user: req.session.user,
            userList: null,
            page: null,
            moment: moment,
            totalCount: 0
        });
    });
};
exports.dealUser = function(req, resp) {
    var before_val = parseInt(req.query.val);
    var after_val = before_val === 0 ? 1 : 0;
    var type = parseInt(req.query.type); //1-权限, 2-状态
    var id = req.query._id;

    if (type == 1) {
        UserDAO.updateUserLevel(id, after_val, function(result) {
            console.log('update user level success', result);
            resp.send({
                'status': true,
                'type': type,
                'ret_val': after_val,
                'id': id
            })
        }, function(err) {
            console.log('update user failed', err.message);
        });
    } else {
        UserDAO.updateUserStatus(id, after_val, function(result) {
            console.log('update user status success', result);
            resp.send({
                'status': true,
                'type': type,
                'ret_val': after_val,
                'id': id
            })
        }, function(err) {
            console.log('update user failed', err.message);
            return resp.send({
                'status': false,
                'type': type,
                'ret_val': before_val,
                'id': id
            });
        });
    }
};
exports.showInfo = function(req, resp) {
    console.log('查看个人信息');
    resp.render('user/detail', {
        user: req.session.user,
        showEdit: false
    });
};
exports.editInfo = function(req, resp) {
    console.log('查看并编辑个人信息');
    resp.render('user/detail', {
        user: req.session.user,
        showEdit: true
    });
};
exports.changePwd = function(req, resp) {
    console.log('修改密码');
    var uname = req.query.username,
        pwd = req.query.password;
    var md5 = crypto.createHash('md5'),
        md5Password = md5.update(pwd).digest('hex');
    UserDAO.updatePwd(uname, md5Password, function(result) {
        console.log('update password success' + result);
        req.session.user = null;
        return resp.send({
            'status': true
        })
    }, function (err) {
        console.log('update password failed', err.message);
        return resp.send({
            'status': false
        });
    });
};
/******成员列表 end******/
// error will be an Error if one occurred during the query
// results will contain the results of the query
// fields will contain information about the returned results fields (if any)
// results.insertId      insert
// results.affectedRows  insert update delete
// results.changedRows          update