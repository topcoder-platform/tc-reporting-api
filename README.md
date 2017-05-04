# tc-reporting-api
Wrapper around the Looker API to simplify access to reports, data feeds, etc.  Includes usage of TC Auth.


##Dependencies
- nodejs https://nodejs.org/en/ (v6)

## Configuration
- config can modify in config/default.js ,and also be overwrite from environment variables

##Local deployment
- install backend dependencies, run `npm install`
- run `npm run lint`
- run `npm run start`

## Verification
- open postman , and import `docs/tc-lookerApi-services.postman_collection.json`

## Authenticate
when we do looker request , server will get authenticate first

- if we get authenticate already , we use this token do looker api request
- if return 401 , then will do reauthenticate , and do looker api again

## How easily to add a new api
Let's add one looker api `/looks` to see how simple it is.

- add api entity in config.lookerApi ``` "allLooks": {
      "url": "/looks",
      "method": "get"
    } ```
- create new router file like `src/routes/allLooks.js` , only write 5 lines code.
- register in `src/routes/index.js` use code ```router.route('/v4/looks').get(require('./lookerApi/allLooks'))```
- let use postman try it.

## Additional features
- add `/looks` that can get all look

## Anonymous access
- Ids specified in config/default.json can be viewed without authentication
- Refer allowAnonymous.js under src/middlewares