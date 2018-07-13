const express = require('express');
const app = express();
const logger = require('morgan');
const db = require('./db').db;

app.use(logger('dev'));

// Route Handler Functions


// Routes
app.get('/api/v1', (req, res) => {
    db.query('SELECT * FROM fibonacci LIMIT 1;', (err, result) => {
        if (err) {
            console.log(err.message);
            res.status(503).send({
                status: "database unavailable",
                result: null
            })
        } else {
            res.status(200).send({
                status: "server is up",
                result: null
            })
        }
    })
})

// Server start
const server = app.listen(3000);

module.exports = server;
