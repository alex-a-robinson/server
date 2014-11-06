var express = require('express')
var vhost   = require('vhost')

express()
    .use(vhost('api.begly.co.uk',    require('./apps/api/router.js').app))
    .use(vhost('ip.begly.co.uk',     require('./apps/ip/public-ip/app.js').app))
    .listen(3000)
