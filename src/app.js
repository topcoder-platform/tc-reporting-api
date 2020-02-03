'use strict'

import _ from 'lodash'
import config from 'config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import router from './routes'
import permissions from './permissions'
import coreLib from 'tc-core-library-js'
import expressRequestId from 'express-request-id'

var app = express()

// =======================
// configuration =========
// =======================


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// add request Id
var addRequestId = expressRequestId()
app.use(addRequestId)

// CWD-- cors handling
app.use(cors())

// =======================
// Loger =========
// =======================

let appName = 'tc-lookv3-service'


var logger = coreLib.logger({
  name: appName,
  level: _.get(config, "logLevel", 'debug').toLowerCase(),
  captureLogs: config.get('captureLogs'),
  logentriesToken: _.get(config, 'logentriesToken', null)
})
app.use(coreLib.middleware.logger(null, logger))
app.logger = logger


// ========================
// Permissions
// ========================
// require('app/permissions')()
permissions()

// ========================
// Routes
// ========================

app.use(router)
app.routerRef = router


module.exports = app
