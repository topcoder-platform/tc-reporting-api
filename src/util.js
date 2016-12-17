'use strict'
/* globals Promise */
/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */
/**
 * This is utils file.
 * @author TCDEVELOPER
 * @version 1.0
 */


import _ from 'lodash'
import config from 'config'

let util = _.cloneDeep(require('tc-core-library-js').util(config))
_.assignIn(util, {

  /**
   * Helper funtion to verify if user has specified role
   * @param  {object} req  Request object that should contain authUser
   * @param  {string} role specified role
   * @return {boolean}      true/false
   */
  hasRole: (req, role) => {
    let roles = _.get(req, 'authUser.roles', [])
    roles = roles.map(s => s.toLowerCase())
    return _.indexOf(roles, role.toLowerCase()) >= 0
  }
})

export default util
