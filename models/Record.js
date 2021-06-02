const { Schema, model } = require('mongoose');

const recordSchema = new Schema(
  {
    link: {
      type: Schema.Types.ObjectId,
      ref: 'Link',
    },
    jadwal: {
      type: Schema.Types.ObjectId,
      ref: 'Jadwal',
    },
    pertemuan: {
      type: Number,
      min: 1,
      max: 14,
      required: true,
    },
    tanggal: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Record', recordSchema);
