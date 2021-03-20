var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const requireLogin = require('../utility/requireLogin.js')

var mongoose = require('mongoose');
var db = require('../utility/db.js');
var User = require("../models/user");
var Toilet = require("../models/toilet");

//adds a new user to db, requires {name, email, password}
router.post('/signup', (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!email || !name || !password ||!phone) {
        res.status(422).json({ error: "Some arguments are missing" });
    }

    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "An user already exists with this email" });
            }
            bcrypt.hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        name,
                        email,
                        password:hashedPassword,
                        phone
                    });
                    user.save()
                        .then(() => {
                            res.json({ message: "Saved successfully" })
                        })
                        .catch((error) => {
                            console.log(error);
                        });


                })


        });
})

//logs in a user, requires {email, password}
router.post('/login', (req, res) => {
    const {email, password} = req.body
    if(!email||!password){
        return res.status(422).json({error:"Email or password is missing"});
    }
    User.findOne({email:email})
        .then(savedUser => {
            if(!savedUser){
                return res.status(422).json({error:"No accounts exists with this email"})
            }        
            bcrypt.compare(password, savedUser.password)
                .then( (matches) => {
                    if(matches){
                        //res.json({message:"Successfully signed in"})
                        const token = jwt.sign({_id:savedUser._id}, process.env.jwt_secret)
                        res.json({token, user:savedUser})
                    }
                    else{
                        return res.status(422).json({error:"Invalid password or email"})
                    }
                })
                .catch( (error) => {
                    console.log(error)
                })
        })

})

//gets user data
router.get('/userData', requireLogin, (req, res) => {
    const {authorization} = req.headers;
    //req body/json => "bearer":"lfsjiejfoljoljffw"
    const id = jwt.decode(authorization.replace("Bearer ",""))
    User.findById(id).lean().exec( (error, users) => {
        if(!error){
            return res.end(JSON.stringify(users))
        }
        else{
            res.status(404).send(error)
        }
        
    })
})

module.exports = router;