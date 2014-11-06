var express = require('express')
var app = express()

app.use('/api/dns-zones', require('./dns-zones/app.js').app)
app.use('/api/ping', require('./ping/app.js').app)

exports.app = app

