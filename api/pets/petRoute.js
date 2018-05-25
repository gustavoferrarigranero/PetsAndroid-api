const express = require('express');
const app = express();
const router = express.Router();

const Pet = require('./pet');

router.route('/').post(function (req, res) {
    const pet = new Pet(req.body);
    pet.save().then(pet => {
        res.status(200).json(pet);
      })
      .catch(err => {
        res.status(400).send("unable to save the Document into database");
      });
  });

// Defined get data(index or listing) route
router.route('/').get(function (req, res) {
  Pet.find(function (err, pets){
    if(err){
      console.log(err);
    }
    else {
      res.json(pets);
    }
  });
});

//  Defined update route
router.route('/:id').put(function (req, res) {
  Pet.findById(req.params.id, function(err, pet) {
    if (!pet)
      return next(new Error('Could not load Document'));
    else {

      pet.name = req.body.name;
      pet.age = req.body.age;
      pet.picture = req.body.picture;

      pet.save().then(pet => {
          res.json(pet);
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
router.route('/:id').delete(function (req, res) {
  Pet.findByIdAndRemove({_id: req.params.id}, function(err, pet){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = router;