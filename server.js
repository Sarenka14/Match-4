var express = require("express")
var app = express()
const PORT = 3000;
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

app.post("/reset", function (req, res) {
    players = []
    kolumna = 2137
})

app.post("/ruchBialego", function (req, res) {
    req.body = JSON.parse(req.body)
    kolumnaBiala = req.body.i
    /*let obiekt = { kolumna: kolumnaBiala }
    coll1.insert(obiekt, function (err, newDoc) {
        newDoc._id = "customId"
        console.log("dodano dokument (obiekt):")
        console.log(newDoc)
        console.log("losowe id dokumentu: " + newDoc._id)
    });*/
    console.log(kolumnaBiala)
    res.send()
})

app.post("/ruchCzarnego", function (req, res) {
    req.body = JSON.parse(req.body)
    kolumnaCzarna = req.body.i
    /*let obiekt = { kolumna: kolumnaCzarna }
    coll1.insert(obiekt, function (err, newDoc) {
        newDoc._id = "customId"
        console.log("dodano dokument (obiekt):")
        console.log(newDoc)
        console.log("losowe id dokumentu: " + newDoc._id)
    });*/
    console.log(kolumnaCzarna)
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