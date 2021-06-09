const { Schema, model } = require('mongoose');

const jadwalSchema = new Schema(
  {
    idJadwal: {
      type: String,
      required: true,
      unique: true,
    },
    day: {
      type: String,
      required: true,
    },
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
      enum: ['K', 'P', 'R'],
    },
    paralel: {
      type: String,
      required: true,
    },
    namaMatkul: {
      type: String,
      required: true,
    },
    kodeMatkul: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'jadwal',
    timestamps: true,
  }
);

module.exports = model('Jadwal', jadwalSchema);
