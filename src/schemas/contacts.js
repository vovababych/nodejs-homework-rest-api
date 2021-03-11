const mongoose = require('mongoose');
const { Schema, model, SchemaTypes } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');
const { SUBSCRIPTIONS } = require('../helpers/constants');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: [true, 'Set email for contact'],
    },

    phone: {
      type: String,
      required: [true, 'Set phone for contact'],
    },

    subscription: {
      type: String,
      enum: {
        values: SUBSCRIPTIONS,
        message: "It isn't allowed",
      },
      default: SUBSCRIPTIONS[0],
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

contactSchema.plugin(mongoosePaginate);

const ContactModel = model('contact', contactSchema);

module.exports = ContactModel;
