const { Schema, model } = require('mongoose');

const mahasiswaSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    nim: {
      type: String,
      required: true,
      unique: true,
    },
    nama: {
      type: String,
      required: true,
    },
    matkul: [{
      id: {
        type: Schema.Types.ObjectId,
        ref: 'MataKuliah',
        uniqueItems: true,
        unique: true,
      }
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = model('Mahasiswa', mahasiswaSchema);
