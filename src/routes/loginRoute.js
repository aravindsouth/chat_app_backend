const express = require('express');
const jwt = require('jsonwebtoken');
const userData = require("../model/UserModel");
const loginRouter = express.Router();
const bcrypt = require('bcrypt')


// using bcrypt
loginRouter.post("/", function(req, res) {
    var checkUser = {
        email: req.body.email,
        pwd: req.body.password
    };
    try {
        userData.findOne({"email": checkUser.email}, (error, user) => {
            console.log(user)
            if (error) {
                console.log(error);
            }else {
                bcrypt.compare(checkUser.pwd, user.password, (err, response)=> {
                    if (err) return err;
                    if(!response) {
                        res.json({status:false}).status(401);
                    }else {
                        let payload = { subject: checkUser.email + checkUser.password };
                        let token = jwt.sign(payload, "userKey");
                        console.log("user token: ", token);
                        res.status(200).send({ 
                            status: true, 
                            name: user.username, 
                            uid: user._id, 
                            email: user.email,  
                            token 
                        });
                    }
                })
            }
        })
    }
    catch(e) {
        console.log(error)
        res.send(e)
    }
})


module.exports = loginRouter;
