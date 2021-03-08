const mongoose = require('mongoose');
const Joi = require('joi');
const { HttpCode, Subscription } = require('../helpers/constants');

const schemaRegisterUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ru'] },
    })
    .required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(30).optional(),
  subscription: Joi.string()
    .valid(Subscription.FREE, Subscription.PRO, Subscription.PREMIUM)
    .optional(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().min(6).required(),
});

const validate = (schema, body, next) => {
  const { error } = schema.validate(body);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.validateRegisterUser = (req, _res, next) => {
  return validate(schemaRegisterUser, req.body, next);
};

module.exports.validateLoginUser = (req, _res, next) => {
  return validate(schemaLoginUser, req.body, next);
};
