var BaseDAO = require('../dao/BaseDAO.js');
var PatchDAO = require('../dao/PatchDAO.js');
var moment = require('moment');

/**基线**/
exports.showBaseList = function(req, resp) {
    console.log('进入版本管理页');
    BaseDAO.getAllVersions(function(result) {
        console.log('query bases success,', result.length);
        return resp.render('version/manage', {
            user: req.session.user,
            moment: moment,
            baseList: result
        });
    }, function (err) {
        console.log('query all base failed,', err.message);
        return resp.render('version/manage', {
            user: req.session.user,
            moment: moment,
            baseList: []
        });
    });
};
exports.checkVersionExisted = function(req, resp) {
    console.log('检查版本号是否重复');
    BaseDAO.findOneVersion(req.query.versionCode, function(result) {
        console.log('find version success, result=', result);
        return resp.send({
            'status': result != null
        });
    }, function (err) {
        console.log('find base version failed.', err.message);
        return resp.send({
            'status': false
        })
    });
};
exports.addNewBaseVersion = function(req, resp) {
    console.log('新增基线版本');
    var base = {
        version: req.query.versionCode,
        create_time: parseInt(Date.now() / 1000)
    };
    BaseDAO.addNewVersion(base, function(result) {
        console.log('add new base version success, ' + result.dataValues.id);
        resp.send({
            'status': true
        })
    }, function (err) {
        console.log('add new base version failed.', err.message);
        return resp.send({
            'status': false
        })
    });
};
exports.getPatchListInfo = function(req, resp, next) {
    //先查询到patch list
    var baseVersion = req.params._baseVersion;
    PatchDAO.getPatchList(baseVersion, function(result) {
        console.log('get patch list success', result.lengths);
        req.patchList = result;
        next();
    }, function (err) {
        console.log('get patch list failed,', err.message);
        return resp.redirect('/');
    });
};
exports.showBaseDetail =  function(req, resp) {
    console.log('基线包详情页');
    var baseVersion = req.params._baseVersion;
    var patchList = req.patchList;
    if (!patchList) {
        patchList = [];
    }
    console.log(baseVersion);
    BaseDAO.findOneVersion(baseVersion, function (result) {
        console.log('find base by version success, ', result.id);
        resp.render('version/baseDetail', {
            user: req.session.user,
            patchList: patchList,
            baseVersion: baseVersion,
            moment: moment,
            create_time: result.create_time
        });
    }, function (err) {
        console.log('find base by version failed', err.message);
    });
};