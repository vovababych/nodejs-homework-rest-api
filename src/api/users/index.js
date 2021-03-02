const express = require('express');
const router = express.Router();

// const validate = require('../../validation/user');
const userController = require('../../controllers/users');
// const guard = require('../../controllers/users');

router
  .post('/register', userController.reg)
  .post('/login', userController.login)
  .post('/logout', userController.logout);

module.exports = router;
