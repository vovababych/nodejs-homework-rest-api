const Joi = require('joi');
const { HttpCode } = require('../helpers/constants');
const db = require('../db');

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]{10}$/)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]{10}$/)
    .optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .optional(),
}).min(1);

const validate = (schema, body, next) => {
  const { error } = schema.validate(body);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, '')}`,
      data: 'Bad Requst',
    });
  }
  next();
};

module.exports.validateCreateContact = (req, _res, next) => {
  return validate(schemaCreateContact, req.body, next);
};

module.exports.validateUpdateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};

module.exports.validateUniqContact = (req, _res, next) => {
  const { name, email, phone } = req.body;

  try {
    const contacts = db.get('contacts').value();
    const isExistsContact = contacts.find(
      contact =>
        contact.name === name ||
        contact.email === email ||
        contact.phone === phone,
    );

    if (isExistsContact) {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: `Контакт с такими данными уже существует`,
        data: isExistsContact,
      });
    }
    next();
  } catch (e) {
    next(e);
  }
};
