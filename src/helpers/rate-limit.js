const rateLimit = require('express-rate-limit');
const { HttpCode } = require('./constants');
const { apiLimit, creteAccLimit } = require('../config/rate-limit.json');

// -----------------------------ответ через next()-----------------------------
const apiLimiter = rateLimit({
  windowMs: apiLimit.windowMs, // В течении 15 минут (900000с или 15*60*1000с))
  max: apiLimit.max, // максимальное количество запросов на наш API
  handler: (req, res, next) => {
    next({
      status: HttpCode.BAD_REQUEST,
      code: HttpCode.BAD_REQUEST,
      message: 'Вы исчерпали количество запросов за 15 минут',
    });
  },
});

// ----------------------ответ через res.status().json()-------------------------
const createAccountLimiter = rateLimit({
  windowMs: creteAccLimit.windowMs, // В течении 1 часа (3600000с или 60*60*1000с)
  max: creteAccLimit.max, // максимальное количество запросов на создание аккаунтов
  handler: (req, res, next) => {
    res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message:
        'С Вашего IP исчерпан лимит создания аккаунтов за 1 час. Попробуйте позже',
    });
  },
});

module.exports = { createAccountLimiter, apiLimiter };
