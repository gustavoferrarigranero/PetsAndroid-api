const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();
const config = require('./config/index');
const router = express.Router();
const User = require('./api/users/user');
const Pet = require('./api/pets/pet');
const UserRoute = require('./api/users/userRoute');
const PetRoute = require('./api/pets/petRoute');

const PORT = process.env.PORT;

mongoose.connect(config.DB).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err)
});

app.set('superSecret', config.secret);

app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('dev'));

router.post('/authenticate', function(req, res) {

    User.findOne({ user: req.body.user }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            if (user.pass != req.body.pass) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                const payload = {
                        user: user 
                    };

                var token = jwt.sign(payload, app.get('superSecret'), {
                        expiresIn : 60*60*24 // expires in 24 hours
                    });

                res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
            }   
        }
    });
});

// route middleware to verify a token
router.use(function(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
    if (token) {
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                req.decoded = decoded;    
                next();
            }
        });
  
    } else {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
  
    }
});

router.use('/user', UserRoute);
router.use('/pet', PetRoute);
app.use('/api', router);

app.listen(PORT, function(){
    console.log(app.get('superSecret'));
    console.log('Your node js server is running on PORT:', PORT);
    console.log('Databse:', config.DB);
});