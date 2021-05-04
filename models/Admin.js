const { Schema, model } = require('mongoose');
const User = require('./User');

const adminSchema = User.discriminator(
  'Admin',
  new Schema(
    {
      isAdmin: {
        type: Boolean,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = model('Admin', adminSchema);
