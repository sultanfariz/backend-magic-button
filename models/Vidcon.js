const { Schema, model } = require('mongoose');

const vidconSchema = new Schema(
  {
    link: {
      type: Schema.Types.ObjectId,
      ref: 'Link',
    },
    platform: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Vidcon', vidconSchema);
