
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });
  

const toiletSchema = new mongoose.Schema({
    //latitude and longitude
    lat:{
        type: Number,
        required: true
    },
    lng:{
        type: Number,
        required: true
    }, 
    //geojson object, needs type:'Point' and stuff.
    location: {
        type: pointSchema,
        index:'2dsphere'
    },
    owner:{
        type:ObjectId,
        ref:"User"
    },
    toiletType:{
      type: String, 
      default: "i"
    }, 
    restroomPrice:{
        type: Number,
        // required: true
    },
    bathroomPrice:{
        type: Number,
        default: -1
    },//if -1 then no bathing allowed.
    photos:{
        type: [String]
        //by default it's an empty array.
    },
    hasToiletPaper:{
        type: Boolean,
        default: false
    },
    gender:{
        type: String,
        default: "c"
    },
    /*
    "a" - only females
    "b" - only males
    "c" - both
    */
    differentlyAbled:{
        type: Boolean,
        default: false
    },
    isPublic:
    {
        type:Boolean, 
        default:false
    }, 
    description:{
        type: String,
        // required: true
    },
    landmarkName:{
        type:String, 
    },
    avgRating:{
        type:Number,
        default: -1
    },
    usersWhoRated:{
        type: [ObjectId],
        ref: "User"
    },
    isAvailable:{
        type: Boolean,
        default: true
    }
});


module.exports = mongoose.model("Toilet", toiletSchema, 'newToilets');