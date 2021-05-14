const { Schema, model } = require('mongoose');
// const User = require('./User');

// const adminSchema = User.discriminator(
  //   'Admin',
const adminSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
      },
    },
    {
      timestamps: true,
    }
);

module.exports = model('Admin', adminSchema);
