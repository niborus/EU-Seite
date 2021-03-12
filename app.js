const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 8080;
//const url = require("url")

app.use(bodyParser.json());
app.use(cookieParser());
let List = require("collections/list");

let users = new Map();
let usersFavorites = new Map();
let commentsSite = new Map();
commentsSite
    .set("index", [])
    .set("mitgliedstaaten", [])
    .set("organe", [])
    .set("parteien", [])
    .set("quiz-solutions", [])
    .set("quiz", []);

app.use((req, res, next) => {
    const cookieUserId = req.cookies.userId
    if ((cookieUserId === undefined) || !(users.has(cookieUserId)) || !(usersFavorites.has(cookieUserId))) {
        let userId = uuidv4();
        let accessCounter = new Map();
        accessCounter
            .set("index", 0)
            .set("mitgliedstaaten", 0)
            .set("organe", 0)
            .set("parteien", 0)
            .set("quiz-solutions", 0)
            .set("quiz", 0);
        let favoriteSites = new Map();
        favoriteSites
            .set("index", false)
            .set("mitgliedstaaten", false)
            .set("organe", false)
            .set("parteien", false)
            .set("quiz-solutions", false)
            .set("quiz", false);
        users.set(userId,accessCounter);
        usersFavorites.set(userId, favoriteSites);
        res.cookie("userId", userId);
    }
    next();

});

app.use("/", express.static(__dirname + "/static"));

app.post("/comment", ((req, res) => {
    const visitedSite = req.body.site_name;
    const commentList = commentsSite.get(visitedSite);
    let comment = {
        userId : req.cookies.userId,
        username: req.body.username,
        content : req.body.content
    }
    commentList.push(comment);
    console.log("Pos 1:")
    console.log(commentsSite.get(req.body.site_name));
    res.sendStatus(201);
}));

app.get("/comment", ((req, res) => {
    const visitedSite = req.query.site_name;
    const commentList = commentsSite.get(visitedSite);
    console.log("Pos 2:")
    console.log(commentList);
    res.send(commentList);
}))

app.post("/favorite", (req, res) => {
    usersFavorites.get(req.cookies.userId).set(req.body.site_name, true)
    res.sendStatus(201);
});

app.delete("/favorite", (req, res) => {
    usersFavorites.get(req.cookies.userId).set(req.body.site_name, false)
    res.sendStatus(201);
});

app.get("/favorite", (req, res) => {

    let responseData = [];
    usersFavorites.get(req.cookies.userId).forEach(  (value, key) => {
        if (value === true){
            responseData.push(key);
        }
    },usersFavorites.get(req.cookies.userId));
    console.log("Pos 3:")
    console.log(responseData);
    res.send(responseData);
})


app.post("/access-count", (req, res) => {
    const visitedSite = req.body.site_name;
    console.log("Pos 4&5:")
    console.log(users.get(req.cookies.userId).get(visitedSite));
    users.get(req.cookies.userId)
        .set(visitedSite, users.get(req.cookies.userId).get(visitedSite) + 1);
    console.log(users.get(req.cookies.userId).get(visitedSite));
    res.sendStatus(201);
});

app.get("/access-count", (req, res) => {
    console.log("Pos 6:")
    console.log(req.cookies.userId)
    let response_array = []
    users.get(req.cookies.userId).forEach((value, key) => {
        response_array.push({
            "site_name": key,
            "count": value
        })
    });
    res.send(response_array);
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
