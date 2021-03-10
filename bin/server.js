const path = require('path');
require('dotenv').config();
const app = require('../app');
const db = require('../src/db');
const createFolderIsExist = require('../src/helpers/create-dir');

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR;
const PUBLIC_DIR = process.env.PUBLIC_DIR;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsExist(UPLOAD_DIR); // Создаем временную папку для загрузки файлов(картинок)
    await createFolderIsExist(PUBLIC_DIR); // Создаем папку для статики
    await createFolderIsExist(path.join(PUBLIC_DIR, AVATARS_OF_USERS)); // Создаем папку для хранения загруженных файлов(картинок)
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server not running. Error message: ${err.message}`);
  process.exit(1);
});
