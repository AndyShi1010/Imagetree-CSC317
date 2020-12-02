const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 50,
    waitForConnections: true,
    debug: false,
    host: 'localhost',
    user: 'photoapp',
    password: 'Asdf1234!',
    database: 'photoappdb'
});

const promisePool = pool.promise();

module.export = promisePool;