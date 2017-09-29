/**
 * Created by chen on 17/9/4.
 */
var StatDAO = require('../dao/StatDAO.js');

exports.receiveAnEvent = function (req, resp) {
    console.log('收到上报');
    var bodyParams = req.body.data;
    console.log('参数,', bodyParams);
    var jsonString = eval(bodyParams);
    console.log('trans ,', jsonString);
    //var jsonObj = JSON.parse(jsonString);
    //console.log('trans to jsonArray,', jsonObj);
    StatDAO.insertMultiVersion(jsonString, function (result) {
        console.log('add stat data to db success', result);
        resp.setHeader('Content-Type', 'application/json');
        return resp.send(JSON.stringify({ ret: 0 }));
    }, function (err) {
        console.log('add stat data to db failed, ', err.message);
        resp.setHeader('Content-Type', 'application/json');
        return resp.send(JSON.stringify({ ret: -1 }));
    });
};

exports.showStatByPatchVersion = function (req, resp) {
    console.log('显示统计信息');
    var patchVer = req.params._patchVersion;
    console.log('patch版本:', patchVer);
    StatDAO.findByPatchVersion(patchVer, function (result) {
        console.log('find stat by patch version success, ', result);
        if (result == null) {
            return resp.render('data/visualize', {
                user: req.session.user,
                statList: null
            });
        }
        return resp.render('data/visualize', {
            user: req.session.user,
            statList: result
        });
    }, function (err) {
        console.log('find stat by patch version failed, ', err);
        if (result == null) {
            return resp.render('data/visualize', {
                user: req.session.user,
                statList: null
            });
        }
    });
};
