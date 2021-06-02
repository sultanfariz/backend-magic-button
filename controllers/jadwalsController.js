const Jadwal = require('../models/Jadwal');
const MataKuliah = require('../models/MataKuliah');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError } = require('../errors');

module.exports = {
  getAll: async (req, res) => {
    try {
      const jadwal = await Jadwal.find();

      if (isEmpty(jadwal)) {
        throw new NotFoundError('Jadwal Not Found!');
      }

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully get jadwal data!',
        content: jadwal,
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

      if (isEmpty(user))
        throw new NotFoundError(`User with username ${username} not found!`);

      return response(res, {
        code: 200,
        success: true,
        message: `Successfully get ${username} data!`,
        content: user,
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

  filter: async (req, res) => {
    const { type, matkul, idjadwal } = req.query;

    try {
      const links = await Link.find({ type }, (err, link) => {
        if (err) throw err;
        // story.author = author;
        // link.
        // console.log(story.author.name);
      });
      // const links = await Link.find({ 
      //   $and: [
      //     {
      //       type
      //     },
      //     // {
      //     //   kodeMatkul
      //     // }
      //   ] 
      // });

      if (isEmpty(links))
        throw new NotFoundError(`Link with filter not found!`);

      return response(res, {
        code: 200,
        success: true,
        message: `Successfully get links data!`,
        content: links,
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
    const { starthour, endhour, jeniskelas, paralel, idmatkul } = req.body;

    try {
      const createdJadwal = await Jadwal.create({
        startHour: starthour, 
        endHour: endhour, 
        jenisKelas: jeniskelas, 
        paralel,
      });

      // create reference between Jadwal and Matkul models
      createdJadwal.matkul = idmatkul;
      await createdJadwal.save();

      let matkul = await MataKuliah.findOne({ _id: idmatkul });
      if (isEmpty(matkul))
        throw new NotFoundError(`Mata Kuliah with id ${idmatkul} not found!`);
      matkul.jadwal.push(createdJadwal);
      await matkul.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Jadwal inserted successfully!',
        content: {
          createdJadwal
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
