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
  },
  {
    collection: 'matkul',
    timestamps: true,
  }
);

module.exports = model('MataKuliah', matkulSchema);
