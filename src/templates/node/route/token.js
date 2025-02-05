/**
 * @author              __author__
 * @name                __serviceName__
 * @module              token.js
 * @description         Defines route for token
 * @kind                Route
 * @copyright           __copyright__
 */

let
    express     = require('express'),
    router      = express.Router(),
    controller  = require('../controller/token');


/**
 * @api             {post} __baseURL__/token/create     Create
 * @apiVersion      0.0.1
 * @apiName         Create
 * @apiGroup        Token
 * @apiDescription  Creates new token data
 *
 * @apiPermission     All
 *
 *  
 *
 * @apiParamExample Body
 *
    {
        "userId": "5cee730bb2820d47582e9abd",
    }
 *  
 *
    * @apiParam    (Body)  {Oid}    userId     - userId
    * @apiSuccess  {String}    token     - token
 *  
 *
 * @apiSuccessExample Body
 *
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6InNvbWVVc2VySWQifSwiaWF0IjoxNTU5MjAyMjY3LCJleHAiOjE1NTkyMDU4Njd9.kDeYO6nTuC8B8eZtC6U6IqbHPhrxY-G59U8jVesywCA",
    }
 *  
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/token/create
 *
 * @apiError    (400)       {Object}    AUTHENTICATION_NOT_SET              - Authentication values are not set.
 * @apiError    (400)       {Object}    AUTHENTICATION_TYPE_NOT_ACCORD      - Authentication type is not according to constants.
 * @apiError    (400)       {Object}    AUTHENTICATION_VALUE_NOT_SET        - Authentication values are not set.
 * @apiError    (401)       {Object}    UNAUTHORIZED_ACCESS                 - Token is not authorized to access this route..
 * @apiError    (401)       {Object}    TOKEN_REVOKED                       - Token is revoked.
 * @apiError    (401)       {Object}    TOKEN_EXPIRED                       - Token has expired.
 * @apiError    (401)       {Object}    AUTHORIZED_SERVICE_ACCESS_DENIED    - Service has no been granted access.
 */
router.post('/create'       , controller.create);

/**
 * @api             {post} __baseURL__/token/validate     Validate
 * @apiVersion      0.0.1
 * @apiName         Validate
 * @apiGroup        Token
 * @apiDescription  validates request object.
 *
 * @apiPermission     All
 *
 * @apiParamExample Body
 *
 {
     "route"    : "http://awra/products/gets",
     "method"   : "POST",
     "body"     : {"one" : "one"},
     "objectId" : "5cefd27204d6a9688478ab72",
     "token"    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjVjZWU3MzBiYjI4MjBkNDc1ODJlOWFiZCJ9LCJpYXQiOjE1NTkyMzEyNTIsImV4cCI6MTU2MTgyMzI1Mn0.snOfyzFkyjcNS4NFt4btt64Sk9_8bIzqVTVuGDJLDxk"
 }
 *
 *
 * @apiParam    (Body)  {String}    route       - Route
 * @apiParam    (Body)  {String}    method      - Method
 * @apiParam    (Body)  {Object}    body        - body
 * @apiParam    (Body)  {Oid}       objectId    - Object Id
 * @apiParam    (Body)  {String}    token       - Token
 *
 * @apiSuccess  {String}    message     - Message
 *
 * @apiSuccessExample Body
 *
 {
     "message": "Access Denied."
 }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/token/validate
 *
 * @apiError    (400)       {Object}    AUTHENTICATION_NOT_SET              - Authentication values are not set.
 * @apiError    (400)       {Object}    AUTHENTICATION_TYPE_NOT_ACCORD      - Authentication type is not according to constants.
 * @apiError    (400)       {Object}    AUTHENTICATION_VALUE_NOT_SET        - Authentication values are not set.
 * @apiError    (401)       {Object}    UNAUTHORIZED_ACCESS                 - Token is not authorized to access this route..
 * @apiError    (401)       {Object}    TOKEN_REVOKED                       - Token is revoked.
 * @apiError    (401)       {Object}    TOKEN_EXPIRED                       - Token has expired.
 * @apiError    (401)       {Object}    AUTHORIZED_SERVICE_ACCESS_DENIED    - Service has no been granted access.
 *
 */
router.post('/validate'     , controller.validate);


module.exports = router;
