/**
 * Created by chen on 17/9/4.
 */
var BaseDAO = require('../dao/BaseDAO.js');
var PatchDAO = require('../dao/PatchDAO.js');
var CONFIG = require('../config.js');
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
/**patch**/
exports.showPatchDetail = function(req, resp) {
    console.log('patch包详情页');
    var patchVersion = req.params._patchVersion;
    console.log('patchversion = ', patchVersion);
    var prefix = CONFIG.prefix + CONFIG.server + ':' + CONFIG.port + '/';
    PatchDAO.findOneVersion(patchVersion, function (result) {
        console.log('find patch by version success');
        resp.render('version/patchDetail', {
            user: req.session.user,
            patch: result,
            moment: moment,
            filePrefix: prefix
        });
    }, function (err) {
        console.log('find patch by version failed', err.message);
        resp.render('version/patchDetail', {
            user: req.session.user,
            patch: null,
            moment: moment,
            filePrefix: prefix
        });
    });

};
exports.checkPatchVersion = function (req, resp) {
    console.log('检查patch版本号重复');
    var input = req.query.patchVersion;
    var baseVersion = req.query.baseVersion;
    console.log(input, baseVersion);
    PatchDAO.findOneVersion(baseVersion + input, function (result) {
        console.log('check patch version success');
        var status = 0;
        if (result != null) {
            status = 1;
        }
        resp.send({
            ret: status
        });
    }, function (err) {
        console.log('check patch version failed', err);
        resp.send({
            ret: 2
        })
    })
};
exports.uploadPatch = function (req, resp) {
    var file = req.file;
    var input = req.body.descInput; //描述信息
    var baseVersion = req.body.baseVer;
    var version = baseVersion + req.body.versionInput;
    console.log(file, input, version, baseVersion);
    //fieldname, originalname, mimetype, destination, filename, path, size
    //操作数据库
    var username = req.session.user != null ? req.session.user.username : 'Administrator';
    var url = CONFIG.prefix + CONFIG.server + ':' + CONFIG.port + '/' + file.path;
    var patchInfo = {
        version: version,
        base_version: baseVersion,
        file_size: file.size / 1024,
        download_addr: url,
        create_time: parseInt(Date.now() / 1000),
        desc: input,
        status: 0,
        op_user: username
    };
    PatchDAO.addNewPatch(patchInfo, function (result) {
        console.log('insert new patch success, ', result.id);
        resp.redirect('/baseDetail/' + baseVersion);
    }, function (err) {
        console.log('insert new patch failed, ', err.message);
    });
};
exports.checkDownload = function (req, resp) {
    //path filename callback
    var url = 'upload/'+ req.params.filename;
    console.log(url);
    resp.download(url, function(err){
        console.log(err);
    });
};