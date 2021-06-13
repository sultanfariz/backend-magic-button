const User = require('../models/User');
const Mahasiswa = require('../models/Mahasiswa');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError } = require('../errors');
const MataKuliah = require('../models/MataKuliah');

module.exports = {
  getAll: async (req, res) => {
    try {
      let mahasiswa = await Mahasiswa.find();

      if (isEmpty(mahasiswa)) {
        throw new NotFoundError('Mahasiswa Not Found!');
      }

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully get mahasiswa data!',
        content: mahasiswa,
      });
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return response(res, {
          code: 404,
          success: false,
          message: error.message,
        });
      }

      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong!',
        content: error,
      });
    }
  },

  getOne: async (req, res) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ username });
      const mahasiswa = await Mahasiswa.find({ user: user._id });

      if (isEmpty(user || mahasiswa))
        throw new NotFoundError(
          `Mahasiswa with username ${username} not found!`
        );

      return response(res, {
        code: 200,
        success: true,
        message: `Successfully get ${username} data!`,
        content: mahasiswa,
      });
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return response(res, {
          code: 404,
          success: false,
          message: error.message,
        });
      }

      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong!',
        content: error,
      });
    }
  },

  insert: async (req, res) => {
    const { username, password, nama, nim } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      let createdUser = await User.create({
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

  enrollMatkul: async (req, res) => {
    const { idmahasiswa, idmatkul } = req.body;

    try {
      let mahasiswa = await Mahasiswa.findOne({ _id: idmahasiswa });
      const matkul = await MataKuliah.findOne({ _id: idmatkul });

      if (isEmpty(mahasiswa)) throw new NotFoundError(`Mahasiswa not found!`);

      if (isEmpty(matkul)) throw new NotFoundError(`Mata Kuliah not found!`);

      mahasiswa.matkul.push(matkul);
      await mahasiswa.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Successfully enrolled!',
        content: null,
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

      const user = await User.find({ id });
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
        content: updatedUser,
        updatedMahasiswa,
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
