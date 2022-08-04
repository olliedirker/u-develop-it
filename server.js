const { ifError } = require('assert');
const express = require('express');
const db = require('./db/connection');
const inputCheck = require('./utils/inputCheck');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes);

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