const multer = require('multer');
const path = require('path');
const shortid = require('shortid');

const multerConfig = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const fileName = `${shortid.generate()}${extension}`;
      cb(null, fileName);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } 
    else {
      cb(new Error('Formato de imagen no válido'));
    }
  }
};


module.exports = multerConfig;