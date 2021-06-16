const { Schema, model } = require('mongoose');

const linkSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['vidcon', 'record'],
    },
    vidcon: {
      type: Schema.Types.ObjectId,
      ref: 'Vidcon',
    },
    record: {
      type: Schema.Types.ObjectId,
      ref: 'Record',
    },
  },
  {
    discriminatorKey: 'itemtype',
    collection: 'links',
    timestamps: true,
  }
);

linkSchema.path('link').validate((val) => {
  urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return urlRegex.test(val);
}, 'Invalid URL.');

module.exports = model('Link', linkSchema);
