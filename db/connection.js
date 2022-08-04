const mysql = require("mysql2");

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //your MySQL username,
        user: 'dirker',
        //your MySQL password
        password: 'Lorelei09072017!',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

module.exports = db;