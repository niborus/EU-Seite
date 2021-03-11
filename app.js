const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 3000;
//const url = require("url")

app.use(bodyParser.json());
app.use(cookieParser());
let List = require("collections/list");

let users = new Map();
let usersFavorites = new Map();
let commentsIndex = new List();
let commentsMitgliedsstaaten = new List();
let commentsOrgane = new List();
let commentsParteien = new List();
let commentsQuiz = new List();
let commentsSite = new Map();
commentsSite.set("index", commentsIndex).set("mitgliedstaaten", commentsMitgliedsstaaten).set("organe", commentsOrgane).set("parteien", commentsParteien).set("quiz", commentsQuiz);

app.use((req, res, next) => {
    if (req.cookies.userId === undefined) {
        let userId = uuidv4();
        let accessCounter = new Map();
        accessCounter.set("index", [0,"Startseite"]).set("mitgliedstaaten", [0, "Mitgliedsstaaten"]).set("organe", [0,"Organe"]).set("parteien", [0, "Parteien"]).set("quiz", [0,"Quiz"]);
        let favoriteSites = new Map();
        favoriteSites.set("index", false).set("mitgliedstaaten", false).set("organe", false).set("parteien", false).set("quiz", false);
        users.set(userId,accessCounter);
        usersFavorites.set(userId, favoriteSites);
        res.cookie("userId", userId);
        res.redirect("/index.html");
        res.send();
    } else {
        next();
    }

});

app.use("/", express.static(__dirname + "/static"));

app.post("/comment", ((req, res) => {
    const visitedSite = req.body.sitename;
    const commentList = commentsSite.get(visitedSite);
    let comment = {
        userId : req.cookies.userId,
        userName: req.body.name,
        comment : req.body.comment
    }
    commentList.push(comment);
    console.log(commentsSite.get(req.body.sitename));
    res.sendStatus(200);
}));

app.get("/comment", ((req, res) => {
    const visitedSite = req.body.sitename;
    const commentList = commentsSite.get(visitedSite);
    console.log(commentList);
    res.send(commentList.toJSON());
}))

app.post("/favorite", (req, res) => {
    const visitedSite = req.body.sitename;
    const currentState = usersFavorites.get(req.cookies.userId).get(visitedSite);
    usersFavorites.get(req.cookies.userId).set(visitedSite, !currentState);
    res.sendStatus(200);
});

app.get("/favorite", (req, res) => {

    let responseData = [];
    usersFavorites.get(req.cookies.userId).forEach(  (value, key) => {
        if (value === true){
            responseData.push(key);
        }
    },usersFavorites.get(req.cookies.userId));
    console.log(responseData);
    res.send(responseData);
})


app.post("/access-count", (req, res) => {
    const visitedSite = req.body.sitename;
    console.log(users.get(req.cookies.userId).get(visitedSite)[0]);
    users.get(req.cookies.userId).set(visitedSite, [users.get(req.cookies.userId).get(visitedSite)[0] + 1, users.get(req.cookies.userId).get(visitedSite)[1]]);
    console.log(users.get(req.cookies.userId).get(visitedSite)[0]);
    res.sendStatus(200);
});

app.get("/access-count", (req, res) => {
    let maxCount = -1;
    let maxSite = "";
    console.log("test");
    users.get(req.cookies.userId).forEach(  (value, key) => {
      if (value[0] > maxCount) {
          console.log(value[0]);
          console.log(key);
          maxCount = value[0];
          maxSite = key;
      }
    },users.get(req.cookies.userId));
    res.send(JSON.stringify(
        {maxSite:{
            "title":users.get(req.cookies.userId).get(maxSite)[1],
            "count": maxCount
    }}));
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

//app.listen(PORT, HOST);
//console.log(`Running on http://${HOST}:${PORT}`);
