var express = require("express")
var app = express()
const PORT = process.env.PORT;
var path = require("path");

app.use(express.static('static'))
app.use(express.text())

let players = []
let kolumnaBiala = 2137
let kolumnaCzarna = 2137

const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

app.post("/getWinners", function (req, res) {
    coll1.find({}, (err, docs) => {
        docs = docs.map((doc) => { return doc.graczWygrany })
        console.log(docs)
        res.end(JSON.stringify({ winners: docs }))
    })
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

app.post("/", function (req, res) {
    userLogin = req.body
    if (players.length == 0) {
        players.push(userLogin)
        let color = "white"
        const jsonBack = { color: color, login: userLogin }
        res.end(JSON.stringify(jsonBack))
    }
    else if (players.length == 1 && players[0] != userLogin) {
        players.push(userLogin)
        let color = "black"
        const jsonBack = { color: color, login: userLogin }
        res.end(JSON.stringify(jsonBack))
    }
    else if (players.length >= 2) {
        const color = "no color"
        const jsonBack = { color: color, login: userLogin }
        res.end(JSON.stringify(jsonBack))
    }
    else {
        const jsonBack = { color: "login powtórzony", login: "login powtórzony" }
        res.end(JSON.stringify(jsonBack))
    }
})

app.post("/checkLogin", function (req, res) {
    if (players.length == 2) {
        const jsonBack = { users: 2 }
        res.end(JSON.stringify(jsonBack))
    } else if (players.length == 1) {
        const jsonBack = { users: 1 }
        res.end(JSON.stringify(jsonBack))
    } else {
        const jsonBack = { users: 0 }
        res.end(JSON.stringify(jsonBack))
    }
})

app.post("/reset", function (req, res) {
    players = []
})

app.post("/ruchBialego", function (req, res) {
    req.body = JSON.parse(req.body)
    kolumnaBiala = req.body.i
    res.send()
})

app.post("/ruchCzarnego", function (req, res) {
    req.body = JSON.parse(req.body)
    kolumnaCzarna = req.body.i
    res.send()
})

app.post("/odeslanieOdBialego", function (req, res) {
    res.send(JSON.stringify({ kolumnaBiala }))
    kolumnaBiala = 2137
})

app.post("/odeslanieOdCzarnego", function (req, res) {
    res.send(JSON.stringify({ kolumnaCzarna }))
    kolumnaCzarna = 2137
})

app.post("/wygrywaBialy", function (req, res) {
    console.log(players[0])
    const doc = {
        graczWygrany: players[0]
    };
    coll1.insert(doc, function (err, newDoc) { });
    res.send()
})

app.post("/wygrywaCzarny", function (req, res) {
    console.log(players[1])
    const doc = {
        graczWygrany: players[1]
    };
    coll1.insert(doc, function (err, newDoc) { });
    res.send()
})