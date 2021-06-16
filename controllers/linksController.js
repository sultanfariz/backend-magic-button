const Link = require('../models/Link');
const Vidcon = require('../models/Vidcon');
const Record = require('../models/Record');
const Jadwal = require('../models/Jadwal');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError, DuplicatedDataError } = require('../errors');

let getRecordByMatkul = async (kodeMatkul) => {
  let record = [];

  try {
    let jadwal = await Jadwal.find({ $and: [
      { kodeMatkul }
    ]});

    if (isEmpty(jadwal)) {
      throw new NotFoundError('Matkul Not Found!');
    }

    for(let el of jadwal){
      const records = await Record.find({ $and:[
        { jadwal: el._id },
      ]});

      let jadwals = {
        idJadwal: el.idJadwal,
        day: el.day,
        startHour: el.startHour,
        endHour: el.endHour,
        jenisKelas: el.jenisKelas,
        paralel: el.paralel,
        namaMatkul: el.namaMatkul,
        kodeMatkul: el.kodeMatkul,
        record: records,
      };
      record.push(jadwals);
      console.log(record);
    }

    if (isEmpty(record)) {
      throw new NotFoundError('Record Not Found!');
    }

    return record;
  } catch (error) {
    return error;
  }
} 

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

  getVidconByJadwal: async (req, res) => {
    const { jadwal } = req.query;

    try {
      const dataJadwal = await Jadwal.findOne({ idJadwal: jadwal });
      if (isEmpty(dataJadwal))
        throw new NotFoundError(`Vidcon link with jadwal id ${jadwal} not found!`);

      const vidcon = await Vidcon.findOne({ jadwal: dataJadwal });
      if (isEmpty(vidcon))
        throw new NotFoundError(`Vidcon link with jadwal id ${jadwal} not found!`);
          
      const link = await Link.findOne({ _id: vidcon["link"] });
      if (isEmpty(link))
        throw new NotFoundError(`Vidcon link with jadwal id ${jadwal} not found!`);


      return response(res, {
        code: 200,
        success: true,
        message: `Successfully get ${jadwal} vidcon data!`,
        content: link,
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

  getRecordByMatkul: async (req, res) => {
    const { kodeMatkul } = req.query;
    let record = [];

    try {
      let jadwal = await Jadwal.find({ $and: [
        { kodeMatkul }
      ]});
  
      if (isEmpty(jadwal)) {
        throw new NotFoundError('Matkul Not Found!');
      }
  
      for(let el of jadwal){
        const records = await Record.find({ $and:[
          { jadwal: el._id },
        ]});

        let recordan = []

        for(let element of records){
          const link = await Link.findOne({ _id: element.link });
          
          let recordObj = {
            _id: element.id,
            link: link.link,
            pertemuan: element.pertemuan,
            tanggal: element.tanggal,
          }
          recordan.push(recordObj);
        }
  
        let jadwals = {
          idJadwal: el.idJadwal,
          day: el.day,
          startHour: el.startHour,
          endHour: el.endHour,
          jenisKelas: el.jenisKelas,
          paralel: el.paralel,
          namaMatkul: el.namaMatkul,
          kodeMatkul: el.kodeMatkul,
          record: recordan,
        };
        record.push(jadwals);
      }
  
      if (isEmpty(record)) {
        throw new NotFoundError('Record Not Found!');
      }

      return response(res, {
        code: 200,
        success: true,
        message: `Successfully get record data!`,
        content: record,
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

  filter: (type) => {
    return async (req, res) => {
      const { matkul, jadwal } = req.query;
      let links;
  
      try {
        // const links = await Link.find({ type }, (err, link) => {
        //   if (err) throw err;
        //   // story.author = author;
        //   // link.
        //   // console.log(story.author.name);
        // });
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
        if(type === 'Vidcon'){
          links = await Vidcon.find({ jadwal });
        }else if(type === 'Record'){
          const jadwal = await Jadwal.find({ 
            $and: [
              {
                kodeMatkul: matkul
              },
              // {
              //   kodeMatkul
              // }
            ]
          });

          // links = await Record.find({ 
          //   $and: [
          //     {
          //       matkul
          //     },
          //     // {
          //     //   kodeMatkul
          //     // }
          //   ]
          // });
        }
        console.log(links)
  
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
    }
  }, 

  addLinkVidcon: async (req, res) => {
    const { link, platform, jadwal } = req.body;

    try {
      // check vidcon with duplicated jadwal data
      const dataJadwal = await Jadwal.findOne({ idJadwal: jadwal });
      if (isEmpty(dataJadwal))
        throw new NotFoundError('Jadwal is not found');
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
