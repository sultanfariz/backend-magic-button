const { Schema, model } = require('mongoose');

const jadwalSchema = new Schema(
  {
    startHour: {
      type: String,
      required: true,
    },
    endHour: {
      type: String,
      required: true,
    },
    jenisKelas: {
      type: String,
      required: true,
      enum: ['K', 'P'],
    },
    paralel: {
      type: String,
      required: true,
    },
    matkul: {
      type: Schema.Types.ObjectId,
      ref: 'MataKuliah',
    },
  },
  {
    collection: 'jadwal',
    timestamps: true,
  }
);

module.exports = model('Jadwal', jadwalSchema);
