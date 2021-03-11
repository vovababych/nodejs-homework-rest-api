const path = require('path');
require('dotenv').config();
const app = require('../app');
const db = require('../src/db');
const createFolderIsExist = require('../src/helpers/create-dir');
const { Dir } = require('../src/helpers/constants');

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsExist(Dir.UPLOAD); // Создаем временную папку для загрузки файлов(картинок)
    await createFolderIsExist(path.join(Dir.PUBLIC, Dir.AVATARS)); // Создаем папку для хранения загруженных файлов(картинок)
    console.log(`Server running. Use our API on port: ${PORT}`);
    console.log(
      '-----------------------------------------------------------------------------------',
    );
  });
}).catch(err => {
  console.log(`Server not running. Error message: ${err.message}`);
  process.exit(1);
});
