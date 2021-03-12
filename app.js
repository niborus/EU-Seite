const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 8080;
//const url = require("url")

app.use(bodyParser.json());
app.use(cookieParser());

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

function site_name(pathname) {
    if (pathname === '/') {
        return 'index';
    } else if (pathname.endsWith(".html")) {
        const split_path = pathname.split('/');
        const file_name = split_path[split_path.length - 1];
        return file_name.split('.').slice(0, -1).join('.');
    } else {
        return null;
    }
}

app.use((req, res, next) => {
    let userId = req.cookies.userId;
    if ((userId === undefined) || !(users.has(userId)) || !(usersFavorites.has(userId))) {
        userId = uuidv4();
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

    const self_site = site_name(req.path)
    if (self_site != null) {
        const old_count = users.get(userId).get(self_site);
        users.get(userId).set(self_site, old_count+1);
        console.log(`${self_site}: ${old_count+1}`)
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
    console.log("Pos 1:");
    console.log(commentsSite.get(req.body.site_name));
    res.sendStatus(201);
}));

app.get("/comment", ((req, res) => {
    const visitedSite = req.query.site_name;
    const commentList = commentsSite.get(visitedSite);
    console.log("Pos 2:");
    console.log(commentList);
    let response = [];
    commentList.forEach((comment) => {
        response.push({
            "content": comment['content'],
            "username": comment['username'],
            "me": comment['userId'] === req.cookies.userId,
        });
    });
    res.send(response);
}))

app.post("/favorite", (req, res) => {
    usersFavorites.get(req.cookies.userId).set(req.body.site_name, true);
    res.sendStatus(201);
});

app.delete("/favorite", (req, res) => {
    usersFavorites.get(req.cookies.userId).set(req.body.site_name, false);
    res.sendStatus(201);
});

app.get("/favorite", (req, res) => {

    let responseData = [];
    usersFavorites.get(req.cookies.userId).forEach(  (value, key) => {
        if (value === true){
            responseData.push(key);
        }
    },usersFavorites.get(req.cookies.userId));
    console.log("Pos 3:");
    console.log(responseData);
    res.send(responseData);
})

app.get("/access-count", (req, res) => {
    console.log("Pos 6:");
    console.log(req.cookies.userId);
    let response_array = [];
    users.get(req.cookies.userId).forEach((value, key) => {
        if (value > 0) {
            response_array.push({
                "site_name": key,
                "count": value
            });
        }
    });
    response_array.sort((site1, site2) => { return site2['count'] - site1['count']; });
    response_array = response_array.slice(0,3);
    res.send(response_array);
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
