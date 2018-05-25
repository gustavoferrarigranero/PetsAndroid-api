const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const config = require('./config/db');
const Pet = require('./api/pets/pet');
const UserRoute = require('./api/users/userRoute');
const PetRoute = require('./api/pets/petRoute');

const PORT = process.env.PORT;

mongoose.connect(config.DB).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err)
});

app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/user', UserRoute);
app.use('/pet', PetRoute);

app.listen(PORT, function(){
    console.log('Your node js server is running on PORT:', PORT);
    console.log('Databse:', config.DB);
});