const { Schema, model } = require('mongoose');

const departemenSchema = new Schema(
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
    fakultas: {
        type: Schema.Types.ObjectId,
        ref: 'Fakultas',
    },
  },
  {
    collection: 'departemen',
    timestamps: true,
  }
);

module.exports = model('Departemen', departemenSchema);
