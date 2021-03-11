const mongoose = require('mongoose');
const Joi = require('joi');
const { HttpCode, SUBSCRIPTIONS, DOMAINS } = require('../helpers/constants');

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]{10}$/)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: DOMAINS },
    })
    .required(),
  subscription: Joi.string()
    .valid(...SUBSCRIPTIONS)
    .optional(),
  features: Joi.array().optional(),
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
      tlds: { allow: DOMAINS },
    })
    .optional(),
  subscription: Joi.string()
    .valid(...SUBSCRIPTIONS)
    .optional(),
  features: Joi.array().optional(),
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

module.exports.validateId = (req, _res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next({
      status: HttpCode.BAD_REQUEST,
      message: 'ID is not valid',
      data: 'Bad Requst',
    });
  }
  next();
};
