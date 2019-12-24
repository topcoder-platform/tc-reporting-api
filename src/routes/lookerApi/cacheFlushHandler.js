'use strict'

import { middleware as tcMiddleware } from 'tc-core-library-js'
import basicService from '../../services/lookerApi/basicService'
import lookerApiMapping from '../../lookerApiMapping';
const permissions = tcMiddleware.permissions;


module.exports = (apiName) => {
    const apiEntity = lookerApiMapping[apiName];
    
    return [
        
        basicService.injectRole(apiEntity),
        permissions('lookerApi.common'), // lookerApi common permission , check user role
        (req, res, next) => {
            
            var decider = JSON.stringify(req.url)
         
            if(decider.includes("flushAll")){
                basicService.flushAll(apiEntity, req.params, req.query, req.body).then((resp) => {
                    //  res.setHeader('content-type', resp.headers['content-type'])
                      res.status(resp.status)
                      res.write(new Buffer(resp.data, 'binary'))
                      res.end()
                  }).catch((error) => {
                      next(error)
                  })
            }
            else{

                basicService.flushLook(apiEntity, req.params, req.query, req.body).then((resp) => {
                    //  res.setHeader('content-type', resp.headers['content-type'])
                      res.status(resp.status)
                      res.write(new Buffer(resp.data, 'binary'))
                      res.end()
                  }).catch((error) => {
                      next(error)
                  })

            }
            
            
            
        }
    ]
}