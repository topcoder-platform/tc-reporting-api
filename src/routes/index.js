'use strict'
import _ from 'lodash'
import validate from 'express-validation'
import {Router} from 'express'

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
router.all('/v4/*', jwtAuth())

// Register all the routes
router.route('/v4/looks/:look_id(\\d+)/run/:result_format')
  .get(require('./lookerApi/runLook'))

router.route('/v4/looks').get(require('./lookerApi/allLooks'))

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
