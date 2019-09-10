/**
 * @author              __author__
 * @name                __serviceName__
 * @module              acm.js
 * @description         Defines route for acm
 * @kind                Route
 * @copyright           __copyright__
 */

let
    express     = require('express'),
    router      = express.Router(),
    controller  = require('../controller/acm');

/**
 * @api             {post} __baseURL__/acm     Create
 * @apiVersion      0.0.1
 * @apiName         Create
 * @apiGroup        ACM
 * @apiDescription  Creates new acm data
 *
 * @apiPermission     All
 *
 * @apiParamExample Body (subject)
 *
 {
    "subject": "Admin 1",
    "accessControl": {
        "read": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
        "update": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
        "delete": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"]
    }
 }

 * @apiParamExample Body (object)
 *
 {
    "object": "5cee730bb2820d47582e9abd",
    "schemaName" : "blog",
    "accessControl": {
        "read": [ "Admin 1", "Admin 2", "Admin 3"],
        "update": [ "Admin 1", "Admin 2"],
        "delete": [ "Admin 4", "Admin 5"]
    }
 }
 *  
 *
 * @apiParam (Query)   {String="subject", "object"} [ createBy ]  - String
 *

 * @apiParam    (Body-subject)  {Oid }    subject            - subject
 * @apiParam    (Body-object)  {Oid }    object            - object
 * @apiParam    (Body)  {Object}  accessControl      - accessControl
 *
    * @apiSuccess      {Oid}    subject     - subject
    * @apiSuccess      {Oid}    object     - object
    * @apiSuccess      {Object}    accessControl     - accessControl
    * @apiSuccess     {String}    __v           - Version
    * @apiSuccess     {String}    _id           - Id
    * @apiSuccess     {String}    firstModified - First modified
    * @apiSuccess     {String}    lastModified  - Last modified
 *  
 *
 * @apiSuccessExample Body (Subject)
 *
 *
 {
    "subject": "Admin 1",
    "accessControl": {
        "read": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
        "update": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
        "delete": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"]
    },
    "__v": "47",
    "firstModified": "2019-05-29T11:55:04.246Z",
    "lastModified": "2019-05-29T11:55:04.246Z",
    "_id": "5cee7318b2820d47582e9ace"
 }

 * @apiSuccessExample Body (Object)
 *
 *
 {
     "acmSubjects": [
         {
             "accessControl": {
                 "read": [
                     "123456",
                     "12345677777",
                     "5d5a802847f0d92a39d18de0",
                     "5d5a81577222fe2b42755dca"
                 ],
                 "update": [
                     "5d5a802847f0d92a39d18de0",
                     "5d5a81577222fe2b42755dca"
                 ],
                 "delete": [
                     "5d5a802847f0d92a39d18de0",
                     "5d5a81577222fe2b42755dca"
                 ]
             },
             "_id": "5d5a7b5bd045dd26f7d39f93",
             "subject": "Admin 1",
             "firstModified": "2019-08-19T10:35:07.579Z",
             "lastModified": "2019-08-19T11:11:19.684Z",
             "__v": 16
         },
         {
             "accessControl": {
                 "read": [],
                 "update": [],
                 "delete": [
                     "5cee730bb2820d47582e9abd"
                 ]
             },
             "_id": "5d5a83d7503de22d1193bd80",
             "subject": "Admin 5",
             "firstModified": "2019-08-19T11:11:19.673Z",
             "lastModified": "2019-08-19T11:11:19.673Z",
             "__v": 0
         },
         {
             "accessControl": {
                 "read": [
                     "123456",
                     "12345677777",
                     "5d5a80ca7e4f972ab0bc904f",
                     "5d5a819e58f0092ba38d5a1a"
                 ],
                 "update": [
                     "5d5a80ca7e4f972ab0bc904f",
                     "5d5a819e58f0092ba38d5a1a"
                 ],
                 "delete": [
                     "123456",
                     "12345677777",
                     "5d5a80ca7e4f972ab0bc904f",
                     "5d5a819e58f0092ba38d5a1a"
                 ]
             },
             "_id": "5d5a7b5bd045dd26f7d39f92",
             "subject": "Admin 2",
             "firstModified": "2019-08-19T10:35:07.579Z",
             "lastModified": "2019-08-19T11:01:53.503Z",
             "__v": 15
         },
         {
             "accessControl": {
                 "read": [
                     "5d5a804bdd36e52a69350c37",
                     "5d5a813b9407332b14c3773a",
                     "5d5a817fc9ad4b2b621a3f7e",
                     "5d5a81e1ed8fe72bd75556b6"
                 ],
                 "update": [
                     "5d5a804bdd36e52a69350c37",
                     "5d5a813b9407332b14c3773a",
                     "5d5a817fc9ad4b2b621a3f7e",
                     "5d5a81e1ed8fe72bd75556b6"
                 ],
                 "delete": [
                     "5d5a804bdd36e52a69350c37",
                     "5d5a813b9407332b14c3773a",
                     "5d5a817fc9ad4b2b621a3f7e",
                     "5d5a81e1ed8fe72bd75556b6"
                 ]
             },
             "_id": "5d5a804edd36e52a69350c81",
             "subject": "Admin 3",
             "firstModified": "2019-08-19T10:56:14.862Z",
             "lastModified": "2019-08-19T11:03:00.406Z",
             "__v": 9
         },
         {
             "accessControl": {
                 "read": [
                     "5d5a8147a102592b329b3ce8"
                 ],
                 "update": [
                     "5d5a8147a102592b329b3ce8"
                 ],
                 "delete": [
                     "123456",
                     "12345677777",
                     "5d5a8147a102592b329b3ce8",
                     "5cee730bb2820d47582e9abd"
                 ]
             },
             "_id": "5d5a7b5bd045dd26f7d39f95",
             "subject": "Admin 4",
             "firstModified": "2019-08-19T10:35:07.590Z",
             "lastModified": "2019-08-19T11:00:36.877Z",
             "__v": 12
         }
     ]
 }
 *
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/acm
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
 * @api             {get} __baseURL__/acm/count     Count
 * @apiVersion      0.0.1
 * @apiName         Count
 * @apiGroup        ACM
 * @apiDescription  Counts acm by query
 *
 * @apiPermission     All
 *
 * @apiParam (Query)   {Oid} [ subject = undefined ]  - Oid
 * @apiParam (Query)   {Object} [ accessControl = undefined ]  - Object1
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
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/acm/count
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
 * @api             {get} __baseURL__/acm     Get
 * @apiVersion      0.0.1
 * @apiName         Get
 * @apiGroup        ACM
 * @apiDescription  Retrieves acm data
 *
 * @apiPermission     All
 *
 * @apiParam (Query)        {Number}    [page = 1]                          - Page Number
 * @apiParam (Query)        {String}    [sort = id]                         - Sort order by
 * @apiParam (Query)        {Boolean}   [lean = false]                      - Lean
 * @apiParam (Query)        {Number}    [offset = 0]                        - Offset
 * @apiParam (Query)        {Number}    [limit = 12]            - Limit of return
 *
    * @apiParam (Query)   {Oid} [ subject = undefined ]  - Oid
    * @apiParam (Query)   {Object} [ accessControl = undefined ]  - Object
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
                "subject": "5cee730bb2820d47582e9abd",
                "accessControl": {
                    "read": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
                    "update": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
                    "delete": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"]
                },
                "__v": "21",
                "firstModified": "2019-05-29T11:55:04.247Z",
                "lastModified": "2019-05-29T11:55:04.247Z",
                "_id": "5cee7318b2820d47582e9acf"
            },

            {
                "subject": "5cee730bb2820d47582e9abd",
                "accessControl": {
                    "read": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
                    "update": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
                    "delete": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"]
                },
                "__v": "21",
                "firstModified": "2019-05-29T11:55:04.247Z",
                "lastModified": "2019-05-29T11:55:04.247Z",
                "_id": "5cee7318b2820d47582e9acf"
            },

            {
                "subject": "5cee730bb2820d47582e9abd",
                "accessControl": {
                    "read": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
                    "update": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
                    "delete": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"]
                },
                "__v": "21",
                "firstModified": "2019-05-29T11:55:04.247Z",
                "lastModified": "2019-05-29T11:55:04.247Z",
                "_id": "5cee7318b2820d47582e9acf"
            },
            
        ],
        "total": 12,
        "limit": 3,
        "offset": 0
    }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/acm
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
 * @api             {put} __baseURL__/acm     Update
 * @apiVersion      0.0.1
 * @apiName         Update
 * @apiGroup        ACM
 * @apiDescription  Updates new acm data
 *
 * @apiPermission     All
 *
 * @apiParamExample Body (object)
 *
 {
     "subject": "5cee730bb2820d47582e9abd",
     "accessControl": {
         "read": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
         "update": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
         "delete": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"]
     },
     "__v": "21",
     "firstModified": "2019-05-29T11:55:04.247Z",
     "lastModified": "2019-05-29T11:55:04.247Z",
     "_id": "5cee7318b2820d47582e9acf"
 }
 *  
 *
 *
 * @apiParam (Query)   {Oid} [ subject = undefined ]  - Oid
 * @apiParam (Query)   {Object} [ accessControl = undefined ]  - Object
 * @apiParam (Query)   {String="pull", "push"} [ operation]  - String
 * @apiParam (Query)   {String} [ target ]  - String
 * @apiParam (Query)   {String="true", "false"} [ createOnNoModified ]  - String
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
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/acm
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
 * @api             {delete} __baseURL__/acm     Delete
 * @apiVersion      0.0.1
 * @apiName         Delete
 * @apiGroup        ACM
 * @apiDescription  Deletes acm data
 *
 * @apiPermission     All
 *
    * @apiParam (Query)   {Oid} [ subject = undefined ]  - Oid
    * @apiParam (Query)   {Object} [ accessControl = undefined ]  - Object
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
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/acm
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
