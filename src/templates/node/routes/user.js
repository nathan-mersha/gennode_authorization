/**
 * @author              __author__
 * @name                __serviceName__
 * @module              user.js
 * @description         Route for user
 * @kind                Router
 * @copyright           __copyright__
 */

let
    express = require('express'),
    router = express.Router(),
    controller = require('../controller/user');

/**
 * @api             {post} /auth/user     Create
 * @apiVersion      0.0.1
 * @apiName         Create
 * @apiGroup        user
 * @apiDescription  Creates new user data
 *
 * @apiPermission     All
 *
 *  
 *
 * @apiParamExample With email
 *
    {
        "userId": "sample@email.com"
    }

 * @apiParamExample With Oid
 *
 {
     "userId": "5cee7318b2820d47582e9ac6"
 }

 *  
 *
    * @apiParam    (Body)  {String }    userId     - Any attribute that is unique to the user.
 *
    * @apiSuccess      {String}    userId       - Any attribute that is unique to the user.
    * @apiSuccess     {String}    __v           - Version
    * @apiSuccess     {String}    _id           - Id
    * @apiSuccess     {String}    firstModified - First modified
    * @apiSuccess     {String}    lastModified  - Last modified
 *  
 *
 * @apiSuccessExample Body
 *
 {
    "userId"        : "sample@email.com",
    "__v"           : "93",
    "firstModified" : "2019-05-29T11:55:04.214Z",
    "lastModified"  : "2019-05-29T11:55:04.214Z",
    "_id"           : "5cee7318b2820d47582e9ac6"
}
 *  
 *
 * @apiSampleRequest http://localhost:3400/auth/user
 *
 * @apiError    (400)       {Object}    AUTHENTICATION_NOT_SET              - Authentication values are not set.
 * @apiError    (400)       {Object}    AUTHENTICATION_TYPE_NOT_ACCORD      - Authentication type is not according to constants.
 * @apiError    (400)       {Object}    AUTHENTICATION_VALUE_NOT_SET        - Authentication values are not set.
 * @apiError    (401)       {Object}    UNAUTHORIZED_ACCESS                 - Token is not authorized to access this route..
 * @apiError    (401)       {Object}    TOKEN_REVOKED                       - Token is revoked.
 * @apiError    (401)       {Object}    TOKEN_EXPIRED                       - Token has expired.
 * @apiError    (401)       {Object}    AUTHORIZED_SERVICE_ACCESS_DENIED    - Service has no been granted access.
 *
 * @apiError    (400)       {Object}    CAST_ERROR                          - Possible casting error.
 * @apiError    (400)       {Object}    NO_QUERY_DATA                       - No proper or no query data has been provided.Mainly could be caused by using wrong key in url.
 * @apiError    (400)       {Object}    NO_DATA_FOUND                       - No data found in query.
 */
router.post('/'     , controller.create);

/**
 * @api             {get} /auth/user     Get
 * @apiVersion      0.0.1
 * @apiName         Get
 * @apiGroup        user
 * @apiDescription  Retrieves user data
 *
 * @apiPermission     All
 *
 * @apiParam (Query)        {Number}    [page = 1]                          - Page Number
 * @apiParam (Query)        {String}    [sort = id]                         - Sort order by
 * @apiParam (Query)        {Boolean}   [lean = false]                      - Lean
 * @apiParam (Query)        {Number}    [offset = 0]                        - Offset
 * @apiParam (Query)        {Number}    [limit = 12]            - Limit of return
 *
    * @apiParam (Query)   {String} [ userId = undefined ]  - String
 *
 *
 * @apiSuccess              {array}     docs                                - Documents array result
 * @apiSuccess              {Number}    total                               - Total number of retrieved results
 * @apiSuccess              {Number}    limit                               - Limit of a single return
 * @apiSuccess              {Number}    offset                              - Offset
 *
 * @apiSuccessExample Body
 *
 * {
        "docs": [

 {
    "userId"        : "sample@email.com",
    "__v"           : "93",
    "firstModified" : "2019-05-29T11:55:04.214Z",
    "lastModified"  : "2019-05-29T11:55:04.214Z",
    "_id"           : "5cee7318b2820d47582e9ac6"
},

 {
    "userId"        : "sample2@email.com",
    "__v"           : "93",
    "firstModified" : "2019-05-29T11:55:04.214Z",
    "lastModified"  : "2019-05-29T11:55:04.214Z",
    "_id"           : "5cee7318b2820d47582e9ac4"
},

 {
    "userId"        : "sample2@email.com",
    "__v"           : "93",
    "firstModified" : "2019-05-29T11:55:04.214Z",
    "lastModified"  : "2019-05-29T11:55:04.214Z",
    "_id"           : "5cee7318b2820d47582e9ac2"
}
            
        ],
        "total": 12,
        "limit": 3,
        "offset": 0
    }
 *
 * @apiSampleRequest http://localhost:3400/auth/user
 *
 * @apiError    (400)       {Object}    AUTHENTICATION_NOT_SET              - Authentication values are not set.
 * @apiError    (400)       {Object}    AUTHENTICATION_TYPE_NOT_ACCORD      - Authentication type is not according to constants.
 * @apiError    (400)       {Object}    AUTHENTICATION_VALUE_NOT_SET        - Authentication values are not set.
 * @apiError    (401)       {Object}    UNAUTHORIZED_ACCESS                 - Token is not authorized to access this route..
 * @apiError    (401)       {Object}    TOKEN_REVOKED                       - Token is revoked.
 * @apiError    (401)       {Object}    TOKEN_EXPIRED                       - Token has expired.
 * @apiError    (401)       {Object}    AUTHORIZED_SERVICE_ACCESS_DENIED    - Service has no been granted access.
 *
 * @apiError    (400)       {Object}    CAST_ERROR                          - Possible casting error.
 * @apiError    (400)       {Object}    NO_QUERY_DATA                       - No proper or no query data has been provided.Mainly could be caused by using wrong key in url.
 * @apiError    (400)       {Object}    NO_DATA_FOUND                       - No data found in query.
 */
router.get('/'      , controller.find);


/**
 * @api             {put} /auth/user     Update
 * @apiVersion      0.0.1
 * @apiName         Update
 * @apiGroup        user
 * @apiDescription  Updates new user data
 *
 * @apiPermission     All
 *
 * @apiParamExample Body
 *
    {
    "userId": "Gravida morbi iaculis a fringilla."
}
 *  
 *
 *
    * @apiParam (Query)   {String} [ userId = undefined ]  - String
    * @apiParam (Query)   {String="pull", "push"} [ operation]  - String
    * @apiParam (Query)   {String} [ target ]  - String
 *  
 *
 * @apiSuccess              {String}    n                                   - Number of objects manipulated
 * @apiSuccess              {String}    nModified                           - Number of objects modified based on query
 * @apiSuccess              {String}    ok                                  - Number of objects successfully modified
 *
 * @apiSuccessExample Body
 *
 *  {
      "n" : "1",
      "nModified" : "1",
      "ok" : "1"
    }
 *
 *
 * @apiSampleRequest http://localhost:3400/auth/user
 *
 * @apiError    (400)       {Object}    AUTHENTICATION_NOT_SET              - Authentication values are not set.
 * @apiError    (400)       {Object}    AUTHENTICATION_TYPE_NOT_ACCORD      - Authentication type is not according to constants.
 * @apiError    (400)       {Object}    AUTHENTICATION_VALUE_NOT_SET        - Authentication values are not set.
 * @apiError    (401)       {Object}    UNAUTHORIZED_ACCESS                 - Token is not authorized to access this route..
 * @apiError    (401)       {Object}    TOKEN_REVOKED                       - Token is revoked.
 * @apiError    (401)       {Object}    TOKEN_EXPIRED                       - Token has expired.
 * @apiError    (401)       {Object}    AUTHORIZED_SERVICE_ACCESS_DENIED    - Service has no been granted access.
 *
 * @apiError    (400)       {Object}    CAST_ERROR                          - Possible casting error.
 * @apiError    (400)       {Object}    NO_QUERY_DATA                       - No proper or no query data has been provided.Mainly could be caused by using wrong key in url.
 * @apiError    (400)       {Object}    NO_DATA_FOUND                       - No data found in query.
 */
router.put('/'      , controller.update);

/**
 * @api             {delete} /auth/user     Delete
 * @apiVersion      0.0.1
 * @apiName         Delete
 * @apiGroup        user
 * @apiDescription  Deletes user data
 *
 * @apiPermission     All
 *
    * @apiParam (Query)   {String} [ userId = undefined ]  - String
 *
 *
 * @apiSuccess              {String}    n                                   - Number of objects manipulated
 * @apiSuccess              {String}    ok                                  - Number of objects successfully deleted
 *
 * @apiSuccessExample Body
 *
 *  {
      "n" : "1",
      "ok" : "1"
    }
 *
 * @apiSampleRequest http://localhost:3400/auth/user
 *
 * @apiError    (400)       {Object}    AUTHENTICATION_NOT_SET              - Authentication values are not set.
 * @apiError    (400)       {Object}    AUTHENTICATION_TYPE_NOT_ACCORD      - Authentication type is not according to constants.
 * @apiError    (400)       {Object}    AUTHENTICATION_VALUE_NOT_SET        - Authentication values are not set.
 * @apiError    (401)       {Object}    UNAUTHORIZED_ACCESS                 - Token is not authorized to access this route..
 * @apiError    (401)       {Object}    TOKEN_REVOKED                       - Token is revoked.
 * @apiError    (401)       {Object}    TOKEN_EXPIRED                       - Token has expired.
 * @apiError    (401)       {Object}    AUTHORIZED_SERVICE_ACCESS_DENIED    - Service has no been granted access.
 *
 * @apiError    (400)       {Object}    CAST_ERROR                          - Possible casting error.
 * @apiError    (400)       {Object}    NO_QUERY_DATA                       - No proper or no query data has been provided.Mainly could be caused by using wrong key in url.
 * @apiError    (400)       {Object}    NO_DATA_FOUND                       - No data found in query.
 */
router.delete('/'   , controller.remove);

module.exports = router;
