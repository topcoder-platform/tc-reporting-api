'use strict'
/* globals Promise */

import util from '../util'
import _ from 'lodash';
import { USER_ROLE } from '../constants'


/**
 * only admin can request lookerApi
 */
module.exports = (req) => {
    return new Promise((resolve, reject) => {

        // To lookup public ids
        if (req.allowAnonymous) {
           // console.log(req)
            
            return resolve(true)
        }

        if (!req.requireRoles || req.requireRoles.length <= 0) {
           // console.log(req)
            return resolve(true)
        }
        _.each(req.requireRoles, (role) => {
                if (util.hasRole(req, role)) {
                  //  console.log(req)
                    return resolve(true)
                }
            })
            // if user role not in requireRoles , reject
            console.log(req.requireRoles)
        return reject(new Error('You do not have permissions to perform this action'))
    })
}
