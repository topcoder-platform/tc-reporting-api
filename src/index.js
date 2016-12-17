'use strict'


const app = require('./app')

/**
 * Handle server shutdown gracefully
 */
function shutdown() {
  process.exit()
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// =======================
// start the server ======
// =======================
var port = process.env.PORT || 3000 // used to create, sign, and verify tokens

var server = app.listen(port, () => {
  app.logger.info("Starting server on PORT: %d", port)
  let authz = require('tc-core-library-js').Authorizer
  app.logger.info("Registered Policies", authz.getRegisteredPolicies())
  require('express-list-routes')({prefix: '', spacer: 7}, 'APIs:', app.routerRef)
})

module.exports = server
