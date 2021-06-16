const Presensi = require('../models/Presensi');
const User = require('../models/User');
const Jadwal = require('../models/Jadwal');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError, DuplicatedDataError } = require('../errors');
const { parseJwtPayload } = require('../helper/jwt');
const { getMyMatkul } = require('./mataKuliahController');
const fetch = require('node-fetch');

let getMyPresensiByMatkuls = async (kodeMatkul, usernameMahasiswa, tokenUser) => {
  let presensi = [];
  let myJadwal = [];
  let jadwalFiltered = [];

  try {
    // get jadwal keseluruhan apabila request tidak mengandung query tanggal
    url = 'http://api.ipb.ac.id/v1/jadwal/KuliahUjian/JadwalKuliahSesemesterSaya';
    apiResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-IPBAPI-Token': process.env.ACCESS_TOKEN,
        Authorization: `Bearer ${tokenUser}`,
      },
    });

    // cek status code (success/tidak)
    if (apiResponse.status !== 200) {
      throw new NotFoundError('Jadwal Not Found!');
    }
    
    data = await apiResponse.json();

    // extract jadwalid and store to array
    for(let el of data){
      for(let element of el.ListJadwal){
        myJadwal.push(element.JadwalId)
      }
    }

    let jadwal = await Jadwal.find({ $and: [
      { kodeMatkul }
    ]});
    
    for(let el of jadwal){
      for(let element of myJadwal){
        if(el.idJadwal == element){
          jadwalFiltered.push(el);
        }
      }
    }

    if (isEmpty(jadwalFiltered)) {
      throw new NotFoundError('Matkul Not Found!');
    }

    for(let el of jadwalFiltered){
      const presensis = await Presensi.find({ $and:[
        { jadwal: el._id },
        { usernameMahasiswa }
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
        presensi: presensis,
      };
      presensi.push(jadwals);
    }

    if (isEmpty(presensi)) {
      throw new NotFoundError('Presensi Not Found!');
    }

    return presensi;
  } catch (error) {
    return error;
  }
} 

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

  getMyPresensi: async (req, res) => {
    let presensi = [];

    try {
      // extract username Mahasiswa from token auth IPB
      const usernameMahasiswa = parseJwtPayload(res.locals.token)['ipbUid'];

      let matkul = res.locals.matkul.map((el) => {
        return el.KodeMK;
      });

      for (let el of matkul){
        presensi.push(await getMyPresensiByMatkuls(el, usernameMahasiswa, res.locals.token));
      }


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

  getMyPresensiByMatkul: async (req, res) => {
    const { kodeMatkul } = req.params;
    let presensi = [];

    try {
      // extract username Mahasiswa from token auth IPB
      const usernameMahasiswa = parseJwtPayload(res.locals.token)['ipbUid'];
      let jadwal = await Jadwal.find({ $and: [
        { kodeMatkul }
      ]});

      if (isEmpty(jadwal)) {
        throw new NotFoundError('Matkul Not Found!');
      }

      for(let el of jadwal){
        const presensis = await Presensi.find({ $and:[
          { jadwal: el._id },
          { usernameMahasiswa }
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
          presensi: presensis,
        };
        presensi.push(jadwals);
        console.log(presensi);
      };

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

  checkPresensi: async (req, res) => {
    const { pertemuan, jadwal } = req.body;

    try {
      // extract username and id Mahasiswa from token auth IPB
      const usernameMahasiswa = parseJwtPayload(res.locals.token)['ipbUid'];
      const idMahasiswa = parseJwtPayload(res.locals.token)['ipbMahasiswaID'];
      // find Jadwal data
      const dataJadwal = await Jadwal.findOne({ idJadwal: jadwal });

      if (isEmpty(dataJadwal)) throw new NotFoundError('Jadwal not found');

      const presensi = await Presensi.find({
        $and: [{ pertemuan }, { jadwal: dataJadwal }],
      });

      if (Array.isArray(presensi) && (presensi.length > 0)) throw new DuplicatedDataError('Presensi already filled!');

      const createdPresensi = await Presensi.create({
        waktuPresensi: Date.now(),
        pertemuan,
        isChecked: true,
        idMahasiswa,
        usernameMahasiswa,
      });
      // create reference between Jadwal and Presensi
      createdPresensi.jadwal = dataJadwal;
      await createdPresensi.save();

      return response(res, {
        code: 201,
        success: true,
        message: 'Presensi checked',
        content: createdPresensi,
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

  // update: async (req, res) => {
  //   const { id } = req.params;
  //   const { firstName, lastName, username, email, password } = req.body;

  //   try {
  //     const hashedPassword = await hashPassword(password);

  //     const updatedUser = await User.findOneAndUpdate(
  //       id,
  //       {
  //         firstName,
  //         lastName,
  //         username,
  //         email,
  //         password: hashedPassword,
  //       },
  //       { new: true }
  //     );

  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: 'Successfully update user',
  //       content: updatedUser,
  //     });
  //   } catch (error) {
  //     return response(res, {
  //       code: 500,
  //       success: false,
  //       message: error.message || 'Something went wrong!',
  //       content: error,
  //     });
  //   }
  // },

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
