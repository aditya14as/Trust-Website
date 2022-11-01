const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config();
const {connectDB} = require('./config/connectDB');
const authRouter = require('./routers/authRouter');
const contactUsRouter = require('./routers/contactUsRouter');


app.use(cors());


//Connecting Database
const DATABASE_URL = process.env.DATABASE_URL;
connectDB(DATABASE_URL);

app.use(express.json());


app.get('/',(req,res)=>{
    res.send("Hello World");
})

// Routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/contactus',contactUsRouter);

//Listening Server
const Port = process.env.Port || 8080;
app.listen(Port,()=>{
    console.log(`Server listening at http://localhost:${Port}`);
})