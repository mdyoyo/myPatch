var BaseDAO = require('../dao/BaseDAO.js');
var PatchDAO = require('../dao/PatchDAO.js');
var CONFIG = require('../config.js');
var moment = require('moment');
var fs = require('fs');

/**patch**/
exports.showPatchDetail = function(req, resp) {
    console.log('patch包详情页');
    var patchVersion = req.params._patchVersion;
    console.log('patchversion = ', patchVersion);
    var prefix = CONFIG.prefix + CONFIG.server + ':' + CONFIG.port + '/';
    PatchDAO.findOneVersion(patchVersion, function (result) {
        console.log('find patch by version success');
        var patch_info;
        if (result.info_addr != null) {
            patch_info = JSON.parse(fs.readFileSync(result.info_addr));
        } else {
            patch_info = null;
        }
        console.log(result);

        resp.render('version/patchDetail', {
            user: req.session.user,
            patch: result,
            moment: moment,
            filePrefix: prefix,
            patchInfo: patch_info
        });
    }, function (err) {
        console.log('find patch by version failed', err.message);
        resp.render('version/patchDetail', {
            user: req.session.user,
            patch: null,
            moment: moment,
            filePrefix: prefix,
            patchInfo: null
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
exports.getPatchListInfo = function(req, resp, next) {
    //先查询到patch list
    var baseVersion = req.params._baseVersion;
    PatchDAO.getPatchList(baseVersion, function(result) {
        console.log('get patch list success', result.length);
        req.patchList = result;
        next();
    }, function (err) {
        console.log('get patch list failed,', err.message);
        return resp.redirect('/');
    });
};
exports.uploadPatchInfo = function (req, resp) {
    var file = req.file;
    var patchVersion = req.body.patchVer;
    console.log('updatePatchInfo', file, patchVersion);
    var data = {
        version: patchVersion,
        addr: file.path
    };
    PatchDAO.updatePatchInfo(data, function (result) {
        console.log('update patch info success,', result);
        resp.redirect('/patchDetail/' + patchVersion);
    }, function (err) {
        console.log('update patch info failed,', err.message);
    })
};