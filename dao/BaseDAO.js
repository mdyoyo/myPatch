/**
 * Created by chen on 17/9/4.
 */
var Base = require('../models/Base.js').Base;
var BaseDAO = function() {};

BaseDAO.prototype.addNewVersion = function(obj, success, fail) {
    Base.create({
        version: obj.version,
        create_time: obj.create_time
    }).then(success).catch(fail);
};

BaseDAO.prototype.findOneVersion = function(obj, success, fail) {
    Base.findOne({
        where: {
            version: obj.toString()
        }
    }).then(success).catch(fail);
};

BaseDAO.prototype.getAllVersions = function(success, fail) {
    Base.findAll().then(success).catch(fail);
};

module.exports = new BaseDAO();