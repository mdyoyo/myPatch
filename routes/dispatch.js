/**
 * Created by chen on 17/9/4.
 */
var BaseDAO = require('../dao/BaseDAO.js');
var PatchDAO = require('../dao/PatchDAO.js');
var DispatchDAO = require('../dao/DispatchDAO.js');
var CONFIG = require('../config.js');
var moment = require('moment');

//将下发记录存入数据库
exports.addNewDispatch = function(req, resp) {
    var dispatch = {
        patch_version: req.query.patch_version,   //版本号
        base_version: req.query.base_version,
        dispatch_time: parseInt(Date.now() / 1000),   //下发时间
        type: req.query.dispatch_type,       //类型,0-全量,10-设备号,11-设备尾号,12-android版本
        op_user: req.session.user.username,   //下发操作人
        params: req.query.dispatch_params      //参数,和下发类型对应
    };
    console.log(dispatch);
    DispatchDAO.addNewDispatch(dispatch, function (result) {
        console.log('add new dispatch success, ', result.id);
        //刷新patch详情页
        resp.send({
            status: true,
            patch_version: result.patch_version
        });
    }, function (err) {
        console.log('add new dispatch failed, ', err.message);
        resp.send({
            status: false,
            patch_version: dispatch.patch_version
        });
    });
};