const request = require('supertest');
const server = require('../index');
let db = require('../db').db;
const dbConfig = require('../db').dbConfig;
const pg = require('pg');
const fs = require('fs')
let last = fs.readFileSync('./__tests__/tracker', 'UTF-8');
let pass = false;

function F(start = 1, end = 2) {
    let k = end;
    let calc = [1,1], i = calc.length - 1;
    while (k > 2) {
        calc.push(calc[i] + calc[i-1]);
        i++;
        k--;
    }
    return calc.slice(start-1, end);
}

afterAll((done) => {
    db.end((() => {
        server.close(() => {
            if (last == 1 && pass == false) {
                fs.writeFileSync('./__tests__/tracker', 1);
            } else {
                fs.writeFileSync('./__tests__/tracker', ++last);
            }
            done();
        });
    }));
});

function __first() {
    return it('GET /api/v1 should respond with a status of 200 and a JSON object with key "status" and value "server is up", key "result" and value null, if the database is connected.', () => {
        return request(server).get('/api/v1').then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                status: "server is up",
                result: null
            });
            last = 1;
            pass = true;
        });
    });
}

function __second() {
    return it('GET /api/v1 should respond with a status of 503 and a JSON object with key "status" and value "database unavailable", key "result" and value null, if the database is NOT connected.', async () => {
        if (last >= 2) {
            expect(true).toBe(true);
        } else {
            await db.end();
            const response = await request(server).get('/api/v1');
            expect(response.statusCode).toBe(503);
            expect(response.body).toEqual({
                status: "database unavailable",
                result: null
            });
            last = 2;
            // await db.connect();
        }
    });
}

function __third() {
    return it('GET /api/v1/fibonacci should respond with a status of 200 and a JSON object with key "status" and value "success", key "result" and value an array of the first 20 Fibonacci numbers retrieved from the database', async () => {
        const response = await request(server).get('/api/v1/fibonacci');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            result: F(1, 20)
        });
        last = 3;
    });
}

function __fourth() {
    return it('GET /api/v1/fibonacci?start=X should respond with a status of 200 and a JSON object with key "status" and value "success", key "result" and value an array of 20 Fibonacci numbers retrieved from the database, starting from the Xth number', async () => {
        const response = await request(server).get('/api/v1/fibonacci?start=10');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            result: F(10, 29)
        });
        last = 4;
    });
}

function __fifth() {
    return it('GET /api/v1/fibonacci?start=X should respond with a status of 400 and a JSON object with key "status" and value "failed", key "result" and value "invalid input" if X is less than 1', async () => {
        const response = await request(server).get('/api/v1/fibonacci?start=0');
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            status: "failed",
            result: "invalid input"
        });
        last = 5;
    });
}

function __sixth() {
    return it('GET /api/v1/fibonacci?start=X&end=Y should respond with a status of 200 and a JSON object with key "status" and value "success", key "result" and value an array of Fibonacci numbers retrieved from the database, starting from the Xth number an ending at the Yth number, inclusive', async () => {
        const response = await request(server).get('/api/v1/fibonacci?start=50&end=60');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            result: F(50, 60)
        });
        last = 6;
    });
}

function __seventh() {
    return it('GET /api/v1/fibonacci?start=X&end=Y&sort=desc should respond with a status of 200 and a JSON object with key "status" and value "success", key "result" and value an array of Fibonacci numbers retrieved from the database, starting from the Xth number an ending at the Yth number, inclusive, sorted in descending order', async () => {
        const response = await request(server).get('/api/v1/fibonacci?start=50&end=60&sort=desc');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            result: F(50, 60).sort((a,b) => {return a < b})
        });
        last = 7;
    });
}

function __eighth() {
    return it('GET /api/v1/fibonacci?start=X&end=Y should respond with a status of 400 and a JSON object with key "status" and value "failed", key "result" and value "invalid input" if Y is less than X', async () => {
        const response = await request(server).get('/api/v1/fibonacci?start=49&end=30');
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            status: "failed",
            result: "invalid input"
        });
        last = 8;
    });
}

function __nineth() {
    return it('GET /api/v1/fibonacci should respond with a status of 400 and a JSON object with key "status" and value "failed", key "result" and value "unknown query parameters" if Y is less than X', async () => {
        const response = await request(server).get('/api/v1/fibonacci?start=10&end=20&sort=desc&funny=true');
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            status: "failed",
            result: "unknown query parameters"
        });
        last = 9;
    });
}

function __tenth() {
    return it('GET /api/v1/fibonacci should respond with a status of 400 and a JSON object with key "status" and value "failed", key "result" and value "unknown query parameters" if an end query is provided without a start query', async () => {
        const response = await request(server).get('/api/v1/fibonacci?end=20&sort=desc&funny=true');
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            status: "failed",
            result: "unknown query parameters"
        });
        last = 9;
    });
}

const tests = [__first, __second, __third, __fourth, __fifth, __sixth, __seventh, __eighth, __nineth, __tenth];

for (let i = 0; i < last; i++) {
    tests[i]();
};

