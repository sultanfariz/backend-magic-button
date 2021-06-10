const { Schema, model } = require('mongoose');

const presensiSchema = new Schema(
  {
    waktuPresensi: {
      type: Date,
      required: true,
      default: Date.now,
    },
    pertemuan: {
      type: Number,
      min: 1, max: 14,
      required: true,
    },
    isChecked: {
      type: Boolean,
      required: true,
      default: false,
    },
    jadwal: {
      type: Schema.Types.ObjectId,
      ref: 'Jadwal',
    },
    idMahasiswa: {
      type: String,
      required: true
    },
    usernameMahasiswa: {
      type: String,
      required: true
    },
  },
  {
    collection: 'presensi',
    timestamps: true,
  }
);

module.exports = model('Presensi', presensiSchema);
