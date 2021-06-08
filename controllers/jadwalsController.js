const { response, isEmpty } = require('../helper/bcrypt');
const { NotFoundError } = require('../errors');
const fetch = require('node-fetch');

module.exports = {
  getAll: async (req, res) => {
    try {
      const apiResponse = await fetch("http://api.ipb.ac.id/v1/jadwal/KuliahUjian/JadwalKuliahSesemesterSaya", {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'X-IPBAPI-Token': process.env.ACCESS_TOKEN,
          'Authorization': `Bearer ${res.locals.token}`,
        },
      });
      if (apiResponse.status !== 200){
        throw new NotFoundError('Jadwal Not Found!');
      }
      const data = await apiResponse.json();
      return response(res, {
        code: 200, 
        success: true,
        message: 'Get jadwal kuliah data successfully!',
        content: {
          data
        },
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

  // getAll: async (req, res) => {
  //   try {
  //     const jadwal = await Jadwal.find();

  //     if (isEmpty(jadwal)) {
  //       throw new NotFoundError('Jadwal Not Found!');
  //     }

  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: 'Successfully get jadwal data!',
  //       content: jadwal,
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

  getByDate: async (req, res) => {
    const { id } = req.params;

    try {
      const jadwal = await Jadwal.findOne({ id });

      if (isEmpty(jadwal))
        throw new NotFoundError(`Jadwal with id ${id} not found!`);

      return response(res, {
        code: 200,
        success: true,
        message: `Successfully get jadwal data!`,
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

  // filter: async (req, res) => {
  //   const { type, matkul, idjadwal } = req.query;

  //   try {
  //     const links = await Link.find({ type }, (err, link) => {
  //       if (err) throw err;
  //       // story.author = author;
  //       // link.
  //       // console.log(story.author.name);
  //     });
  //     // const links = await Link.find({ 
  //     //   $and: [
  //     //     {
  //     //       type
  //     //     },
  //     //     // {
  //     //     //   kodeMatkul
  //     //     // }
  //     //   ] 
  //     // });

  //     if (isEmpty(links))
  //       throw new NotFoundError(`Link with filter not found!`);

  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: `Successfully get links data!`,
  //       content: links,
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
  //   const { starthour, endhour, jeniskelas, paralel, idmatkul } = req.body;

  //   try {
  //     const createdJadwal = await Jadwal.create({
  //       startHour: starthour, 
  //       endHour: endhour, 
  //       jenisKelas: jeniskelas, 
  //       paralel,
  //     });

  //     // create reference between Jadwal and Matkul models
  //     createdJadwal.matkul = idmatkul;
  //     await createdJadwal.save();

  //     let matkul = await MataKuliah.findOne({ _id: idmatkul });
  //     if (isEmpty(matkul))
  //       throw new NotFoundError(`Mata Kuliah with id ${idmatkul} not found!`);
  //     matkul.jadwal.push(createdJadwal);
  //     await matkul.save();

  //     return response(res, {
  //       code: 201,
  //       success: true,
  //       message: 'Jadwal inserted successfully!',
  //       content: {
  //         createdJadwal
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

  // insertPertemuan: async (req, res) => {
  //   const { id } = req.params;
  //   const { tanggal } = req.body;

  //   try {
  //     let jadwal = await Jadwal.findOne({ _id: id });
  //     if (isEmpty(jadwal))
  //       throw new NotFoundError(`Jadwal not found!`);
  //     const date = new Date(tanggal);
  //     jadwal.date.push(date);
  //     await jadwal.save();
      
  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: 'Pertemuan inserted successfully',
  //       content: jadwal,
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

  // insertMahasiswa: async (req, res) => {
  //   const { id } = req.params;
  //   const { mahasiswa } = req.body;

  //   try {
  //     let jadwal = await Jadwal.findOne({ _id: id });
  //     let mhs = await Mahasiswa.findOne({ _id: mahasiswa });
  //     console.log("error");
  //     if (isEmpty(jadwal))
  //       throw new NotFoundError(`Jadwal not found!`);
  //     if (isEmpty(mhs))
  //       throw new NotFoundError(`Mahasiswa not found!`);
  //     jadwal.mahasiswa.push(mahasiswa);
  //     console.log("error");
  //     await jadwal.save();
  //     console.log("error");
      
  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: 'Mahasiswa inserted successfully',
  //       content: jadwal,
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
  //     await Jadwal.deleteOne({ _id: id });

  //     return response(res, {
  //       code: 200,
  //       success: true,
  //       message: 'Successfully delete jadwal!',
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
