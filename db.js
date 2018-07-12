const pg = require('pg');
const dbConfig = {
    user:       'kokcheekean',
    host:       '127.0.0.1',
    database:   'math-api',
    port:       5432
};
let db = new pg.Pool(dbConfig);
module.exports = {db, dbConfig};
