const multer = require('multer');

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        callback(null, true);
    } else {
        callback(new Error('Apenas arquivos PNG e JPEG são permitidos'), false);
    }
};

const upload = multer({ 
    fileFilter: fileFilter
});

module.exports = upload;