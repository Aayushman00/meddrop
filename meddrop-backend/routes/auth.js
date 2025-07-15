require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const router = express.Router();

/*
    @routes     POST /api/auth/signup
    @desc       Register a new user
*/

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        // user exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // add user to database
        await newUser.save();

        // Generate token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({ success: true, message: "User registered successfully", token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        // finding user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // comparig passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // jwt token 
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email }});

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
