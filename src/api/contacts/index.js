const express = require('express');
const controllerContacts = require('../../controllers/contacts');
const router = express.Router();
const {
  validateCreateContact,
  validateUpdateContact,
} = require('../../validation/contacts');

router
  .get('/', controllerContacts.getAll)
  .get('/:contactId', controllerContacts.getById)
  .post('/', validateCreateContact, controllerContacts.create)
  .patch('/:contactId', validateUpdateContact, controllerContacts.update)
  .delete('/:contactId', controllerContacts.remove);

module.exports = router;
