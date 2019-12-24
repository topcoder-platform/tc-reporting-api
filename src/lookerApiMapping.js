const USER_ROLE = require('./constants').USER_ROLE;

module.exports = {
  "runLook": {
    "url": "/looks/{look_id}/run/{result_format}",
    "roles": [USER_ROLE.TOPCODER_ADMIN, USER_ROLE.MANAGER],
    "method": "get"
  },
  "allLooks": {
    "url": "/looks",
    "roles": [USER_ROLE.TOPCODER_ADMIN, USER_ROLE.MANAGER],
    "method": "get"
  },
  "flushLooks":{
    "url" : "/looks/_flush/{look_id}",
    "roles" : [USER_ROLE.TOPCODER_ADMIN, USER_ROLE.MANAGER],
    "method" : "get"
  },
  "flushAll":{
    "url" : "/looks/_flush",
    "roles" : [USER_ROLE.TOPCODER_ADMIN, USER_ROLE.MANAGER],
    "method" : "get"
  }
}
