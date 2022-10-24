const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/.env' });
const bodyParser = require("body-parser");

const PORT  = process.env.PORT | 3000;
const app = new express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const loginRouter = require('./src/routes/loginRoute');
const signupRouter = require('./src/routes/signupRoute');

app.use("/login", loginRouter);
app.use("", loginRouter);
app.use("/signup", signupRouter);

app.get("/", (req, res) => {
    res.send("<h2>Real Time Chat app</h2><p>TCS internship, aravind</p><p>Backend</p>");
})


app.listen(PORT, () => {
    console.log(`app ready on port: ${PORT}`);
})