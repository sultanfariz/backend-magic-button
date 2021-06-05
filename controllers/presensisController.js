const Link = require('../models/Link');
const Presensi = require('../models/Presensi');
const User = require('../models/User');
const Jadwal = require('../models/Jadwal');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError } = require('../errors');
const { parseJwtPayload } = require('../helper/jwt');

module.exports = {
  getAll: async (req, res) => {
    try {
      const presensi = await Presensi.find();

      if (isEmpty(presensi)) {
        throw new NotFoundError('Presensi Not Found!');
      }

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully get presensi data!',
        content: presensi,
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
    const { id } = req.params;

    try {
      const presensi = await Presensi.findOne({ _id: id });

      if (isEmpty(presensi))
        throw new NotFoundError(`Presensi with id ${id} not found!`);

      return response(res, {
        code: 200,
        success: true,
        message: `Successfully get ${id} data!`,
        content: presensi,
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
    const { matkul } = req.query;
    const username = parseJwtPayload(res.locals.token).username;
    const user = await User.findOne({ username });
    const userId = user._id;
    // const jadwal = await Jadwal.findOne({ matkul });
    // const jadwalId = jadwal._id;
    
    try {
        const presensi = await Presensi.find({ 
          $and: [
            {
              mahasiswa: userId
            },
            {
              jadwal: jadwalId
            }
          ] 
        });
      
      if (isEmpty(presensi))
        throw new NotFoundError(`Presensi not found!`);
        
        return response(res, {
          code: 200,
        success: true,
        message: `Successfully get presensi data!`,
        content: presensi,
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
  
  checkPresensi: async (req, res) => {
    const { pertemuan, jadwal } = req.body;
    
    try {
      const username = parseJwtPayload(res.locals.token).username;
      const user = await User.findOne({ username });
      const userId = user._id;

      const presensi = await Presensi.findOne({  
        $and: [{ pertemuan }, { jadwal }] 
      });
      if(presensi) throw new NotFoundError('Presensi already filled!')

      // const createdPresensi = await Presensi.create({
      //   waktuPresensi: Date.now(),
      //   pertemuan,
      //   isChecked: true,
      // });
      
      // createdPresensi.jadwal = jadwal;
      // createdPresensi.mahasiswa = userId;
      // await createdPresensi.save();
      
      // return response(res, {
      //   code: 201,
      //   success: true,
      //   message: 'Presensi checked',
      //   content: createdPresensi,
      // });
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
