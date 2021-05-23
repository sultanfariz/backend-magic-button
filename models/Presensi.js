const { Schema, model } = require('mongoose');

const presensiSchema = new Schema(
  {
    waktuPresensi: {
      type: Date,
    },
    isChecked: {
      type: Boolean,
      required: true,
      default: false,
    },
    jadwalKuliah: {
      type: Schema.Types.ObjectId,
      ref: 'JadwalKuliah',
    },
  },
  {
    collection: 'presensi',
    timestamps: true,
  }
);

module.exports = model('Presensi', presensiSchema);
