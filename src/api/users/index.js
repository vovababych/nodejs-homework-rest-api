const express = require('express');
const controllerUsers = require('../../controllers/users');
const router = express.Router();

// const validate = require('../../validation/user');
const guard = require('../../helpers/guard');
const { createAccountLimiter } = require('../../helpers/rate-limit');

router
  .post('/auth/register', createAccountLimiter, controllerUsers.reg)
  .post('/auth/login', controllerUsers.login)
  .post('/auth/logout', guard, controllerUsers.logout)
  .get('/current', guard, controllerUsers.getUser);

module.exports = router;
