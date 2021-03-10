const Jimp = require('jimp');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const { UserService, AuthService } = require('../services');
const { HttpCode } = require('../helpers/constants');
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
        email: newUser.email,
        name: newUser.name,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
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
          user: { email: user.email, subscription: user.subscription },
        },
      });
    }
    next({
      status: HttpCode.UNAUTHORIZED,
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
      name: req.user.name,
      email: req.user.email,
      subscription: req.user.subscription,
    },
  });
};

const updateSubscriptionUser = async (req, res, next) => {
  const { subscription } = req.body;
  const userId = req.user.id;
  try {
    await serviceUser.updateSubscription(userId, subscription);

    res.status(HttpCode.OK).json({
      status: 'Update subscription success',
      code: HttpCode.OK,
      data: {
        subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const avatarUrl = await saveAvatarToStatic(req, userId);
    await serviceUser.updateAvatar(userId, avatarUrl);
    return res.json({
      status: HttpCode.OK,
      code: HttpCode.OK,
      data: {
        avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
};

const saveAvatarToStatic = async (req, userId) => {
  const PUBLIC_DIR = process.env.PUBLIC_DIR;
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
  console.log('req.user.path', req.user);
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);
  img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);

  // В папке images создаем папку с именем "userId"
  await createFolderIsExist(path.join(PUBLIC_DIR, AVATARS_OF_USERS, userId));
  // Перемещаем файл из временной папки в папку images и меняем имя
  await fs.rename(
    pathFile,
    path.join(PUBLIC_DIR, AVATARS_OF_USERS, userId, newNameAvatar),
  );
  // В БД храним не саму картинку, а путь к статике (public)
  const avatarUrl = path.normalize(
    path.join(AVATARS_OF_USERS, userId, newNameAvatar),
  );

  try {
    // удаляем предидущий файл из папки images
    fs.unlink(path.join(process.cwd(), PUBLIC_DIR, req.user.avatar));
  } catch (e) {
    console.log(e);
  }
  return avatarUrl;
};
module.exports = {
  reg,
  login,
  logout,
  getUser,
  updateSubscriptionUser,
  avatars,
};
