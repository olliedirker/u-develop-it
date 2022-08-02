const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require("mysql2");
//express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Connect to database
const db = mysql.createConnection(
    {
        host:'localhost',
        //your MySQL username,
        user: 'dirker',
        //your MySQL password
        password:'Lorelei09072017!',
        database:'election'
    },
    console.log('Connected to the election database.')
);

db.query(`SELECT * FROM candidates`, (err, rows)=> {
    console.log(rows);
})

db.query(`SELECT * FROM candidates`)
  //add get route that is for requests not supported by the app
  //Default response for any other request(Not found)
  app.use((req, res)=> {
    res.status(404).end();
  });

//function that starts the express.js server on port 3001
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});