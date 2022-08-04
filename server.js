const { ifError } = require('assert');
const express = require('express');
const inputCheck = require('./utils/inputCheck');

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
    const sql = `SELECT candidates.*,parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id`;
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
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE candidates.id = ?`;
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
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'succesfully deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// // Create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(
        body,
        'first_name',
        'last_name',
        'industry_connected'
    );
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
      VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

//update a candidates party
app.put('/api/candidate/:id', (req, res)=> {
    // Candidates is allowed to not have party affiliation
    const errors = inputCheck(req.body, 'party_id');
    if (errors){
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE candidates SET party_id =?
    WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql,params,(err, result)=> {
        if(err){
            res.status(400).json({ error: err.message });
            //check if a record was found
        }else if (!result.affectedRows){
            res.json({
                message: 'Candidate not found'
            });
        }else {
            res.json({
                message: 'success',
                data : req.body,
                changes: result.affectedRows
            });
        }
    });
});

//get all parties
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
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

//get a single party
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id =?`;
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

//delete a party 
app.delete('/api/party/:id', (req, res)=> {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result)=> {
        if (err){
            res.status(400).json({error: res.message});
            //checks if andy thing was deleted
        }else if (!result.affectedRows){
            res.json({
                message:'Party not found'
            });
        }else{
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

//add get route that is for requests not supported by the app
//Default response for any other request(Not found)
app.use((req, res) => {
    res.status(404).end();
});

//function that starts the express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});