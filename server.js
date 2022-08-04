const { ifError } = require('assert');
const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//use apiRoutes
app.use('/api', apiRoutes);

//add get route that is for requests not supported by the app
//Default response for any other request(Not found)
app.use((req, res) => {
    res.status(404).end();
});

//start server after DB connection
db.connect(err => {
    if(err) throw err;
    console.log('Database Connected.');
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    });
});