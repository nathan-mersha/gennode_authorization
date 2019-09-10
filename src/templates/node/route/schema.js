/**
 * @author              __author__
 * @name                __serviceName__
 * @module              schema.js
 * @description         Defines route for schema
 * @kind                Route
 * @copyright           __copyright__
 */

let
    express     = require('express'),
    router      = express.Router(),
    controller  = require('../controller/schema');


/**
 * @api             {get} __baseURL__/schema/count     Count
 * @apiVersion      0.0.1
 * @apiName         Count
 * @apiGroup        Schema
 * @apiDescription  Counts schema by query
 *
 * @apiPermission     All
 *
 * @apiParam (Query)   {String} [ schemaName ]                              - schemaName
 * @apiSuccess              {Number}     count                              - Counts documents
 *
 * @apiSuccessExample Body
 *
 * {
        "count" : 10
   }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/schema/count
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
router.get('/count'     , controller.count);

/**
 * @api             {get} __baseURL__/schema     Get
 * @apiVersion      0.0.1
 * @apiName         Get
 * @apiGroup        Schema
 * @apiDescription  Retrieves schema data
 *
 * @apiPermission     Admin
 *
 * @apiParam (Query)        {Number}    [page = 1]                          - Page Number
 * @apiParam (Query)        {String}    [sort = id]                         - Sort order by
 * @apiParam (Query)        {Boolean}   [lean = false]                      - Lean
 * @apiParam (Query)        {Number}    [offset = 0]                        - Offset
 * @apiParam (Query)        {Number}    [limit = 12]                        - Limit of return
 *
 * @apiParam (Query)        {String}    [ _id ]                             - String
 * @apiParam (Query)        {String}    [ schemaName ]                      - String
 * @apiParam (Query)        {String}    [ serviceName ]                     - String
 *
 * @apiSuccess              {array}     docs                                - Documents array result
 * @apiSuccess              {Number}    total                               - Total number of retrieved results
 * @apiSuccess              {Number}    limit                               - Limit of a single return
 * @apiSuccess              {Number}    offset                              - Offset
 *
 * @apiSuccessExample Body
 *
 {
     "docs": [
         {
             "accessControl": {
                 "read": [
                     null
                 ],
                 "update": [
                     "Admin 2",
                     "Admin 2"
                 ],
                 "delete": [
                     "Admin 2",
                     "Admin 2",
                     "Admin 2"
                 ]
             },
             "documentIds": [
                 "5d6b8f3ff972d427e6e31af1"
             ],
             "_id": "5d6b8f43f972d427e6e31b3b",
             "schemaName": "User",
             "serviceName": "Service C",
             "firstModified": "2019-09-01T09:28:35.427Z",
             "lastModified": "2019-09-01T09:28:36.019Z"
         },

                  {
             "accessControl": {
                 "read": [
                     null
                 ],
                 "update": [
                     "Admin 3",
                     "Admin 3"
                 ],
                 "delete": [
                     "Admin 4",
                     "Admin 2",
                     "Admin 5"
                 ]
             },
             "documentIds": [
                 "5d6b8f3ff972d427e6e31afc"
             ],
             "_id": "5d6b8f43f972d427e6e31b3c",
             "schemaName": "Blog",
             "serviceName": "Service A",
             "firstModified": "2019-09-01T09:28:35.427Z",
             "lastModified": "2019-09-01T09:28:36.019Z"
         }
     ],
     "total": 1,
     "limit": 12,
     "page": 1,
     "pages": 1
 }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/schema
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
router.get('/'          , controller.find);

/**
 * @api             {put} __baseURL__/schema     Update
 * @apiVersion      0.0.1
 * @apiName         Update
 * @apiGroup        Schema
 * @apiDescription  Updates schema data
 *
 * @apiPermission   Admin
 *
 * @apiParamExample Body
 *
 {
    "schemaName": "NewSchemaName"
 }
 *
 * @apiParam (Query)        {String}    [ _id ]                             - String
 * @apiParam (Query)        {String}    [ schemaName ]                      - String
 * @apiParam (Query)        {String}    [ serviceName ]                     - String
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
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/schema
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
router.put('/'          , controller.update);

/**
 * @api             {delete} __baseURL__/schema     Delete
 * @apiVersion      0.0.1
 * @apiName         Delete
 * @apiGroup        Schema
 * @apiDescription  Deletes schema data
 *
 * @apiPermission   Admin
 *
 * @apiParam (Query)        {String}    [ _id ]                             - String
 * @apiParam (Query)        {String}    [ schemaName ]                      - String
 * @apiParam (Query)        {String}    [ serviceName ]                     - String
 *
 * @apiSuccess              {String}    n                                   - Number of objects manipulated
 * @apiSuccess              {String}    ok                                  - Number of objects successfully modified
 *
 * @apiSuccessExample Body
 *
 *  {
      "n" : "1",
      "ok" : "1"
    }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/schema
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
router.delete('/'       , controller.remove);

module.exports = router;
