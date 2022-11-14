const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'moon123',
    database: 'social'
});

module.exports = db;