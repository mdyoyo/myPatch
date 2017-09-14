//schema结构化
var SchemaObject = require('node-schema-object');

var dispatchModel = new SchemaObject({
    id: Number,
    patch_version: String,   //版本号
    dispatch_time: String,   //下发时间
    type: Number,       //类型,0-全量,10-设备号,11-设备尾号,12-android版本
    user_id: Number,    //当前状态，0-正常（默认），1-关闭
    params: String      //参数,和下发类型对应
});

exports.Dispatch = dispatchModel;

