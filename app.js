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

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms')
);
app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);

app.use('/', authRoutes);
app.use('/users', usersRoutes);
app.use('/admins', adminsRoutes);
app.use('/mahasiswa', mahasiswasRoutes);
app.use('/link', linksRoutes);
app.use('/presensi', presensisRoutes);

module.exports = app;
