const express = require('express');
const app = express();
const logger = require('morgan');
const db = require('./db').db;

app.use(logger('dev'));

// Route Handler Functions


// Routes


// Server start
const server = app.listen(3000);

module.exports = server;
