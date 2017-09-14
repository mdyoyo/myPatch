/**
 * Created by chen on 17/8/25.
 */
var express = require("express");
var path = require("path");
var bodyparser = require("body-parser");
var session = require("express-session");
var moment = require('moment');
var fs = require('fs');
var upload = require('./util/upload.js');
//创建express实例
var CONFIG = require('./config.js');
var http = require('http');
var app = express();
//定义ejs模板引擎和模板文件位置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//定义静态文件目录，图片、css、js等
app.use(express.static(path.join(__dirname, 'public')));
//定义数据解析器
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));
//建立session模型
app.use(session({
    secret: '1234',
    name: 'helloPatch',
    cookie: {
        maxAge : 1000 * 60 * 20  //有效期20分钟
    },
    resave: false, //是否每次都重新保存session
    saveUninitialized: false //是否自动保存未初始化的session
}));
//响应首页get请求
var versionRouter = require('./routes/version.js');
var userRouter = require('./routes/user.js');

app.post('/baseDetail/api/Upload', upload.single('fileUploader'), versionRouter.uploadPatch);
app.get('/upload/:filename', versionRouter.checkDownload);

app.get('/checkUsername_register', userRouter.checkNameRepeat);//检查注册用户名是否重复
app.get('/register', userRouter.getRegisterPage); //注册页
app.post('/register', userRouter.doRegisterUser); //处理注册
app.get('/login', userRouter.getLoginPage);     //登录页
app.get('/check_login', userRouter.checkLogin); //检查密码

app.use('/', userRouter.checkNoLogin);//校验登录态
app.get("/main", function(req, resp) {
    resp.render('main', {
        user: null
    });
});

/**版本管理**/
app.get("/", versionRouter.showBaseList);
app.get("/version_manage", versionRouter.showBaseList);
app.get('/checkVersionExisted', versionRouter.checkVersionExisted);
app.get('/addBaseVersion', versionRouter.addNewBaseVersion);

app.use("/baseDetail/:_baseVersion",versionRouter.getPatchListInfo);
app.get("/baseDetail/:_baseVersion", versionRouter.showBaseDetail);

app.get("/patchDetail/:_patchVersion", versionRouter.showPatchDetail);
app.get("/check_patch_ver", versionRouter.checkPatchVersion);

/**数据统计**/
app.get("/statistics", function(req, resp) {
    resp.render('data/visualize', {
        user: null
    });
});
/**用户管理**/
app.get('/user_manage', userRouter.getUsers);   //成员列表页(with分页)
app.get('/deal_user', userRouter.dealUser);     //管理成员状态or权限
app.get('/user_detail', userRouter.showInfo);   //
app.get('/user_info_edit', userRouter.editInfo);
app.get('/edit_pwd', userRouter.changePwd);

//http.createServer(app).listen('3000', '127.0.0.1');
http.createServer(app).listen(CONFIG.port, CONFIG.server,
    function () {
        console.log('app is running on %s at port %s', CONFIG.server, CONFIG.port);
});