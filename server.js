const { ifError } = require('assert');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require("mysql2");
//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

//get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//get a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// //delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(result);
// });


// Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});

db.query(`SELECT * FROM candidates`)
//add get route that is for requests not supported by the app
//Default response for any other request(Not found)
app.use((req, res) => {
    res.status(404).end();
});

//function that starts the express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});