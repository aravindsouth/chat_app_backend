const express = require('express');
const jwt = require('jsonwebtoken');
const userData = require("../model/UserModel");
const bcrypt = require('bcrypt')

const signupRouter = express.Router();

// using bcrypt
signupRouter.post("/", function(req, res){
    var hashedPassword;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(error, hash) {
              
        if (err) {
            return console.log('Cannot encrypt');
        }
            hashedPassword = hash;
            console.log("hashed password: ", hashedPassword)
            var newUser = {
                username: req.body.username,               
                email: req.body.email,
                password: hashedPassword
            };
            console.log("signup started")
            console.log("user received: ", newUser);
            userData.findOne({ "email": newUser.email }, (error, user) => {
                console.log("error=" + error);
                console.log("user=" + user);
                if (error) {
                    console.log(error)
                }
                else if (user) {
                    console.log("user exists");
                    res.json({ status: false, reason: "user exists" });
                }
                else {
                    var userAdd = new userData({
                        username: newUser.username,
                        email: newUser.email,
                        password: newUser.password
                    });
                    userAdd.save((error, newuser) => {
                        console.log('Saved new user=' + newuser)
                        console.log("error=" + error)
                        if (error) {
                            console.log(error)
                            res.json({ status: false })
                        } else {
                            console.log("success new user added")
                            res.json({ status: true })
                        }

                    })
                }
            })

        })
    })
})

module.exports = signupRouter;