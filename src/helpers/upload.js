const multer = require('multer');
const path = require('path');
require('dotenv').config();

const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR); // process.cwd()-корень проэкта

const storage = multer.diskStorage({
  // указываем директорию, куда загружать картинки(файлы)
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  // указываем имя файла при сохранении
  filename: function (req, file, cb) {
    cb(null, file.originalname); // file.originalname - имя, то которое пришло
  },
});

const upload = multer({
  storage: storage,
  limits: { filesize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
      return;
    }
    cb(null, false);
  },
});

module.exports = upload;
