const USER_ROLE = require('./constants').USER_ROLE;

module.exports = {
  "runLook": {
    "url": "/looks/{look_id}/run/{result_format}",
    "roles": [USER_ROLE.TOPCODER_ADMIN],
    "method": "get"
  },
  "allLooks": {
    "url": "/looks",
    "roles": [USER_ROLE.TOPCODER_ADMIN],
    "method": "get"
  }
}
