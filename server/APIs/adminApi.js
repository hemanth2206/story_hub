const express = require("express");
const adminApp = express.Router();
const UserAuthor = require("../models/userAuthorModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; 


adminApp.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL) {
        return res.status(401).send({ success: false, message: "Incorrect email" });
    }


    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (!isMatch) {
        return res.status(401).send({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    return res.status(200).send({ success: true, message: "Login successful", token });
});



adminApp.get("/all-users", async (req, res) => {
    try {
        const users = await UserAuthor.find({}, "-__v -password");
        res.status(200).send({ message: "Users and Authors retrieved", payload: users });
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});


adminApp.put("/toggle-block/:id", async (req, res) => {
    try {
        const user = await UserAuthor.findById(req.params.id);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).send({ message: `User ${user.isActive ? "unblocked" : "blocked"}`, isActive: user.isActive });
    } catch (error) {
        res.status(500).send({ message: "Failed to update user status" });
    }
});


module.exports=adminApp;