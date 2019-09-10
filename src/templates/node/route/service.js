/**
 * @author              __author__
 * @name                __serviceName__
 * @module              service.js
 * @description         Defines route for service
 * @kind                Route
 * @copyright           __copyright__
 */

let
    express     = require('express'),
    router      = express.Router(),
    controller  = require('../controller/service');

/**
 * @api             {post} __baseURL__/service     Create
 * @apiVersion      0.0.1
 * @apiName         Create
 * @apiGroup        Service
 * @apiDescription  Creates new service data
 *
 * @apiPermission     All
 *
 *  
 *
 * @apiParamExample Body
 *
 {
    "name": "Service Name",
    "serviceId": "02.",
    "routes": [
      {
        "method": "POST",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Create company",
        "description": "Create company data."
      },
      {
        "method": "GET",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Retrieves company",
        "description": "Retrieves company data."
      },
      {
        "method": "PUT",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Update company",
        "description": "Updates company data."
      },
    ]
 }
 *  
 *
    * @apiParam    (Body)  {String }    name     - name
    * @apiParam    (Body)  {String }    serviceId     - serviceId
    * @apiParam    (Body)  {Array }    routes     - routes
    * @apiSuccess      {String}    name     - name
    * @apiSuccess      {String}    serviceId     - serviceId
    * @apiSuccess      {Array}    routes     - routes
    * @apiSuccess     {String}    __v           - Version
    * @apiSuccess     {String}    _id           - Id
    * @apiSuccess     {String}    firstModified - First modified
    * @apiSuccess     {String}    lastModified  - Last modified
 *  
 *
 * @apiSuccessExample Body
 *
 {
 "name": "Service Name",
 "serviceId": "02.",
 "routes": [
   {
     "method": "POST",
     "route": "http://root/sample",
     "group": "Company",
     "name": "Create company",
     "description": "Create company data."
   },
   {
     "method": "GET",
     "route": "http://root/sample",
     "group": "Company",
     "name": "Retrieves company",
     "description": "Retrieves company data."
   },
   {
     "method": "PUT",
     "route": "http://root/sample",
     "group": "Company",
     "name": "Update company",
     "description": "Updates company data."
   },
 ]
}
 *  
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/service
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
 * @api             {get} __baseURL__/service/count     Count
 * @apiVersion      0.0.1
 * @apiName         Count
 * @apiGroup        Service
 * @apiDescription  Counts service by query
 *
 * @apiPermission     All
 *
 * @apiParam (Query)   {String} [ name ]        - name
 * @apiParam (Query)   {String} [ serviceId ]   - serviceId
 *
 *
 * @apiSuccess              {Number}     count                              - Counts documents
 *
 * @apiSuccessExample Body
 *
 * {
        "count" : 10
   }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/service/count
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
router.get('/count' , controller.count);

/**
 * @api             {get} __baseURL__/service     Get
 * @apiVersion      0.0.1
 * @apiName         Get
 * @apiGroup        Service
 * @apiDescription  Retrieves service data
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
    * @apiParam (Query)   {String} [ serviceId = undefined ]  - String
    * @apiParam (Query)   {Array} [ routes = undefined ]  - Array
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
    "name": "Service Name",
    "serviceId": "02.",
    "routes": [
      {
        "method": "POST",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Create company",
        "description": "Create company data."
      },
      {
        "method": "GET",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Retrieves company",
        "description": "Retrieves company data."
      },
      {
        "method": "PUT",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Update company",
        "description": "Updates company data."
      },
    ]
 },

 {
    "name": "Service Name 4",
    "serviceId": "04",
    "routes": [
      {
        "method": "POST",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Create company",
        "description": "Create company data."
      },
      {
        "method": "GET",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Retrieves company",
        "description": "Retrieves company data."
      },
      {
        "method": "PUT",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Update company",
        "description": "Updates company data."
      },
    ]
 },

 {
    "name": "Service Name 3",
    "serviceId": "03",
    "routes": [
      {
        "method": "POST",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Create company",
        "description": "Create company data."
      },
      {
        "method": "GET",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Retrieves company",
        "description": "Retrieves company data."
      },
      {
        "method": "PUT",
        "route": "http://root/sample",
        "group": "Company",
        "name": "Update company",
        "description": "Updates company data."
      },
    ]
 }
            
        ],
        "total": 12,
        "limit": 3,
        "offset": 0
    }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/service
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
 * @api             {put} __baseURL__/service     Update
 * @apiVersion      0.0.1
 * @apiName         Update
 * @apiGroup        Service
 * @apiDescription  Updates new service data
 *
 * @apiPermission     All
 *
 * @apiParamExample Body
 *
 {
        "name": "Service Name",
        "serviceId": "02."
    }
 *  
 *
 *
    * @apiParam (Query)   {String} [ name = undefined ]  - String
    * @apiParam (Query)   {String} [ serviceId = undefined ]  - String
    * @apiParam (Query)   {Array} [ routes = undefined ]  - Array
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
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/service
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
 * @api             {delete} __baseURL__/service     Delete
 * @apiVersion      0.0.1
 * @apiName         Delete
 * @apiGroup        Service
 * @apiDescription  Deletes service data
 *
 * @apiPermission     All
 *
    * @apiParam (Query)   {String} [ name = undefined ]  - String
    * @apiParam (Query)   {String} [ serviceId = undefined ]  - String
    * @apiParam (Query)   {Array} [ routes = undefined ]  - Array
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
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/service
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
