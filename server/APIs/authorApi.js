const exp = require('express');
const authorApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require('./createUserOrAuthor');
const Article = require("../models/articleModel");
const UserAuthor = require("../models/userAuthorModel");
const { requireAuth } = require("@clerk/express");
require('dotenv').config();


authorApp.post("/author", expressAsyncHandler(createUserOrAuthor));


authorApp.post("/login", async (req, res) => {
    try {
        const { email } = req.body;
        const author = await UserAuthor.findOne({ email, role: "Author" });

        console.log("Login attempt:", email); 
        console.log("Author found:", author); 

        if (!author) {
            console.log("Invalid email"); 
            return res.status(401).send({ message: "Invalid email" });
        }

        if (author.isActive === false) { 
            console.log("Blocked author trying to login:", email); 
            return res.status(403).send({ message: "Your account has been blocked by the admin" });
        }

        const token = jwt.sign({ authorId: author._id, email: author.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).send({ message: "Login successful", token });
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});



authorApp.post("/article", expressAsyncHandler(async (req, res) => {
    const newArticle = new Article(req.body);
    const articleObj = await newArticle.save();
    res.status(201).send({ message: "article published", payload: articleObj });
}));

authorApp.get('/articles', requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
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


authorApp.get('/unauthorized', (req, res) => {
    res.send({ message: "Unauthorized request" });
});


authorApp.put('/article/:articleId', requireAuth({ signInUrl: "unauthorized" }), expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body;
    const latestArticle = await Article.findByIdAndUpdate(
        modifiedArticle._id,
        { ...modifiedArticle },
        { returnOriginal: false }
    );
    res.status(200).send({ message: "article modified", payload: latestArticle });
}));


authorApp.put('/articles/:articleId', expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body;
    const latestArticle = await Article.findByIdAndUpdate(
        modifiedArticle._id,
        { ...modifiedArticle },
        { returnOriginal: false }
    );
    res.status(200).send({ message: "article deleted or restored", payload: latestArticle });
}));

module.exports = authorApp;
