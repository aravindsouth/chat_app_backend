const express = require('express');
const cors = require('cors')
// const cors = require('cors')({origin: true});
const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/.env' });
const bodyParser = require("body-parser");

const PORT  = process.env.PORT | 3000;
const app = new express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


const StreamChat = require('stream-chat').StreamChat;


const api_key = process.env.CHAT_API_KEY
const api_secret = process.env.CHAT_API_SECRET

const serverStreamClient = StreamChat.getInstance(api_key, api_secret);

const loginRouter = require('./src/routes/loginRoute');
const signupRouter = require('./src/routes/signupRoute');

app.use("/login", loginRouter);
app.use("", loginRouter);
app.use("/signup", signupRouter);

app.get("/", (req, res) => {
    res.send("<h2>Real Time Chat app</h2><p>TCS internship, aravind</p><p>Backend</p>");
})

app.post('/gettoken', (req, res) => {
    // console.log(req)
    try {
    const chat_token = serverStreamClient.createToken(req.body.user_id)
    console.log("chat token: ", chat_token)
    res.status(200).send({token: chat_token, user_id: req.user_id, status: true })
    }
    catch (err) {
        console.log("token creation error: ", err)
    }
})


app.listen(PORT, () => {
    console.log(`app ready on port: ${PORT}`);
})