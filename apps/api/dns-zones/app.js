var express    = require('express')
var bodyParser = require('body-parser')
var fs         = require('fs')
var config     = require('../api-config.json')

var app        = express()

// Setup rawBody for post requests
app.use(function(req, res, next) {
    req.rawBody = ''
    req.setEncoding('utf8')

    req.on('data', function(chunk) { 
        req.rawBody += chunk
    })

    req.on('end', function() {
        next()
    })
})

// Setup bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var zonesPath = config['dns-zones']['zones-path'] // path must always end with backslash

var router = express.Router()

router.route('/')
    .post(function(req, res) {
        
        if (!validAPIKey(req.query['api-key'])) {
            res.end('Invalid API Key')
        } 

        if (req.query['update']) {
            zone = req.query['update']
            fs.readdir(zonesPath, function(err, data) {
                if (err) {
                    res.end(err)
                } else if (data.indexOf(zone) >= 0) {
                    var buffer = new Buffer(req.rawBody)
                    fs.writeFile(zonesPath + zone, buffer, function(err) {
                        if (err) {
                            res.end(err)
                        } else {
                            res.end('Success')
                        }
                    })
                } else {
                    res.end('No such zone')
                }
            })
        } else {
            res.end('No such API')
        }
    })

    .get(function(req, res) {

        if (!validAPIKey(req.query['api-key'])) {
            res.end('Invalid API Key')
        }
        if (req.query['list'] == 1) {
            fs.readdir(zonesPath, function(err, data) {
                if (err) {
                    res.end(err)
                } else {
                    res.json(data)
                }
            });
        } else if (req.query['get']) {
            zone = req.query['get']
            fs.readdir(zonesPath, function(err, data) {
                if (err) {               
                    res.end(err)
                } else if (data.indexOf(zone) >= 0) {
                    res.sendfile(zonesPath + zone)
                } else {
                    res.end('No such zone')
                }
            })
        } else {
            res.end('No such API')
        }
    })

app.use('/', router);

function validAPIKey(key) {
    if (config['api-keys'].indexOf(key) >= 0) {
        return true
    } else {
        return false
    }
}

exports.app = app
