const express = require('express');
const controllerContacts = require('../../controllers/contacts');
const router = express.Router();
const {
  validateCreateContact,
  validateUpdateContact,
  validateId,
} = require('../../validation/contacts');
const guard = require('../../helpers/guard');

router
  .get('/', guard, controllerContacts.getAll)
  .post('/', guard, validateCreateContact, controllerContacts.create);

router
  .get('/:contactId', guard, validateId, controllerContacts.getById)
  .patch(
    '/:contactId',
    guard,
    validateId,
    validateUpdateContact,
    controllerContacts.update,
  )
  .delete('/:contactId', guard, validateId, controllerContacts.remove);

module.exports = router;
