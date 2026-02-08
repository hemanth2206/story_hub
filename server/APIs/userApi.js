const exp = require('express');
const userApp = exp.Router();
const UserAuthor = require("../models/userAuthorModel");
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor");
const Article = require("../models/articleModel");


userApp.post("/user", expressAsyncHandler(createUserOrAuthor));

userApp.post("/login", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserAuthor.findOne({ email, role: "User" });

        console.log("Login attempt:", email); 
        console.log("User found:", user); 

        if (!user) {
            console.log("Invalid email"); 
            return res.status(401).send({ message: "Invalid email" });
        }

        if (user.isActive === false) { 
            console.log("Blocked user trying to login:", email); 
            return res.status(403).send({ message: "Your account has been blocked by the admin" });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).send({ message: "Login successful", token });
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});



userApp.get('/articles', expressAsyncHandler(async (req, res) => {
    const category = req.query.category;
    let filter = { isArticleActive: true };

    if (category && category !== '') {
        filter.category = category;
    }

    const listOfArticles = await Article.find(filter).populate('authorData', 'nameOfAuthor profileImageUrl');

    if (listOfArticles.length > 0) {
        res.status(200).send({ message: "articles", payload: listOfArticles });
    } else {
        res.status(200).send({ message: "No articles found for this category" });
    }
}));


userApp.put('/comment/:articleId', expressAsyncHandler(async (req, res) => {
    const commentObj = req.body;

    const articleWithComments = await Article.findOneAndUpdate(
        { articleId: req.params.articleId },
        { $push: { comments: commentObj } },
        { returnOriginal: false }
    );

    res.status(200).send({ message: "comment added", payload: articleWithComments });
}));

module.exports = userApp;
