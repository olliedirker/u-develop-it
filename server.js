const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
//express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

  //add get route that is for requests not supported by the app
  //Default response for any other request(Not found)
  app.use((req, res)=> {
    res.status(404).end();
  });

//function that starts the express.js server on port 3001
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});