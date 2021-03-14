const express = require('express');
const controllerUsers = require('../../controllers/users');
const router = express.Router();
const {
  validateRegisterUser,
  validateLoginUser,
  // validateUpdateSubscriptionUser,
  validateUpdateUser,
  validateUploadAvatar,
} = require('../../validation/users');
const upload = require('../../helpers/upload');

const guard = require('../../helpers/guard');
const { createAccountLimiter } = require('../../helpers/rate-limit');

router
  .post(
    '/auth/register',
    [createAccountLimiter, validateRegisterUser],
    controllerUsers.reg,
  )
  .post('/auth/login', validateLoginUser, controllerUsers.login)
  .post('/auth/logout', guard, controllerUsers.logout);

router
  .get('/current', guard, controllerUsers.getUser)
  .patch('/current', [guard, validateUpdateUser], controllerUsers.updateUser);

router.patch(
  '/avatar',
  [guard, upload.single('avatar'), validateUploadAvatar],
  controllerUsers.avatars,
);

module.exports = router;
