'use strict'
import util from '../../util'
import config from 'config'
import _ from 'lodash'
import querystring from 'querystring'
import authService from '../../services/lookerApi/authService'
//import {cacheJson,addToCache} from '../../services/lookerApi/cache'
import cacheService from '../../services/lookerApi/cache'


let hascache = -1 // variable to check if the look id is in cache 
let hasttl = -1    // variable to check if the time to live have elapsed the preset threshold

/**
 * Build custom http client for request
 * @param req request
 * @returns custom http client
 * @private
 */
function _getHttpClient(token) {
    var httpClient = util.getHttpClient()
    if (!httpClient.defaults.headers) {
        httpClient.defaults.headers = { common: {} }
    }

    httpClient.defaults.headers.common['Authorization'] = `token ${token}`
    httpClient.defaults.timeout = config.get('lookerApi.timeout')
    httpClient.defaults.baseURL = config.get('lookerApi.host')
    httpClient.defaults.responseType = 'arraybuffer'
    return httpClient
}

/**
 * replace apiEntity url by request params
 * @param source apiEntity url
 * @param params request params
 * @return {*}
 */
function formatParams(source, params) {
    _.each(params, function(val, key) {
        source = source.replace(new RegExp("\\{" + key + "\\}", "g"), val);
    });
    return source;
}

/**
 * send request to lookerApi server
 * it will reauthenticate if lookapi return 401 , if reauthenticate success , it will try api again
 * @param apiEntity the api url and method , more details in config.lookerApi.runLook
 *  like {
 *    url:"/xxxxx/xxx",
 *    method:'post'
 *    }
 * @param params the params from request
 * @param querys the querys from request
 * @param data  the data body from request
 * @param token lookerApi access_token
 * @return {Promise.<TResult>}
 * @private
 */


function _lookerApi(apiEntity, params, querys, data, token) {

    // replace apiEntity.url by request.params and make querystring
    const url = formatParams(apiEntity.url, params) + "?" + querystring.stringify(querys)
    // get the method
    const method = apiEntity.method.toLowerCase()
   
 
    var check = cacheService.checkCache(url.slice(7,11))
    hascache = check['hascache']
    hasttl = check['hasttl']
 
    //console.log(hascache + " ******" + hasttl + "#######")
    // when the look id is not in cache
    // a new request will be sent and the result will
    // be pushed in the cache Array
    if(hascache < 0 ){
       // console.log("hello before api call")
        return _getHttpClient(token)[method](url)
        .then((resp) => {  

            //console.log("hello world")
            cacheService.addToCache(url.slice(7,11),resp)
                    
                    return Promise.resolve(resp) 
                        })
        .catch((error) => {
            if (error.status === 401) { //if return 401 ,that means token is expire
                // force reauthenticate
               // console.log("reauthenticating")
               // console.log()
                return authService.getToken(true).then((t) => {
                    // do request again
                    
                    return _lookerApi(apiEntity, params, querys, data, t['access_token'])
                })
            } else { // return error
               // console.log("in error")   
               // console.log(error   )
                 const err = { message: JSON.parse(error.data.toString()), status: error.status }
                return Promise.reject(err)
            }
        })
    }
    // if the look id is in the cache array,
    // time to live will be verififed before returning the data
    // if the time to live has expired, a new request will be sent
    // and the corrosponding data field will be updated along with new ttl
    else {
        if( hasttl >= 0 ){
                
                    return _getHttpClient(token)[method](url)
                    .then((resp) => {          
                        
                        cacheService.updateCache(hasttl,resp)
                        return Promise.resolve(resp) 
            })
            .catch((error) => {
                    if (error.status === 401) { //if return 401 ,that means token is expire
                        // force reauthenticate
                       // console.log()
                    return authService.getToken(true).then((t) => {
                        // do request again
                         return _lookerApi(apiEntity, params, querys, data, t['access_token'])
                            })
                    } else { // return error
                        const err = { message: JSON.parse(error.data.toString()), status: error.status }
                        return Promise.reject(err)
                    }
            })
        }
        else
        {
               //console.log("from cahce")
               return Promise.resolve(cacheService.retriveCache(hascache))
               // return Promise.resolve(cacheJson[hascache]) 
        }
    }
}

function _flushLook(apiEntity, params, querys, data, token){

    // replace apiEntity.url by request.params and make querystring
    const url = formatParams(apiEntity.url, params) + "?" + querystring.stringify(querys)
    // get the method
    const method = apiEntity.method.toLowerCase()
    var lookId = params["lookid"]

    var status = cacheService.flushLook(lookId)

    if(status == 0 ){
                const err = { message: ("Nothing to flush"), status: 200 }
                return Promise.reject(err)
    }else if(status == 1){
                var success = { 
                    "status" : 200,
                    "data" : "Look id " + lookId + " is flushed"
                    }
                return Promise.resolve(success)
    }else{
                const err = { message: ("Look not in cache yet"), status: 200 }
                return Promise.reject(err)
    }
}

function _flushAll(){
        return cacheService.flushAll()
        }


export default {
    /**
     * send request to lookerapi server , first get token , if success or exist , then do request
     * @param apiEntity api entity , sample as config.lookerApi.runLook entity
     * @param params the request params
     * @param querys the request querys
     * @param data the request body data
     * @return {Promise.<TResult>}
     */
    lookerApi: (apiEntity, params, querys, data) => {
        data = data || {}
        querys = querys || {}
        params = params || {}
            // first get token ,and do request
        return authService.getToken().then((t) => {
            return _lookerApi(apiEntity, params, querys, data, t['access_token'])
        })
    },

    /**
     * inject role info to req , to permission check
     * @return {Function}
     */
    injectRole: function(apiEntity) {
        return function(req, res, next) {
            req.requireRoles = apiEntity.roles || [];
            next();
        }
    },

    /**
     * to flush  cache of a specific look
     * @return {Promise.<TResult>}
     */

     flushLook: (apiEntity, params, querys, data )=>{

        data = data || {}
        querys = querys || {}
        params = params || {}
        
        return authService.getToken().then((t)=>{
            
            return _flushLook(apiEntity, params, querys, data, t['access_token'])
        })
     },

     /**
      * to flush all cache
      * @return {Promise.<TResult}
      */

     flushAll: (apiEntity, params, querys, data )=>{

        data = data || {}
        querys = querys || {}
        params = params || {}
        
        return authService.getToken().then((t)=>{
            
            return _flushAll(apiEntity, params, querys, data, t['access_token'])
        })
     }

     
}
