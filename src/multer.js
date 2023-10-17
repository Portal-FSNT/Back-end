const multer = require('multer');

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        callback(null, true);
    } else {
        callback(new Error('Apenas arquivos PNG e JPEG são permitidos'), false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './src/uploads');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
