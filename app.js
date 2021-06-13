const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoute');
const usersRoutes = require('./routes/usersRoute');
const adminsRoutes = require('./routes/adminsRoute');
const mahasiswasRoutes = require('./routes/mahasiswasRoute');
const linksRoutes = require('./routes/linksRoute');
const presensisRoutes = require('./routes/presensisRoute');
const mataKuliahRoutes = require('./routes/mataKuliahRoute');
const jadwalRoutes = require('./routes/jadwalRoute');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
app.use(cors());
app.options('*', cors());

app.use('/api/v1/', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/admins', adminsRoutes);
app.use('/api/v1/mahasiswa', mahasiswasRoutes);
app.use('/api/v1/link', linksRoutes);
app.use('/api/v1/presensi', presensisRoutes);
app.use('/api/v1/matkul', mataKuliahRoutes);
app.use('/api/v1/jadwal', jadwalRoutes);

module.exports = app;
