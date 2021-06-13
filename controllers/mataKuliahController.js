const User = require('../models/User');
const MataKuliah = require('../models/MataKuliah');
const Jadwal = require('../models/Jadwal');
const { response, isEmpty, hashPassword } = require('../helper/bcrypt');
const { NotFoundError } = require('../errors');
const fetch = require('node-fetch');

let getMyMatkuls = async (req, res) => {
  let matkul = [];
  const objectsMap = new Map();
  try {
    url = 'http://api.ipb.ac.id/v1/jadwal/KuliahUjian/JadwalKuliahSesemesterSaya';
    apiResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-IPBAPI-Token': process.env.ACCESS_TOKEN,
        Authorization: `Bearer ${res.locals.token}`,
      },
    });

    // cek status code (success/tidak)
    if (apiResponse.status !== 200) {
      throw new NotFoundError('Jadwal Not Found!');
    }

    data = await apiResponse.json();
    data.forEach(async (el) => {
      el['ListJadwal'].forEach(async (element) => {
        matkul.push({namaMatkul: element['NamaMK'], kodeMatkul: element['KodeMK']});
        // matkul.push(JSON.stringify({namaMatkul: element['NamaMK'], kodeMatkul: element['KodeMK']}));
      });
    });

    if (isEmpty(matkul)) {
      throw new NotFoundError('Matkul Not Found!');
    }

    

    return Array.from(new Set(matkul));
  } catch (error) {
    return error;
  }
}

module.exports = {
  // getAll: async (req, res) => {
  //   try {
  //     let matkul = await MataKuliah.find();

  //     if (isEmpty(matkul)) {
  //       throw new NotFoundError('Matkul Not Found!');
  //     }

  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: 'Successfully get matkul data!',
  //       content: matkul,
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

  // getMyMatkul: (userToken) => {
  //   return async (req, res) => {
  //     let matkul = [];
  //     try {
  //       url = 'http://api.ipb.ac.id/v1/jadwal/KuliahUjian/JadwalKuliahSesemesterSaya';
  //       apiResponse = await fetch(url, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'X-IPBAPI-Token': process.env.ACCESS_TOKEN,
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //       });
  
  //       // cek status code (success/tidak)
  //       if (apiResponse.status !== 200) {
  //         throw new NotFoundError('Jadwal Not Found!');
  //       }
  
  //       data = await apiResponse.json();
  //       data.forEach(async (el) => {
  //         el['ListJadwal'].forEach(async (element) => {
  //           matkul.push({namaMatkul: element['NamaMK'], kodeMatkul: element['KodeMK']});
  //         });
  //       });
  
  //       if (isEmpty(matkul)) {
  //         throw new NotFoundError('Matkul Not Found!');
  //       }
  //       return matkul;
  //     } catch (error) {
  //       return error;
  //     }
  //   }
  // },

  // getMy: async (req, res) => {
  //   let matkul = [];
  //   try {
  //     url = 'http://api.ipb.ac.id/v1/jadwal/KuliahUjian/JadwalKuliahSesemesterSaya';
  //     apiResponse = await fetch(url, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-IPBAPI-Token': process.env.ACCESS_TOKEN,
  //         Authorization: `Bearer ${res.locals.token}`,
  //       },
  //     });

  //     // cek status code (success/tidak)
  //     if (apiResponse.status !== 200) {
  //       throw new NotFoundError('Jadwal Not Found!');
  //     }

  //     data = await apiResponse.json();
  //     data.forEach(async (el) => {
  //       el['ListJadwal'].forEach(async (element) => {
  //         matkul.push({namaMatkul: element['NamaMK'], kodeMatkul: element['KodeMK']});
  //       });
  //     });

  //     if (isEmpty(matkul)) {
  //       throw new NotFoundError('Matkul Not Found!');
  //     }

  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: 'Successfully get matkul data!',
  //       content: matkul,
  //     });
  //   } catch (error) {
  //     if (error.name === 'NotFoundError') {
  //       return response(res, {
  //         code: 404,
  //         success: false,
  //         message: error.message,
  //         content: error,
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
  
  getMy: async (req, res) => {
    try {
      let matkul = await getMyMatkuls(req, res);

      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully get matkul data!',
        content: matkul,
      });
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return response(res, {
          code: 404,
          success: false,
          message: error.message,
          content: error,
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

  getMyMatkul: async (req, res, next) => {
    try {
      res.locals.matkul = await getMyMatkuls(req, res);
      next();
    } catch (error) {
      return error;
    }
  },

  tes: (req, res) => {
    try{
      console.log(res.locals.matkul);
      // return res.locals.matkul;
      return response(res, {
        code: 200,
        success: true,
        message: 'Successfully get matkul data!',
        content: res.locals.matkul,
      });
    }catch(error){
      return response(res, {
        code: 500,
        success: false,
        message: error.message || 'Something went wrong!',
        content: error,
      });
    }
  }

  // getOne: async (req, res) => {
  //   const { id } = req.params;

  //   try {
  //     let matkul = await MataKuliah.findOne({ id });

  //     if (isEmpty(matkul))
  //       throw new NotFoundError(`Matkul with id ${id} not found!`);

  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: `Successfully get matkul data!`,
  //       content: matkul,
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

  // insert: async (req, res) => {
  //   const { nama, kode, sks } = req.body;

  //   try {
  //     let createdMataKuliah = await MataKuliah.create({
  //       nama,
  //       kode,
  //       sks,
  //     });

  //     return response(res, {
  //       code: 201,
  //       success: true,
  //       message: 'Successfully registered!',
  //       content: {
  //         matkul: createdMataKuliah,
  //       },
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

  // update: async (req, res) => {
  //   const { id } = req.params;
  //   const { username, password, nama, nim } = req.body;

  //   try {
  //     const hashedPassword = await hashPassword(password);

  //     const user = await User.find({ id });
  //     const updatedUser = await User.findOneAndUpdate(
  //       id,
  //       { username, password: hashedPassword },
  //       { new: true }
  //     );

  //     // prevent password to be showed in response
  //     updatedUser.password = undefined;
  //     updatedUser = JSON.parse(JSON.stringify(updatedUser));

  //     const updatedMahasiswa = await Mahasiswa.findOneAndUpdate(
  //       user.id,
  //       { nama, nim },
  //       { new: true }
  //     );

  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: 'Successfully update user',
  //       content: updatedUser,
  //       updatedMahasiswa,
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

  // delete: async (req, res) => {
  //   const { id } = req.params;

  //   try {
  //     await MataKuliah.deleteOne({ _id: id });
  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: 'Successfully delete matkul!',
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
};
