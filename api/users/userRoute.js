const express = require('express');
const app = express();
const router = express.Router();

const User = require('./user');

// Define post route
router.route('/').post(function (req, res) {
  const user = new User(req.body);
  user.save().then(user => {
      res.status(200).json({'user': user});
    })
    .catch(err => {
      res.status(400).send("unable to save the user into database");
    });
});

// Add pets to User
router.route('/:id/pet/:pet').post(function (req, res) {
  User.findById(req.params.id, function(err, user) {
    if (!user)
      return next(new Error('Could not load Document'));
    else {
      user.pets.push(req.params.pet);

      user.save().then(user => {
          res.json(user);
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Add pets to User
router.route('/:id/pet/:pet').delete(function (req, res) {
  User.findById(req.params.id, function(err, user) {
    if (!user)
      return next(new Error('Could not load Document'));
    else {
      user.pets.remove(req.params.pet);

      user.save().then(user => {
          res.json(user);
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined get data(index or listing) route
router.route('/').get(function (req, res) {
  User.find().populate('pets').exec(function (err, users){
    if(err){
      console.log(err);
    }
    else {
      res.json(users);
    }
  });
});

//  Defined update route
router.route('/:id').put(function (req, res) {
  User.findById(req.params.id, function(err, user) {
    if (!user)
      return next(new Error('Could not load Document'));
    else {
      user.name = req.body.name;
      user.user = req.body.user;
      user.pass = req.body.pass;

      user.save().then(user => {
          res.json('Successfully Updated');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
router.route('/:id').delete(function (req, res) {
  User.findByIdAndRemove({_id: req.params.id}, function(err, user){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = router;