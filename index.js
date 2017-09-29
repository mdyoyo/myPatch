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
var baseRouter = require('./routes/base.js');
var patchRouter = require('./routes/patch.js');
var dispatchRouter = require('./routes/dispatch.js');
var userRouter = require('./routes/user.js');
var statRouter = require('./routes/stat.js');

app.get('/test', function (req, resp) {
    return resp.render('test');
});
//下载和访问接口不需要登录
app.get('/upload/:filename', patchRouter.checkDownload);
app.use('/getPatchAndroid', dispatchRouter.getDispatchVer);
app.post('/getPatchAndroid', dispatchRouter.getDispatchInfo);

app.post('/reportPatchLog', statRouter.receiveAnEvent); //事件上报
app.get('/checkUsername_register', userRouter.checkNameRepeat);//检查注册用户名是否重复
app.get('/register', userRouter.getRegisterPage); //注册页
app.post('/register', userRouter.doRegisterUser); //处理注册
app.get('/login', userRouter.getLoginPage);     //登录页

app.get('/check_login', userRouter.checkLogin); //检查密码
app.use('/', userRouter.checkNoLogin);//校验登录态

/**版本管理**/
app.get("/", baseRouter.showBaseList);
app.get("/version_manage", baseRouter.showBaseList);
app.get('/checkVersionExisted', baseRouter.checkVersionExisted);
app.get('/addBaseVersion', baseRouter.addNewBaseVersion);
app.use("/baseDetail/:_baseVersion",patchRouter.getPatchListInfo);
app.get("/baseDetail/:_baseVersion", baseRouter.showBaseDetail);

app.post('/uploadPatch', upload.single('fileUploader'),
    patchRouter.uploadPatch);
app.post('/uploadPatchInfo', upload.single('patchInfoUploader'),
    patchRouter.uploadPatchInfo);
app.get("/patchDetail/:_patchVersion", patchRouter.showPatchDetail);
app.get("/check_patch_ver", patchRouter.checkPatchVersion);
app.get("/addNewDispatch", dispatchRouter.addNewDispatch);

/**用户管理**/
app.get('/user_manage', userRouter.getUsers);   //成员列表页(with分页)
app.get('/deal_user', userRouter.dealUser);     //管理成员状态or权限
app.get('/user_detail', userRouter.showInfo);   //
app.get('/user_info_edit', userRouter.editInfo);
app.get('/edit_pwd', userRouter.changePwd);
/**数据统计**/
app.get("/statistics/:_patchVersion", statRouter.showStatByPatchVersion);

http.createServer(app).listen(CONFIG.port, CONFIG.server,
    function () {
        console.log('app is running on %s at port %s', CONFIG.server, CONFIG.port);
});
