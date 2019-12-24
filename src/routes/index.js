'use strict'
import _ from 'lodash'
import validate from 'express-validation'
import { Router } from 'express'
import allowAnonymous from '../middlewares/allowAnonymous'

const router = Router()

validate.options({
    status: 422,
    flatten: true,
    allowUnknownBody: false
})

// health check
router.get('/_health', (req, res) => {
    // TODO more checks
    res.status(200).send({
        message: "All-is-well"
    })
})

// All service endpoints need authentication
var jwtAuth = require('tc-core-library-js').middleware.jwtAuthenticator

//Endpoint to flush out cache for a specific look

//router.get('/v4/looks/:look_id(\\d+)/run/_flush',allowAnonymous(),require('./lookerApi/flushLooks'));

//Endpoint to flush out cache for all Look
//Requires Admin privilages

router.get('/v4/looks/flush/:lookid(\\d+)',require('./lookerApi/flushLooks'));

router.get('/v4/looks/flushAll',require('./lookerApi/flushAll'))

// Register all the routes
router.get('/v4/looks/:look_id(\\d+)/run/:result_format', allowAnonymous(), require('./lookerApi/runLook'));

router.get('/v4/looks', jwtAuth(), require('./lookerApi/allLooks'));

// catch 404 and forward to error handler
router.use((req, res, next) => {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// register error handler
router.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    // DO NOT REMOVE next arg.. even though eslint
    // complains that it is not being used.

    let content = {}
    let httpStatus = err.status || 500
        // specific for validation errors
    if (err instanceof validate.ValidationError) {
        content.message = err.message + ": " + err.toJSON()
        httpStatus = err.status
    } else {
        content.message = err.message
    }
    var body = {
        id: req.id,
        result: {
            success: false,
            status: httpStatus,
            content: content
        }
    }


    // will print stacktrace
    if (_.indexOf(['development', 'test', 'qa'], process.env.NODE_ENV) > -1) {
        body.result.debug = err.stack
        if (err.details) {
            body.result.details = err.details
        }
    }
    err.status = err.status || 500
    req.log.error(err)
    res
        .status(err.status)
        .send(body)
})


module.exports = router
