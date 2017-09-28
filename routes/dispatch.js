/**
 * Created by chen on 17/9/4.
 */
var PatchDAO = require('../dao/PatchDAO.js');
var DispatchDAO = require('../dao/DispatchDAO.js');
var CONFIG = require('../config.js');
var moment = require('moment');
var fs = require('fs');

//给getPatchAndroid请求返回响应 params包括基线版本 设备号 android版本
//getPatchAndroid?devid=xxx&appver=19_areading_3.9.0
exports.getDispatchVer = function (req, resp, next) {
    console.log('patch包详情页');
    //解析客户端传来的请求参数,包括
    console.log(req.query.devid);
    var devid = req.query.devid.toString();
    var deviceId = 'devid_' + devid;//设备号
    var lastId = 'lastid_' + devid.charAt(devid.length - 1);
    var appver = req.query.appver;
    var slist = appver.split(CONFIG.HTTP_REQ_CONSTANTS);
    var systemSDK = 'sdk_' + slist[0]; //系统版本
    var appVer = slist[1];    //app版本
    console.log('appVer = ', appVer, ',  ' + systemSDK, ',  ' + deviceId);
    DispatchDAO.findByBaseVersion(appVer, function (result) {
        var length = result.length;
        console.log('find dispatch by version success', length);
        if (length > 0) {
            var time = '0';
            var patchVer;
            for (var i = 0; i < length; i++) {
                var dispatch = result[i];
                var type = dispatch.type;
                if (type === 0) {//全量下发
                    time = dispatch.dispatch_time;
                    patchVer = dispatch.patch_version;
                    break;
                } else if (type === 10 && deviceId === 'devid_' +  dispatch.params) {
                    //设备号完全匹配
                    time = dispatch.dispatch_time;
                    patchVer = dispatch.patch_version;
                    break;
                } else if (type === 11 && lastId === 'lastid_' + dispatch.params) {
                    //设备尾号
                    if (parseInt(dispatch.dispatch_time) > parseInt(time)) {
                        time = dispatch.dispatch_time;
                        patchVer = dispatch.patch_version;
                    }
                } else if (type === 12 && systemSDK === 'sdk_' + dispatch.params) {
                    if (parseInt(dispatch.dispatch_time) > parseInt(time)) {
                        time = dispatch.dispatch_time;
                        patchVer = dispatch.patch_version;
                    }
                }
            }
            req.patchVer = patchVer; //找到patch版本,也可能为空
        } else {
            //无
            req.patchVer = null;
        }
        next();
    }, function (err) {
        console.log('find dispatch by version failed', err.message);
        req.patchVer = null;
        next();
    });
};

exports.getDispatchInfo = function (req, resp) {
    var patchVersion = req.patchVer;
    if (patchVersion == null) {
        resp.setHeader('Content-Type', 'application/json');
        return resp.send(JSON.stringify({ ret: -1 }));
    }
    PatchDAO.findDispatchedVersion(patchVersion, function (result) {
        console.log('find patch by version success');
        console.log(result);
        var patch_info;
        if (result != null && result.info_addr != null) {
            patch_info = JSON.parse(fs.readFileSync(result.info_addr));
            resp.setHeader('Content-Type', 'application/json');
            return resp.send(JSON.stringify(patch_info));
        } else {
            resp.setHeader('Content-Type', 'application/json');
            return resp.send(JSON.stringify({ ret: -1 }));
        }
    }, function (err) {
        console.log('find patch by version failed', err.message);
        resp.setHeader('Content-Type', 'application/json');
        return resp.send(JSON.stringify({ ret: -1 }));
    });
};

//将下发记录存入数据库
exports.addNewDispatch = function (req, resp) {
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