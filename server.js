/*
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = {}; // Simulated database

// Nodemailer setup (Replace with actual email service)
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password"
    }
});

// Register user
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (users[email]) {
        return res.json({ message: "User already exists. Please login." });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    users[email] = { name, password, verified: false, verificationToken };

    const verificationLink = `http://localhost:5000/verify?email=${email}&token=${verificationToken}`;

    transporter.sendMail({
        to: email,
        subject: "Verify Your Email",
        text: `Click this link to verify your email: ${verificationLink}`
    });

    res.json({ message: "Registration successful. Check your email to verify." });
});

// Verify user
app.get("/verify", (req, res) => {
    const { email, token } = req.query;

    if (users[email] && users[email].verificationToken === token) {
        users[email].verified = true;
        return res.send("Email verified! You can now log in.");
    }

    res.send("Invalid or expired verification link.");
});

// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!users[email]) {
        return res.json({ message: "User not found." });
    }

    if (users[email].password !== password) {
        return res.json({ message: "Incorrect password." });
    }

    if (!users[email].verified) {
        return res.json({ message: "Email not verified.", verified: false });
    }

    res.json({ message: "Login successful.", verified: true, user: { email, name: users[email].name } });
});

app.listen(5000, () => console.log("Server running on port 5000"));
