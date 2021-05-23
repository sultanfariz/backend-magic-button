const { Schema, model } = require('mongoose');

const jadwalSchema = new Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    kodeParalel: {
      type: String,
      required: true,
    },
    matkul: {
      type: Schema.Types.ObjectId,
      ref: 'MataKuliah',
    },
    dosen: {
      type: Schema.Types.ObjectId,
      ref: 'Dosen',
    },
    link: {
      type: Schema.Types.ObjectId,
      ref: 'Link',
    },
  },
  {
    collection: 'jadwal',
    timestamps: true,
  }
);

module.exports = model('JadwalKuliah', jadwalSchema);
