const User = require('../models/User');
const Mahasiswa = require('../models/Mahasiswa');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError } = require('../errors');

module.exports = {
  addMahasiswa: async (req, res) => {
    const { username, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      const createdUser = await User.create({
        username,
        password: hashedPassword,
        role: 'mahasiswa',
      });

      const createdMahasiswa = await Mahasiswa.create({
        user: createdUser._id,
      });

      createdUser.mahasiswa = createdMahasiswa._id;
      await createdUser.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Register successfully!',
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
    const { firstName, lastName, username, email, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      const updatedUser = await User.findOneAndUpdate(
        id,
        {
          firstName,
          lastName,
          username,
          email,
          password: hashedPassword,
        },
        { new: true }
      );

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully update user',
        content: updatedUser,
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

  delete: async (req, res) => {
    const { id } = req.params;

    try {
      await User.deleteOne({ _id: id });

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully delete user!',
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
