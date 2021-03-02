const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const { Sex } = require('../helpers/constants');
const SALT_FACTOR = 8;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },

    password: {
      type: String,
      required: [true, 'Password required'],
    },

    name: {
      type: String,
      minlength: 2,
      default: 'Guest',
    },

    sex: {
      type: String,
      enum: {
        values: [Sex.MALE, Sex.FEMALE, Sex.NONE],
        message: "It isn't allowed",
      },
      default: Sex.NONE,
    },

    subscription: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },

    token: {
      type: String,
      default: null,
    },
  },

  { versionKey: false, timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_FACTOR);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

userSchema.method.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
