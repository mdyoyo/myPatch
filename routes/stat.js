/**
 * Created by chen on 17/9/4.
 */
var StatDAO = require('../dao/StatDAO.js');

exports.receiveAnEvent = function (req, resp) {
    console.log('收到一条上报');
    var bodyParams = req.body.data;
    console.log('参数,', bodyParams);
    StatDAO.addNewVersion(bodyParams, function (result) {
        console.log('add stat data to db success', result);
        resp.setHeader('Content-Type', 'application/json');
        return resp.send(JSON.stringify({ ret: 0 }));
    }, function (err) {
        console.log('add stat data to db failed, ', err.message);
        resp.setHeader('Content-Type', 'application/json');
        return resp.send(JSON.stringify({ ret: -1 }));
    });
};
