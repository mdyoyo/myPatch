/**
 * Created by chen on 17/9/4.
 */
var Patch = require('../models/Patch.js').Patch;
var PatchDAO = function() {};

PatchDAO.prototype.getPatchList = function(baseVersion, success, fail) {
    Patch.findAll({
        where: {
            base_version: baseVersion
        }
    }).then(success).catch(fail);
};

PatchDAO.prototype.addNewPatch = function (obj, success, fail) {
    Patch.create({
        version: obj.version,
        base_version: obj.base_version,
        size: obj.file_size,
        link: obj.download_addr,
        create_time: obj.create_time,
        desc: obj.desc,
        status: obj.status,
        op_user: obj.op_user
    }).then(success).catch(fail);
};

PatchDAO.prototype.findOneVersion = function (obj, success, fail) {
    Patch.findOne({
        where: {
            version: obj.toString(),
            status: 1
        }
    }).then(success).catch(fail);
};

PatchDAO.prototype.updatePatchInfo = function (obj, success, fail) {
    Patch.update({
        info_addr: obj.addr
    }, {
        where: {
            version: obj.version
        }
    }).then(success).catch(fail);
};
module.exports = new PatchDAO();