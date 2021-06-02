const { Schema, model } = require('mongoose');

const matkulSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    kode: {
      type: String,
      required: true,
      unique: true,
    },
    sks:{
      type: String,
      required: true,
    },
    departemen: {
      type: Schema.Types.ObjectId,
      ref: 'Departemen',
    },
    jadwal: [{
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Jadwal',
        uniqueItems: true,
        unique: true,
      }
    }],
  },
  {
    collection: 'matkul',
    timestamps: true,
  }
);

module.exports = model('MataKuliah', matkulSchema);
