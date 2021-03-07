const jwt = require('jsonwebtoken');
require('dotenv').config();

const { UserService, AuthService } = require('../services');
const { HttpCode } = require('../helpers/constants');
const SECRET_KEY = process.env.JWT_SECRET;

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
    name: req.user.name,
    email: req.user.email,
    subscription: req.user.subscription,
  });
};

module.exports = { reg, login, logout, getUser };
