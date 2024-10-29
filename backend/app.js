const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
require('dotenv').config();


const app = express();
app.use(express.json()); 

const corsOptions = {
    origin:"http://localhost:3000",
    methods: "GET,POST,PATCH,DELETE",
    allowedHeaders:['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({limit: '100mb'}));


const databaseURI = "mongodb://localhost:27017/ansydb";

mongoose.connect(databaseURI)
 .then(() => console.log("Connected to database"))
 .catch(err => console.log("Error connecting to database: ", err));



app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        console.log(newUser);


        res.json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "An error occurred during registration" });
    }
});



app.post('/login', async (req, res) => {
    // try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, hasSubscription: user.hasSubscription },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(200).json({ message: "Login successful", token });
    // } catch (error) {
    //     res.status(500).json({ error: "An error occurred during login" });
    // }
});



app.post('/auth/validate-token', (req, res) => {
    const token = req.body['token'];
    if (!token) return res.status(401).json({ message: 'Token missing' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) { return res.status(401).json({ message: 'Invalid token' });
      console.log("helo")
    }
      res.json({ message: 'Token is valid', user: decoded });
    });
  });

app.listen(8000, () => {
    console.log("Server started at port 8000");
});
