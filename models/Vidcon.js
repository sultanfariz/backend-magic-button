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
    jadwal: {
      type: Schema.Types.ObjectId,
      ref: 'Jadwal',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Vidcon', vidconSchema);
