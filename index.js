const express = require('express');
const app = express();
const db = require('./db').db;

// Route Handler Functions
let funcOne = (req, res) => {
    res.status(200).send({
        status: "server is up",
        result: null
    });
}

let funcTwo = (req, res) => {
    let queryValueStart = req.query.start;
    let queryValueEnd = req.query.end;
    let queryValueSort = req.query.sort;
    const allowedQueries = ['start', 'end', 'sort'];
    let unknownQuery = false;
    Object.keys(req.query).forEach( key => {
        if (allowedQueries.indexOf(key) < 0) {
            unknownQuery = true;
        }
    })

    let query;
    let values = [];

    if (unknownQuery) {
        res.status(400).send({
            status: "failed",
            result: "unknown query parameters",
        });
        return;
    } else if (queryValueStart < 1) {
        res.status(400).send({
            status: "failed",
            result: "invalid input",
        });
        return;
    } else if (queryValueSort) {
        query = "SELECT number FROM fibonacci WHERE id BETWEEN $1 AND $2 ORDER BY id desc";
        values = [queryValueStart, queryValueEnd];
    } else if (queryValueEnd < queryValueStart) {
        res.status(400).send({
            status: "failed",
            result: "invalid input",
        });
        return;
    } else if (queryValueEnd) {
        query = "SELECT number FROM fibonacci WHERE id BETWEEN $1 AND $2";
        values = [queryValueStart, queryValueEnd];
    } else if (queryValueStart) {
        query = "SELECT number FROM fibonacci WHERE id >= $1 LIMIT 20";
        values = [queryValueStart];
    } else {
        query = "SELECT number FROM fibonacci FETCH FIRST 20 ROWS ONLY";
    }

    db.query(query, values, (err, fibs) => {
        let arrayOfTwenty = fibs.rows.map(obj => Number(obj.number));
        res.status(200).send({
            status: "success",
            result: arrayOfTwenty
        });
    });
}

// Routes
app.get('/api/v1/fibonacci', funcTwo);
app.get('/api/v1', funcOne);

// Server start
const server = app.listen(3000);

module.exports = server;