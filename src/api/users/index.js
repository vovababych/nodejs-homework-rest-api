const express = require('express');
const controllerUsers = require('../../controllers/users');
const router = express.Router();

// const validate = require('../../validation/user');
const guard = require('../../helpers/guard');

router
  .post('/register', controllerUsers.reg)
  .post('/login', controllerUsers.login)
  .post('/logout', guard, controllerUsers.logout);

module.exports = router;
