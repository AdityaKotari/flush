var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const requireLogin = require('../utility/requireLogin.js')

var mongoose = require('mongoose');
var db = require('../utility/db.js');
var User = require("../models/user");
var Toilet = require("../models/toilet");
const toilet = require('../models/toilet');
var ObjectId = require('mongoose').Types.ObjectId


router.post('/newToilet', requireLogin, (req, res) => {
  const {lng, lat, restroomPrice, bathroomPrice, description, photos, hasToiletPaper, differentlyAbled, gender, landmarkName, toiletType, isPublic } = req.body;

  if( !lng ||!lat || !restroomPrice || hasToiletPaper===null || !gender || !landmarkName || !toiletType ){
    return res.status(422).json({error:"Null fields are not allowed"})
  }
  const toilet = new Toilet({
    lat,
    lng,
    location: {
      type:"Point",
      coordinates:[lng, lat]
    },
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

router.get("/nearbyToilets", (req, res) => {
  const {maxDistance, lng, lat} = req.query;
  if(!lng||!lat){
    res.status(422).json({ error: "Both lat and lng need to be present!" });
  }
  console.log(req.query)
      Toilet.find({
        location: {
         $nearSphere: {
          $maxDistance: Number(maxDistance)||(10000), //meters
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          }
         }
        }
      },'_id lat lng')
      .find((error, result) => {
        if(error) 
          console.log(error);
        //console.log("nearby toilets called, "+(result)?result.length:"0"+" Toilets found nearby.")
        res.json(result);
       });
});

router.get("/ownerToilets", requireLogin, async (req, res) => {
  try{
    const toiletArray = await Toilet.find({
      'owner': (ObjectId)(req.user._id) 
    }).populate("owner");
    res.json(toiletArray);
    console.log("owner toilets called, "+req.user._id)
}
catch (error){
    res.status(422).send(error);
}
 })

router.get("/allToilets", async (req, res) => {
    try{
        const toiletArray = await Toilet.find({}).populate("owner");
        res.json(toiletArray);
        console.log("all toilets called")
    }
    catch (error){
        res.status(422).send(error);
    }
});

router.post("/changeAvailability", requireLogin, async (req, res) => {
    const {toilet_id} = req.body;
    console.log("change avail re")
    Toilet.findOne({ _id: toilet_id }, function(err, toilet) {
      if(!toilet){
        console.log(toilet);
        return res.status(422).json({error:"This toilet doesn't exist."})
   
   }
      //console.log({toilet})
      if(String(toilet.owner)!==String(req.user._id)){
           return res.status(422).json({error:"You do not own this toilet! toilet owner- " +toilet.owner+" and you - "+req.user._id})
      
      }
      
      toilet.isAvailable = !toilet.isAvailable;
      toilet.save()
      .then(() => {
        res.json({message:"Changed availability successfully"})
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

router.post("/newRating", requireLogin,  async (req, res) => {
  const {toilet_id, rating} = req.body;
  console.log(req.body)
  Toilet.findOne({ _id: toilet_id }, function(err, toilet) {
    // if(toilet.usersWhoRated.includes(req.user._id)){
    //   return res.status(422).json({error:"You have already voted!"})
      
    // }
    if(toilet.avgRating===-1){
      toilet.avgRating===0;
    }
    toilet.avgRating=(toilet.avgRating*toilet.usersWhoRated.length+rating)/(toilet.usersWhoRated.length+1);
    toilet.usersWhoRated.push(req.user._id); //This is from requireLogin(uses the bearer code there)
    toilet.save()
    .then((data) => {
      console.log(data)
      res.json(data)
    })
    .catch((error) => {
      console.log(error);
    });
});
});


router.post("/oneToilet", requireLogin,  async (req, res)=>{
  const { toilet_id } = req.body; 
  try
  {
       const theToilet = await toilet.findOne({_id: toilet_id}).populate("owner");
      if (theToilet)
      {
        res.json(theToilet)
      }
      else
      {
        res.status(422).json({error:"No such toilet exists"})
      }
  }
  catch (e) 
  {
    console.log(e)
    res.status(422).json({error:"Error"})
  }
  
})

module.exports = router;