const express = require('express');
const controllerContacts = require('../../controllers/contacts');
const router = express.Router();
const {
  validateCreateContact,
  validateUpdateContact,
  validateId,
} = require('../../validation/contacts');

router
  .get('/', controllerContacts.getAll)
  .post('/', validateCreateContact, controllerContacts.create);

router
  .get('/:contactId', validateId, controllerContacts.getById)
  .patch(
    '/:contactId',
    validateId,
    validateUpdateContact,
    controllerContacts.update,
  )
  .delete('/:contactId', validateId, controllerContacts.remove);

module.exports = router;
