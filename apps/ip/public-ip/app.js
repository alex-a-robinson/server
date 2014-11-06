var express = require('express')
var app     = express()

app.get('/', function(req, res) {
    res.end(req.connection.remoteAddress)
})

exports.app = app
