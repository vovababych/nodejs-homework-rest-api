const mongoose = require('mongoose');
const Joi = require('joi');
const { HttpCode } = require('../helpers/constants');

const schemaRegisterUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ru'] },
    })
    .required(),
  password: Joi.string().required(),
  name: Joi.string().min(2).max(30).optional(),
  //   subscription: Joi.string().valid('free', 'pro', 'premium').optional(),
  //   features: Joi.array().optional(),
  token: Joi.string().optional(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().required(),
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
