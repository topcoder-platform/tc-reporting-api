'use strict'
import util from '../../util'
import config from 'config'
import querystring from 'querystring'

var authenticationToken = null;

export default {

  /**
   * get auth token from lookerApi server
   * if authenticationToken is not null , it will return it
   * @param force
   * @return {*}
   */
  getToken: (force) => {
    if (authenticationToken && !force) {  //token exists and not force get it from lookerApi server
      return new Promise((resolve) => {
        return resolve(authenticationToken)
      })
    }
    else {
      // do an authentication request
      return util.getHttpClient().post(`${config.get('lookerApi.host')}${config.get('lookerApi.loginUrl')}`,
        querystring.stringify({
          client_id: config.get('lookerApi.client_id'),
          client_secret: config.get('lookerApi.client_secret')
        })).then((rsp) => {
        authenticationToken = rsp.data; // save authenticationToken to mem
        return Promise.resolve(rsp.data)
      }).catch((error) => { // return error
        const err = new Error(`lookerApi: ${error.statusText}`)
        err.status = error.status
        return Promise.reject(err)
      });
    }
  }
}