var app     = require('express')()
var process = require('child_process')
var config  = require('../api-config.json')

app.get('/', function(req, res) {
    if (!validAPIKey(req.query['api-key'])) {
        res.end('Invalid API Key')
    }
    
    var count = req.query['count'] || config['ping']['count']
    var timeout = req.query['timeout'] || config['ping']['timeout']
    var host = req.query['host'] || ''

    var cmd = process.exec('ping -c ' + count + ' -W ' + timeout + ' ' + host)
    cmd.stdout.pipe(res)
})

function validAPIKey(key) {
    if (config['api-keys'].indexOf(key) >= 0) {
        return true
    } else {
        return false
    }
}

exports.app = app
