var multer = require('multer');
//存储选项
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'fileUploader') {
            console.log('Patch save at upload');
            cb(null, './upload/');    //路径
        }
        if (file.fieldname === 'patchInfoUploader') {
            console.log('PatchInfo save at patchInfo');
            cb(null, './patchInfo/');    //路径
        }
    },
    filename: function (req, file, cb) {
        //文件名
        cb(null, file.fieldname + '_' + Date.now() + '_' +file.originalname);
    }
});
var upload = multer({
    storage: storage
});

module.exports = upload;