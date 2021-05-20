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

module.exports = model('Link', linkSchema);
