/**
 * @author              __author__
 * @name                __serviceName__
 * @module              acm.js
 * @description         Route for acm
 * @kind                Router
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
 * @apiGroup        acm
 * @apiDescription  Creates new acm data
 *
 * @apiPermission     All
 *
 * @apiParamExample Body
 *
 {
    "subject": "5cee730bb2820d47582e9abd",
    "accessControl": {
        "read": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
        "update": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"],
        "delete": [ "5cee7a0493f93a4e65b32633", "5cee7a0493f93a4e65b32631", "5cee7a0493f93a4e65b32632", "5cee7a0493f93a4e65b32634"]
    }
 }

 *  
 *
    * @apiParam    (Body)  {Oid }    subject            - subject
    * @apiParam    (Body)  {Object}  accessControl      - accessControl
 *
    * @apiSuccess      {Oid}    subject     - subject
    * @apiSuccess      {Object}    accessControl     - accessControl
    * @apiSuccess     {String}    __v           - Version
    * @apiSuccess     {String}    _id           - Id
    * @apiSuccess     {String}    firstModified - First modified
    * @apiSuccess     {String}    lastModified  - Last modified
 *  
 *
 * @apiSuccessExample Body
 *
 *
 {
    "subject": "5cee730bb2820d47582e9abd",
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
 * @api             {get} __baseURL__/acm     Get
 * @apiVersion      0.0.1
 * @apiName         Get
 * @apiGroup        acm
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
 * @apiGroup        acm
 * @apiDescription  Updates new acm data
 *
 * @apiPermission     All
 *
 * @apiParamExample Body
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
 * @apiGroup        acm
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
