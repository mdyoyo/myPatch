var Dispatch = require('../models/Dispatch.js').Dispatch;
var DispatchDAO = function() {};

DispatchDAO.prototype.addNewDispatch = function(obj, success, fail) {
    Dispatch.create({
        patch_version: obj.patch_version,   //版本号
        base_version: obj.base_version,
        dispatch_time: obj.dispatch_time,   //下发时间
        type: obj.type,       //类型,0-全量,10-设备号,11-设备尾号,12-android版本
        op_user: obj.op_user,   //下发操作人
        params: obj.params      //参数,和下发类型对应
    }).then(success).catch(fail);
};

DispatchDAO.prototype.findByBaseVersion = function (obj, success, fail) {
    Dispatch.findAll({
        where: {
            base_version: obj.toString()
        }
    }).then(success).catch(fail);
};

module.exports = new DispatchDAO();
