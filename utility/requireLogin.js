/*
Middleware:
requireLogin - checks if bearer token for a logged-in user is valid
*/
var express = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


var mongoose = require('mongoose');
var db = require('./db.js');
var User = require("../models/user");

const requireLogin = (req, res, next) => {
    const {authorization} = req.headers;
    //authorization === Bearer ewefwegwrherhe
    if(!authorization){
        console.log("No auth bearer"); 
       return res.status(401).json({error:"You must be logged in to access this"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,process.env.jwt_secret, (err, payload) => {
        if(err){
            console.log(err);
            return res.status(401).json({error:"You must be logged in to access this"})
        }

        const {_id} = payload;
        User.findById(_id).then(userdata => {
            req.user = userdata;
            next();
        });
        
        
    });
};

module.exports = requireLogin