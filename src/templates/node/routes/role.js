/**
 * @author              Nathan Mersha
 * @name                gennodeAuthServer
 * @module              role.js
 * @description         Route for role
 * @kind                Router
 * @copyright           Copyright : 2019
 */

let
    express = require('express'),
    router = express.Router(),
    controller = require('../controller/role');

/**
 * @api             {post} /auth/role     Create
 * @apiVersion      0.0.1
 * @apiName         Create
 * @apiGroup        role
 * @apiDescription  Creates new role data
 *
 * @apiPermission     All
 *
 *  
 *
 * @apiParamExample Body
 *
 {
    "name": "Role A",
    "description": "Description for role a",
    "members": [
        "5cee7318b2820d47582e9aca",
        "5cee7318b2820d47582e9acc",
        "5cee7318b2820d47582e9ac3",
        "5cee7318b2820d47582e9ac5",
    ],
    "accessRoutes": [
        { route : "http://sample/route/1", method : "POST" },
        { route : "http://sample/route/2", method : "DELETE" },
        { route : "http://sample/route/3", method : "GET" },
        { route : "http://sample/route/4", method : "PUT" },
    ]
}
 *  
 *
    * @apiParam    (Body)  {String }    name     - name
    * @apiParam    (Body)  {Date }    description     - description
    * @apiParam    (Body)  {Array }    members     - members
    * @apiParam    (Body)  {Array }    accessRoutes     - accessRoutes
 *
    * @apiSuccess      {String}    name     - name
    * @apiSuccess      {Date}    description     - description
    * @apiSuccess      {Array}    members     - members
    * @apiSuccess      {Array}    accessRoutes     - accessRoutes
    * @apiSuccess     {String}    __v           - Version
    * @apiSuccess     {String}    _id           - Id
    * @apiSuccess     {String}    firstModified - First modified
    * @apiSuccess     {String}    lastModified  - Last modified
 *  
 *
 * @apiSuccessExample Body
 *
 {
    "name": "Role A",
    "description": "Description for role a",
    "members": [
        "5cee7318b2820d47582e9aca",
        "5cee7318b2820d47582e9acc",
        "5cee7318b2820d47582e9ac3",
        "5cee7318b2820d47582e9ac5",
    ],
    "accessRoutes": [
        { route : "http://sample/route/1", method : "POST" },
        { route : "http://sample/route/2", method : "DELETE" },
        { route : "http://sample/route/3", method : "GET" },
        { route : "http://sample/route/4", method : "PUT" },
    ]
    "__v": "53",
    "firstModified": "2019-05-29T11:55:04.235Z",
    "lastModified": "2019-05-29T11:55:04.235Z",
    "_id": "5cee7318b2820d47582e9aca"
}
 *  
 *
 * @apiSampleRequest http://localhost:3400/auth/role
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
 * @api             {get} /auth/role     Get
 * @apiVersion      0.0.1
 * @apiName         Get
 * @apiGroup        role
 * @apiDescription  Retrieves role data
 *
 * @apiPermission     All
 *
 * @apiParam (Query)        {Number}    [page = 1]                          - Page Number
 * @apiParam (Query)        {String}    [sort = id]                         - Sort order by
 * @apiParam (Query)        {Boolean}   [lean = false]                      - Lean
 * @apiParam (Query)        {Number}    [offset = 0]                        - Offset
 * @apiParam (Query)        {Number}    [limit = 12]            - Limit of return
 *
    * @apiParam (Query)   {String} [ name = undefined ]  - String
    * @apiParam (Query)   {Date} [ description = undefined ]  - Date
    * @apiParam (Query)   {Array} [ members = undefined ]  - Array
    * @apiParam (Query)   {Array} [ accessRoutes = undefined ]  - Array
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
                "name": "Role A",
                "description": "Description for role a",
                "members": [
                    "5cee7318b2820d47582e9aca",
                    "5cee7318b2820d47582e9acc",
                    "5cee7318b2820d47582e9ac3",
                    "5cee7318b2820d47582e9ac5",
                ],
                "accessRoutes": [
                    { route : "http://sample/route/1", method : "POST" },
                    { route : "http://sample/route/2", method : "DELETE" },
                    { route : "http://sample/route/3", method : "GET" },
                    { route : "http://sample/route/4", method : "PUT" },
                ]
                "__v": "53",
                "firstModified": "2019-05-29T11:55:04.235Z",
                "lastModified": "2019-05-29T11:55:04.235Z",
                "_id": "5cee7318b2820d47582e9aca"
            },

            {
                "name": "Role A",
                "description": "Description for role a",
                "members": [
                    "5cee7318b2820d47582e9aca",
                    "5cee7318b2820d47582e9acc",
                    "5cee7318b2820d47582e9ac3",
                    "5cee7318b2820d47582e9ac5",
                ],
                "accessRoutes": [
                    { route : "http://sample/route/1", method : "POST" },
                    { route : "http://sample/route/2", method : "DELETE" },
                    { route : "http://sample/route/3", method : "GET" },
                    { route : "http://sample/route/4", method : "PUT" },
                ]
                "__v": "53",
                "firstModified": "2019-05-29T11:55:04.235Z",
                "lastModified": "2019-05-29T11:55:04.235Z",
                "_id": "5cee7318b2820d47582e9aca"
            },

            {
                "name": "Role A",
                "description": "Description for role a",
                "members": [
                    "5cee7318b2820d47582e9aca",
                    "5cee7318b2820d47582e9acc",
                    "5cee7318b2820d47582e9ac3",
                    "5cee7318b2820d47582e9ac5",
                ],
                "accessRoutes": [
                    { route : "http://sample/route/1", method : "POST" },
                    { route : "http://sample/route/2", method : "DELETE" },
                    { route : "http://sample/route/3", method : "GET" },
                    { route : "http://sample/route/4", method : "PUT" },
                ]
                "__v": "53",
                "firstModified": "2019-05-29T11:55:04.235Z",
                "lastModified": "2019-05-29T11:55:04.235Z",
                "_id": "5cee7318b2820d47582e9aca"
            }

        ],
        "total": 12,
        "limit": 3,
        "offset": 0
    }
 *
 * @apiSampleRequest http://localhost:3400/auth/role
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
 * @api             {put} /auth/role     Update
 * @apiVersion      0.0.1
 * @apiName         Update
 * @apiGroup        role
 * @apiDescription  Updates new role data
 *
 * @apiPermission     All
 *
 * @apiParamExample Body
 *
 {
     "name": "Role A",
     "description": "Description for role a",
     "members": [
         "5cee7318b2820d47582e9aca",
         "5cee7318b2820d47582e9acc",
         "5cee7318b2820d47582e9ac3",
         "5cee7318b2820d47582e9ac5",
     ],
     "accessRoutes": [
         { route : "http://sample/route/1", method : "POST" },
         { route : "http://sample/route/2", method : "DELETE" },
         { route : "http://sample/route/3", method : "GET" },
         { route : "http://sample/route/4", method : "PUT" },
     ]
     "__v": "53",
     "firstModified": "2019-05-29T11:55:04.235Z",
     "lastModified": "2019-05-29T11:55:04.235Z",
     "_id": "5cee7318b2820d47582e9aca"
 }
 *  
 *
 *
    * @apiParam (Query)   {String} [ name = undefined ]  - String
    * @apiParam (Query)   {Date} [ description = undefined ]  - Date
    * @apiParam (Query)   {Array} [ members = undefined ]  - Array
    * @apiParam (Query)   {Array} [ accessRoutes = undefined ]  - Array
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
 * @apiSampleRequest http://localhost:3400/auth/role
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
 * @api             {delete} /auth/role     Delete
 * @apiVersion      0.0.1
 * @apiName         Delete
 * @apiGroup        role
 * @apiDescription  Deletes role data
 *
 * @apiPermission     All
 *
    * @apiParam (Query)   {String} [ name = undefined ]  - String
    * @apiParam (Query)   {Date} [ description = undefined ]  - Date
    * @apiParam (Query)   {Array} [ members = undefined ]  - Array
    * @apiParam (Query)   {Array} [ accessRoutes = undefined ]  - Array
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
 * @apiSampleRequest http://localhost:3400/auth/role
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
