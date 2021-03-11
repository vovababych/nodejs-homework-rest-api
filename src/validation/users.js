const Joi = require('joi');
const {
  HttpCode,
  SUBSCRIPTIONS,
  SEX,
  DOMAINS,
} = require('../helpers/constants');

const schemaRegisterUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: DOMAINS },
    })
    .required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(30).optional(),
  sex: Joi.valid(...SEX).optional(),
  subscription: Joi.string()
    .valid(...SUBSCRIPTIONS)
    .optional(),
  avatarURL: Joi.string().optional(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: DOMAINS },
    })
    .required(),
  password: Joi.string().min(6).required(),
});

const schemaUpdateSubscriptionUser = Joi.object({
  subscription: Joi.string()
    .valid(...SUBSCRIPTIONS)
    .required(),
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

module.exports.validateUpdateSubscriptionUser = (req, _res, next) => {
  return validate(schemaUpdateSubscriptionUser, req.body, next);
};

module.exports.validateUploadAvatar = (req, res, next) => {
  if (!req.file) {
    return next({
      status: HttpCode.BAD_REQUEST,
      message: 'Field of avatar with file not found',
      data: 'Bad Requst',
    });
  }
  next();
};
