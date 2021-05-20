const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'mahasiswa', 'dosen'],
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    mahasiswa: {
      type: Schema.Types.ObjectId,
      ref: 'Mahasiswa',
    },
    dosen: {
      type: Schema.Types.ObjectId,
      ref: 'Dosen',
    },
  },
  {
    discriminatorKey: 'itemtype',
    collection: 'users',
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
