/*
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is the middleware to allow anonymous user to look up using id which is open to public.
 * @author TCDEVELOPER
 * @version 1.0
 */

import _ from 'lodash'

var jwtAuth = require('tc-core-library-js').middleware.jwtAuthenticator
var config = require('config')

var ids = _.split(config.publicLookId, ',').map(Number)

module.exports = function() {
    return function(req, res, next) {
        let reqId = _.parseInt(req.params.look_id)
        if (_.includes(ids, reqId)) {
            req.allowAnonymous = true
            next()
        } else {
            jwtAuth()(req, res, next)
        }
    }
};