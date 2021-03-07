const mongoose = require('mongoose');
const { Schema, model, SchemaTypes } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Set email for contact'],
      unique: true,
    },
    password: {
      type: String,
      required: [false, 'Set password for contact'],
    },
    phone: {
      type: String,
      required: [true, 'Set phone for contact'],
      unique: true,
    },
    subscription: {
      type: String,
      required: [false, 'subscription must be one of free or pro or premium'],
    },

    token: {
      type: String,
      required: [false, 'error token'],
    },

    features: {
      type: Array,
      set: data => (!data ? [] : data),
    },

    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

// contactSchema.virtual('fullname').get(function () {
//   return `${this.name}`;
// });

contactSchema.plugin(mongoosePaginate);

const ContactModel = model('contact', contactSchema);

module.exports = ContactModel;
