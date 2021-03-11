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

app.use((req, res, next) => {
    if (req.cookies.userId === undefined) {
        let userId = uuidv4();
        let accessCounter = new Map();
        accessCounter.set("index", [0,"Startseite"]).set("mitgliedstaaten", [0, "Mitgliedsstaaten"]).set("organe", [0,"Organe"]).set("parteien", [0, "Parteien"]).set("quiz", [0,"Quiz"]);
        users.set(userId,accessCounter)
        res.cookie("userId", userId);
        res.redirect("/index.html");
        res.send();
    } else {
        next();
    }

});

app.use("/", express.static(__dirname + "/static"));

app.post("/favorite", (req, res) => {

});

app.get("/favorite", (req, res) => {

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
