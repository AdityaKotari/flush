var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const requireLogin = require('../utility/requireLogin.js')

var mongoose = require('mongoose');
var db = require('../utility/db.js');
var User = require("../models/user");
var Toilet = require("../models/toilet");


router.post('/newToilet', requireLogin, (req, res) => {
  const {lng, lat, restroomPrice, bathroomPrice, description, photos, hasToiletPaper, differentlyAbled, gender, landmarkName, toiletType, isPublic } = req.body;

  if( !lng ||!lat || !restroomPrice || hasToiletPaper===null || !gender || !landmarkName || !toiletType ){
    return res.status(422).json({error:"Null fields are not allowed"})
  }
  const toilet = new Toilet({
    lat,
    lng,
    owner: req.user || "", 
    restroomPrice,
    bathroomPrice,
    hasToiletPaper,
    photos: photos, 
    description, 
    gender,
    differentlyAbled,
    landmarkName, 
    toiletType

  })
  toilet.save()
    .then(() => {
      res.json({message:"Saved successfully"})
    })
    .catch((error) => {
      console.log(error);
    });

});


router.get("/allToilets", async (req, res) => {
    try{
        const toiletArray = await Toilet.find({}).populate("owner");
        res.json(toiletArray);
    }
    catch (error){
        res.status(422).send(error);
    }
});

module.exports = router;