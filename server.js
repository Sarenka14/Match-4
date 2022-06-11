var express = require("express")
var app = express()
const PORT = 3000;
var path = require("path");

app.use(express.static('static'))
app.use(express.text())

let players = []
let kolumna = 2137

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

app.post("/ruch", function (req, res) {
    req.body = JSON.parse(req.body)
    kolumna = req.body.przeslanie
    console.log(kolumna)
    res.send()
})