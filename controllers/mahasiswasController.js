const User = require('../models/User');
const Mahasiswa = require('../models/Mahasiswa');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError } = require('../errors');

module.exports = {
  addMahasiswa: async (req, res) => {
    const { username, password, nama, nim } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      const createdUser = await User.create({
        username,
        password: hashedPassword,
        role: 'mahasiswa',
      });

      const createdMahasiswa = await Mahasiswa.create({
        user: createdUser._id,
        nama,
        nim,
      });
      // create reference between Mahasiswa and User models
      createdUser.mahasiswa = createdMahasiswa._id;
      await createdUser.save();

      // prevent password to be showed in response
      createdUser.password = undefined;
      createdUser = JSON.parse(JSON.stringify(createdUser));

      return response(res, {
        code: 201,
        success: true,
        message: 'Successfully registered!',
        content: {
          user: { createdUser, createdMahasiswa },
        },
      });
    } catch (error) {
      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong!',
        content: error,
      });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { username, password, nama, nim } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      const user = await User.find({id});
      const updatedUser = await User.findOneAndUpdate(
        id,
        { username, password: hashedPassword },
        { new: true }
      );

      // prevent password to be showed in response
      updatedUser.password = undefined;
      updatedUser = JSON.parse(JSON.stringify(updatedUser));
      
      const updatedMahasiswa = await Mahasiswa.findOneAndUpdate(
        user.id,
        { nama, nim },
        { new: true }
      );

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully update user',
        content: updatedUser, updatedMahasiswa
      });
    } catch (error) {
      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong!',
        content: error,
      });
    }
  },
};
