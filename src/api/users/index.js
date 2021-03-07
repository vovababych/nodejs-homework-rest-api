const express = require('express');
const controllerUsers = require('../../controllers/users');
const router = express.Router();
const {
  validateRegisterUser,
  validateLoginUser,
} = require('../../validation/users');

const guard = require('../../helpers/guard');
const { createAccountLimiter } = require('../../helpers/rate-limit');

router
  .post(
    '/auth/register',
    createAccountLimiter,
    validateRegisterUser,
    controllerUsers.reg,
  )
  .post('/auth/login', validateLoginUser, controllerUsers.login)
  .post('/auth/logout', guard, controllerUsers.logout)
  .get('/current', guard, controllerUsers.getUser);

module.exports = router;
