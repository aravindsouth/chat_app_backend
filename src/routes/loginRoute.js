const express = require('express');
const jwt = require('jsonwebtoken');
const userData = require("../model/UserModel");
const loginRouter = express.Router();
const bcrypt = require('bcrypt')

const StreamChat = require('stream-chat').StreamChat;


const api_key = process.env.CHAT_API_KEY
const api_secret = process.env.CHAT_API_SECRET

const serverStreamClient = new StreamChat(api_key, api_secret);

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
                        try {
                        console.log("chat user id used: ", user._id.toString())
                        const chat_token = serverStreamClient.createToken(user._id.toString())
                        console.log("-- chat token created --")
                        console.log("user token: ", token);
                        res.status(200).send({ 
                            status: true,
                            chattoken: chat_token, 
                            name: user.username, 
                            uid: user._id, 
                            email: user.email,  
                            token 
                        });

                        }
                        catch (err) {
                            console.log("chat token creation error:", err)
                            res.send('token creation error')
                        }

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
