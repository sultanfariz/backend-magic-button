const { Schema, model } = require('mongoose');

const fakultasSchema = new Schema(
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
    collection: 'fakultas',
    timestamps: true,
  }
);

module.exports = model('Fakultas', fakultasSchema);
