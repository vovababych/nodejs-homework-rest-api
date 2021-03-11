const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const SALT_FACTOR = 8;

const { SUBSCRIPTIONS, SEX } = require('../helpers/constants');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email required'],
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
      default: 'Anonim',
    },

    sex: {
      type: String,
      enum: {
        values: SEX,
        message: "It isn't allowed",
      },
      default: SEX[0],
    },

    subscription: {
      type: String,
      enum: {
        values: SUBSCRIPTIONS,
        message: "It isn't allowed",
      },
      default: SUBSCRIPTIONS[0],
    },

    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true); // Вытягивает с gravatar.com аватарку по email, true --> https
      },
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
  const salt = await bcrypt.genSaltSync(SALT_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ----------------тоже, что 13-16 рядки----------------
// userSchema.path('email').validate(function (value) {
//   const re = /\S+@\S+\.\S+/;
//   return re.test(String(value).toLowerCase());
// });

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = model('user', userSchema);

module.exports = UserModel;
