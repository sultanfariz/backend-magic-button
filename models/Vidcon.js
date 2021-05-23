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
      enum: ['Zoom', 'Cisco Webex', 'Microsoft Teams', 'Google Meet'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Vidcon', vidconSchema);
