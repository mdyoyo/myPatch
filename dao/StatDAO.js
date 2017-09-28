var Stat = require('../models/Statistics.js').Stat;
var StatDAO = function() {};

StatDAO.prototype.insertMultiVersion = function (obj, success, fail) {
    Stat.bulkCreate(obj).then(success).catch(fail);
};

StatDAO.prototype.addNewVersion = function(obj, success, fail) {
    Stat.create({
        eventId: obj.eventId,         //事件id
        key_appversion: obj.key_appversion, //基线版本
        key_patch_version:  obj.key_patch_version,   //patch版本
        key_etime: obj.key_etime,       //上报时间
        key_targetsdk: obj.key_targetsdk,    //target23
        key_devid: obj.key_devid,       //设备id
        key_hw: obj.key_hw,             //硬件信息
        key_storage_size: obj.key_storage_size,//剩余可用空间
        key_error_code: obj.key_error_code,   //错误码
        key_error_msg: obj.key_error_msg,   //错误信息
        key_patch_time: obj.key_patch_time,  //时间上报
        patch_success_version: obj.patch_success_version  //成功version
    }).then(success).catch(fail);
};

StatDAO.prototype.findByPatchVersion = function(obj, success, fail) {
    Stat.findAll({
        where: {
            key_patch_version: obj.toString(),
        }
    }).then(success).catch(fail);
};
module.exports = new StatDAO();