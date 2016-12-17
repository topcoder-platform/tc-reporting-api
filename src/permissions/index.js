'use strict'

const Authorizer = require('tc-core-library-js').Authorizer

module.exports = () => {
  Authorizer.setDeniedStatusCode(403)
  Authorizer.setPolicy('lookerApi.common', require('./lookerApi.common'))
}
