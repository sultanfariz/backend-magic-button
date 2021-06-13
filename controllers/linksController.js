const Link = require('../models/Link');
const Vidcon = require('../models/Vidcon');
const Record = require('../models/Record');
const Jadwal = require('../models/Jadwal');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError, DuplicatedDataError } = require('../errors');

module.exports = {
  getAll: async (req, res) => {
    try {
      const links = await Link.find();

      if (isEmpty(links)) {
        throw new NotFoundError('Links Not Found!');
      }

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully get links data!',
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

  // getOne: async (req, res) => {
  //   const { username } = req.params;

  //   try {
  //     const user = await User.findOne({ username });

  //     if (isEmpty(user))
  //       throw new NotFoundError(`User with username ${username} not found!`);

  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: `Successfully get ${username} data!`,
  //       content: user,
  //     });
  //   } catch (error) {
  //     if (error.name === 'NotFoundError') {
  //       return response(res, {
  //         code: 404,
  //         success: false,
  //         message: error.message,
  //       });
  //     }

  //     return response(res, {
  //       code: 500,
  //       success: false,
  //       message: error.message || 'Something went wrong!',
  //       content: error,
  //     });
  //   }
  // },

  filter: async (req, res) => {
    const { type, matkul, jadwal } = req.query;

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

  addLinkVidcon: async (req, res) => {
    const { link, platform, jadwal } = req.body;

    try {
      // check vidcon with duplicated jadwal data
      const dataJadwal = await Jadwal.findOne({ idJadwal: jadwal });
      const vidcon = await Vidcon.findOne({ jadwal: dataJadwal });
      if (vidcon)
        throw new DuplicatedDataError(
          'Link Vidcon with this Jadwal value is already in database'
        );

      const createdLink = await Link.create({
        link,
        type: 'vidcon',
      });

      const createdVidcon = await Vidcon.create({
        link: createdLink._id,
        platform,
      });
      // create reference between Vidcon and Link models
      createdLink.vidcon = createdVidcon._id;
      await createdLink.save();

      // create reference between Record and Jadwal models
      createdVidcon.jadwal = dataJadwal;
      await createdVidcon.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Link inserted successfully!',
        content: {
          link: { createdLink, createdVidcon },
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

  addLinkRecord: async (req, res) => {
    const { link, jadwal, pertemuan, tanggal } = req.body;

    try {
      let date = new Date(tanggal);

      // check record with duplicated attribute
      const dataJadwal = await Jadwal.findOne({ idJadwal: jadwal });
      let record = await Record.findOne({
        $and: [{ jadwal: dataJadwal }, { pertemuan }, { tanggal }],
      });
      if (record)
        throw new DuplicatedDataError(
          'Link Record with these attributes is already in database'
        );

      const createdLink = await Link.create({
        link,
        type: 'record',
      });

      const createdRecord = await Record.create({
        link: createdLink._id,
        tanggal: date,
        pertemuan,
      });
      // create reference between Record and Link models
      createdLink.record = createdRecord._id;
      await createdLink.save();

      // create reference between Record and Jadwal models
      createdRecord.jadwal = dataJadwal;
      await createdRecord.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Link inserted successfully!',
        content: {
          link: { createdLink, createdRecord },
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
