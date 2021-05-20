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
  },
  {
    timestamps: true,
  }
);

module.exports = model('Mahasiswa', mahasiswaSchema);
