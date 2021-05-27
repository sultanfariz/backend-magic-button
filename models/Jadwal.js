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
    jenisKelas: {
      type: String,
      required: true,
      enum: ['K', 'P'],
    },
    paralel: {
      type: String,
      required: true,
    },
    pertemuan: {
      type: Number,
      min: 1,
      max: 14,
      required: true,
    },
    mahasiswa: [{
      type: Schema.Types.ObjectId,
      ref: 'Mahasiswa',
    }],
    matkul: {
      type: Schema.Types.ObjectId,
      ref: 'MataKuliah',
    },
    vidcon: {
      type: Schema.Types.ObjectId,
      ref: 'Vidcon',
    },
  },
  {
    collection: 'jadwal',
    timestamps: true,
  }
);

module.exports = model('Jadwal', jadwalSchema);
