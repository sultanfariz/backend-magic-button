const { Schema, model } = require('mongoose');

const recordSchema = new Schema(
  {
    link: {
      type: Schema.Types.ObjectId,
      ref: 'Link',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Record', recordSchema);
