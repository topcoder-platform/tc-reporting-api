var cacheJson = [
 
]

let hascache = -1 // variable to check if the look id is in cache 
let hasttl = -1    // variable to check if the time to live have elapsed the preset threshold


export default {

    checkCache:(cacheLookId)=>{

        for( var  i = 0 ; i < cacheJson.length ; i ++ ){

            if(cacheJson[i].lookId == cacheLookId){
                if(( Date.now() - cacheJson[i].ttl ) > 10000)
                {
                    //console.log(i);
                    console.log("ttl expired")
                    const response = { 'hasttl':i,'hascache':i }
                    return response ;
                }
                    console.log(i + " : ttl not expired")
                    hasttl = -1
                    const response = { 'hasttl':-1,'hascache':i }
                    return response ;
                 
            }
        } 
        const response = { 'hasttl':-1,'hascache':-1 }
        return response ;
    },

    addToCache:(lookId,resp)=>{
        
       // console.log(lookId)
       // console.log("in add to cache")

        cacheJson.push(
            {
                "lookId" : lookId,
                "data" : resp.data.toString(),
                "ttl" : Date.now(),
                "headers" : resp.headers,
                "status" : resp.status
            }
        )
    },

    updateCache:(location,resp)=>{
        
        cacheJson[location].data = resp.data.toString()
        cacheJson[location].ttl = Date.now()
        console.log("Updated array")

    },

    retriveCache:(location)=>{
        
        console.log("from cache")
        return cacheJson[location]

    },

    flushLook:(lookId)=>{

        for( var  i = 0 ; i < cacheJson.length ; i ++ ){
            if(cacheJson[i].lookId == lookId){
                if(cacheJson[i].ttl == ""){
                    return 0
                }
                cacheJson[i].ttl = ""
                    return 1
                }
        }
        return -1

    },

    flushAll:()=>{
        if(cacheJson.length != 0){
            cacheJson.length = 0
            var success = { 
                "status" : 200,
                "data" : "Cache is flushed"
                }
            return Promise.resolve(success)
      }
        const err = { message: ("Cache is already Flushed"), status: 200 }
        return Promise.reject(err)

    }

}


