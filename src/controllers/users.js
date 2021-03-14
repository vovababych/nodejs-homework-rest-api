const Jimp = require('jimp');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const { UserService, AuthService } = require('../services');
const { HttpCode, Dir } = require('../helpers/constants');
const createFolderIsExist = require('../helpers/create-dir');

const serviceUser = new UserService();
const serviceAuth = new AuthService();

const reg = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await serviceUser.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email is already in use',
      });
    }
    const newUser = await serviceUser.create(req.body);
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        sex: newUser.sex,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await serviceAuth.login({ email, password });
    if (token) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            sex: user.sex,
            subscription: user.subscription,
            avatarURL: user.avatarURL,
          },
        },
      });
    }
    next({
      status: HttpCode.BAD_REQUEST,
      message: 'Email or password is wrong',
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  await serviceAuth.logout(id);
  return res.status(HttpCode.NO_CONTENT).json();
};

const getUser = async (req, res, next) => {
  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      sex: req.user.sex,
      subscription: req.user.subscription,
      avatarURL: req.user.avatarURL,
    },
  });
};

const updateUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await serviceUser.updateUser(userId, req.body);

    res.status(HttpCode.OK).json({
      status: 'Update user data success',
      code: HttpCode.OK,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        sex: user.sex,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const avatarURL = await saveAvatarToStatic(req, userId);
    await serviceUser.updateAvatar(userId, avatarURL);
    return res.json({
      status: HttpCode.OK,
      code: HttpCode.OK,
      data: {
        avatarURL,
      },
    });
  } catch (e) {
    next(e);
  }
};

const saveAvatarToStatic = async (req, userId) => {
  const pathFile = req.file.path; // tmp
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);
  img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);

  // В папке images создаем папку с именем "userId"
  await createFolderIsExist(path.join(Dir.PUBLIC, Dir.AVATARS, userId));
  // Перемещаем файл из временной папки в папку images и меняем имя
  await fs.rename(
    pathFile, // tmp
    path.join(Dir.PUBLIC, Dir.AVATARS, userId, newNameAvatar), // public/images/userID/newName.jpg
  );
  // В БД храним не саму картинку, а путь к статике (public) /images/userID/newName.jpg
  const avatarURL = path.normalize(
    path.join(Dir.AVATARS, userId, newNameAvatar),
  );

  await deletePrevAvatar(req.user);
  return avatarURL;
};

const deletePrevAvatar = async user => {
  try {
    await fs.unlink(path.join(process.cwd(), Dir.PUBLIC, user.avatarURL));
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  reg,
  login,
  logout,
  getUser,
  updateUser,
  avatars,
};
