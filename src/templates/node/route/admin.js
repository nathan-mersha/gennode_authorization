/**
 * @author              __author__
 * @name                __serviceName__
 * @module              admin.js
 * @description         Defines route for admin
 * @kind                Route
 * @copyright           __copyright__
 */

let
    express     = require('express'),
    router      = express.Router(),
    controller  = require('../controller/admin');


/**
 * @api             {post} __baseURL__/admin/signup     SignUp
 * @apiVersion      0.0.1
 * @apiName         SignUp
 * @apiGroup        Administrator
 * @apiDescription  Sign's up a new admin
 *
 * @apiPermission     SuperAdmin
 *
 * @apiParamExample Body
 *
    {
        userName : 'Chala',
        password : 'adminPassword'
    }

 *
 *
 * @apiParam    (Body)  {String}    userName        - Admin's userName
 * @apiParam    (Body)  {String}    password        - Admin's password
 *
 * @apiSuccess     {String}    role                 - Admin's role
 * @apiSuccess     {String}    userName             - Admin's userName
 * @apiSuccess     {String}    __v                  - Version
 * @apiSuccess     {String}    _id                  - Id
 * @apiSuccess     {String}    firstModified        - First modified
 * @apiSuccess     {String}    lastModified         - Last modified
 *
 *
 * @apiSuccessExample Body
 *
    {
        role: 'Admin',
        _id: '5d6b75735077061659145816',
        userName: 'Chala',
        firstModified: '2019-09-01T07:38:27.070Z',
        lastModified: '2019-09-01T07:38:27.070Z',
        __v: 0
    }

 *
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/admin/signup
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
router.post('/signup'   , controller.signUp);

/**
 * @api             {post} __baseURL__/admin/login     Login
 * @apiVersion      0.0.1
 * @apiName         Login
 * @apiGroup        Administrator
 * @apiDescription  Login's an admin and creates an access token
 *
 * @apiPermission   Any
 *
 * @apiParamExample Body
 *
 {
     userName : 'Chala',
     password : 'adminPassword'
 }
 *
 * @apiParam    (Body)  {String}    userName        - Admin's userName
 * @apiParam    (Body)  {String}    password        - Admin's password
 *
 * @apiSuccess     {String}    token                - Assigned Token
 *
 * @apiSuccessExample Body
 *
 {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJOYW1lIjoiQ2hhbGEifSwiaWF0IjoxNTY3MzIzNTA3LCJleHAiOjE1NzI1MDc1MDd9.U4Dj-XmbfAn1oNGAU5Syj3wUzlBKhkvO4QsHjAsAHqg'
 }
 *
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/admin/login
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
router.post('/login'    , controller.login);

/**
 * @api             {get} __baseURL__/admin/count     Count
 * @apiVersion      0.0.1
 * @apiName         Count
 * @apiGroup        Administrator
 * @apiDescription  Counts admin by query
 *
 * @apiPermission     All
 *
 * @apiParam (Query)   {String} [ email ]       - email
 * @apiParam (Query)   {String} [ userName ]    - userName
 * @apiParam (Query)   {String} [ role ]        - role
 *
 * @apiSuccess              {Number}     count                              - Counts documents
 *
 * @apiSuccessExample Body
 *
 * {
        "count" : 10
   }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/admin/count
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
 * @api             {get} __baseURL__/admin     Get
 * @apiVersion      0.0.1
 * @apiName         Get
 * @apiGroup        Administrator
 * @apiDescription  Retrieves admin data
 *
 * @apiPermission     SuperAdmin
 *
 * @apiParam (Query)        {Number}    [page = 1]                          - Page Number
 * @apiParam (Query)        {String}    [sort = id]                         - Sort order by
 * @apiParam (Query)        {Boolean}   [lean = false]                      - Lean
 * @apiParam (Query)        {Number}    [offset = 0]                        - Offset
 * @apiParam (Query)        {Number}    [limit = 12]                        - Limit of return
 *
 * @apiParam (Query)        {String}    [ _id ]                             - String
 * @apiParam (Query)        {String}    [ role ]                            - String
 * @apiParam (Query)        {String}    [ userName ]                        - userName
 *
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
             "role": "SuperAdmin",
             "_id": "5d696b69500b327e4b6c918e",
             "userName": "gennode",
             "firstModified": "2019-08-30T18:31:05.767Z",
             "lastModified": "2019-08-30T18:31:05.767Z"
         },
         {
             "role": 'Admin',
             "_id": '5d6b75735077061659145816',
             "userName": 'Bekele',
             "firstModified": '2019-09-01T07:38:27.070Z',
             "lastModified": '2019-09-01T07:38:27.070Z',
         },
         {
             "role": 'Admin',
             "_id": '5d6b75735077061659145816',
             "userName": 'Chala',
             "firstModified": '2019-09-01T07:38:27.070Z',
             "lastModified": '2019-09-01T07:38:27.070Z',
         }
     ],
     "total": 1,
     "limit": 12,
     "page": 1,
     "pages": 1
 }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/admin
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
 * @api             {put} __baseURL__/admin     Update
 * @apiVersion      0.0.1
 * @apiName         Update
 * @apiGroup        Administrator
 * @apiDescription  Updates admin data
 *
 * @apiPermission   SuperAdmin
 *
 * @apiParamExample Body
 *
 {
    "role": "SuperAdmin"
 }
 *
 * @apiParam (Query)        {String}    [ _id ]                             - String
 * @apiParam (Query)        {String}    [ role ]                            - String
 * @apiParam (Query)        {String}    [ userName ]                        - userName
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
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/admin
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
 * @api             {delete} __baseURL__/admin     Delete
 * @apiVersion      0.0.1
 * @apiName         Delete
 * @apiGroup        Administrator
 * @apiDescription  Delete admin data
 *
 * @apiPermission   SuperAdmin
 *
 * @apiParam (Query)        {String}    [ _id ]                             - String
 * @apiParam (Query)        {String}    [ role ]                            - String
 * @apiParam (Query)        {String}    [ userName ]                        - userName
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
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/admin
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
