const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const usersRoutes = require('./routes/usersRoute');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(
  cors({
    origin: ['http://localhost:3000']
  })
);
app.use('/users', usersRoutes);

module.exports = app;
