/**
 * @author              __author__
 * @name                __serviceName__
 * @module              log.js
 * @description         Defines route for log
 * @kind                Route
 * @copyright           __copyright__
 */
let
    express     = require('express'),
    router      = express.Router(),
    controller  = require('../controller/log');

/**
 * @api             {get} __baseURL__/log/status     Status
 * @apiVersion      0.0.1
 * @apiName         Status
 * @apiGroup        Log
 * @apiDescription  Responds with the overall server status
 *
 * @apiPermission     Admin

 * @apiSuccess         {Object}     memoryUsage             - Server's overall memory usage
 * @apiSuccess         {Object}     cpuUsage                - Server's overall cpu usage
 * @apiSuccess         {Number}     upTime                  - Server up time in millisecond
 *
 * @apiSuccessExample Body
 *
 * {
    "memoryUsage": {
        "rss": 93990912,
        "heapTotal": 66248704,
        "heapUsed": 43672032,
        "external": 19428969
    },
    "cpuUsage": {
        "user": 1084000,
        "system": 60000
    },
    "upTime": 4.557
   }
 *
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/log/status
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
router.get('/status', controller.status);

/**
 * @api             {get} __baseURL__/log     Get
 * @apiVersion      0.0.1
 * @apiName         Get
 * @apiGroup        Log
 * @apiDescription  Retrieves log by query.
 *
 * @apiPermission     Admin
 *
 * @apiParam (Query)   {String} [ from=30]          - From, in day where the query should begin
 * @apiParam (Query)   {String} [ to=0]             - To, in day where the query should end
 * @apiParam (Query)   {String} [ limit=12]         - Limit of logs
 * @apiParam (Query)   {String} [ start=0]          - Start from offset 0
 * @apiParam (Query)   {String} [ order=desc]       - Log order, either ascending or descending

 * @apiSuccess         {String}     info            - Logs information
 *
 * @apiSuccessExample Body
 *
 { info:
    [ { service: 'Service A',
        ip: '172.16.1.41',
        params: null,
        path: 'http://sample/accessed/all',
        query: null,
        secure: true,
        xhr: false,
        route: 'http://sample/accessed/all',
        method: 'PUT',
        body: [Object],
        objectId: '5cee7a0456f44a4e65b35532',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjVjZWU3YTA0OTNmOTNhNGU2NWIzMjYzMiJ9LCJpYXQiOjE1NjczMjU2MzMsImV4cCI6MTU3MjUwOTYzM30.oQhBnCi1SOBTH4_dGCPImRK4DL9UEcM2Gn2c0UXvEBE',
        userId: '5cee7a0493f93a4e65b32632',
        status: 'Access Denied',
        level: 'warn',
        message: '',
        timestamp: '2019-09-01T08:13:55.919Z' },
      { service: 'Service T',
        ip: '172.16.1.42',
        params: null,
        path: 'http://sample/accessed/all',
        query: null,
        secure: true,
        xhr: false,
        route: 'http://sample/accessed/none',
        method: 'PUT',
        body: [Object],
        objectId: '5cee7a0493f44a4e65b35532',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjVjZWU3YTA0OTNmOTNhNGU2NWIzMjYzMiJ9LCJpYXQiOjE1NjczMjU2MzMsImV4cCI6MTU3MjUwOTYzM30.oQhBnCi1SOBTH4_dGCPImRK4DL9UEcM2Gn2c0UXvEBE',
        userId: '5cee7a0493f93a4e65b32632',
        status: 'Access Denied',
        level: 'warn',
        message: '',
        timestamp: '2019-09-01T08:13:55.901Z' },
      { service: 'Service T',
        ip: '172.16.1.33',
        params: null,
        path: 'http://sample/accessed/all',
        query: null,
        secure: true,
        xhr: false,
        route: 'http://sample/accessed/user',
        method: 'PUT',
        body: [Object],
        objectId: '5cee7a0493f44a4e65b35532',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjVjZWU3YTA0OTNmOTNhNGU2NWIzMjYzMiJ9LCJpYXQiOjE1NjczMjU2MzMsImV4cCI6MTU3MjUwOTYzM30.oQhBnCi1SOBTH4_dGCPImRK4DL9UEcM2Gn2c0UXvEBE',
        userId: '5cee7a0493f93a4e65b32632',
        status: 'Access Granted',
        level: 'info',
        message: '',
        timestamp: '2019-09-01T08:13:55.894Z' },
      { service: 'Service C',
        ip: '172.16.1.44',
        params: null,
        path: 'http://sample/accessed/all',
        query: null,
        secure: true,
        xhr: false,
        route: 'http://sample/accessed/all',
        method: 'PUT',
        body: [Object],
        objectId: '5cee7a0493f44a4e65b35532',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjVjZWU3YTA0OTNmOTNhNGU2NWIzMjYzMiJ9LCJpYXQiOjE1NjczMjU2MzMsImV4cCI6MTU3MjUwOTYzM30.oQhBnCi1SOBTH4_dGCPImRK4DL9UEcM2Gn2c0UXvEBE',
        userId: '5cee7a0493f93a4e65b32632',
        status: 'Access Granted',
        level: 'info',
        message: '',
        timestamp: '2019-09-01T08:13:55.877Z' },
      { service: 'Service A',
        ip: '172.16.1.41',
        params: null,
        path: 'http://sample/accessed/all',
        query: null,
        secure: true,
        xhr: false,
        route: 'http://sample/accessed/all',
        method: 'DELETE',
        body: [Object],
        objectId: '5cee7a0493f44a4e65b32632',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjVjZWU3YTA0OTNmOTNhNGU2NWIzMjYzMiJ9LCJpYXQiOjE1NjczMjU2MzMsImV4cCI6MTU3MjUwOTYzM30.oQhBnCi1SOBTH4_dGCPImRK4DL9UEcM2Gn2c0UXvEBE',
        userId: '5cee7a0493f93a4e65b32632',
        status: 'Access Denied',
        level: 'warn',
        message: '',
        timestamp: '2019-09-01T08:13:55.862Z' },
      { service: 'Service B',
        ip: '172.16.1.42',
        params: null,
        path: 'http://sample/accessed/all',
        query: null,
        secure: true,
        xhr: false,
        route: 'http://sample/accessed/all',
        method: 'PUT',
        body: [Object],
        objectId: '5cee7a0493f44a4e65b32632',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjVjZWU3YTA0OTNmOTNhNGU2NWIzMjYzMiJ9LCJpYXQiOjE1NjczMjU2MzMsImV4cCI6MTU3MjUwOTYzM30.oQhBnCi1SOBTH4_dGCPImRK4DL9UEcM2Gn2c0UXvEBE',
        userId: '5cee7a0493f93a4e65b32632',
        status: 'Access Granted',
        level: 'info',
        message: '',
        timestamp: '2019-09-01T08:13:55.850Z' },
      { service: 'Service A',
        ip: '172.16.1.41',
        params: null,
        path: 'http://sample/accessed/all',
        query: null,
        secure: true,
        xhr: false,
        route: 'http://sample/accessed/none',
        method: 'POST',
        body: [Object],
        objectId: '5cefd27204d6a9685478ab72',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjVjZWU3YTA0OTNmOTNhNGU2NWIzMjYzMiJ9LCJpYXQiOjE1NjczMjU2MzMsImV4cCI6MTU3MjUwOTYzM30.oQhBnCi1SOBTH4_dGCPImRK4DL9UEcM2Gn2c0UXvEBE',
        userId: '5cee7a0493f93a4e65b32632',
        status: 'Access Denied',
        level: 'warn',
        message: '',
        timestamp: '2019-09-01T08:13:55.831Z' },
      { service: 'Service A',
        ip: '172.16.1.41',
        params: null,
        path: 'http://sample/accessed/all',
        query: null,
        secure: true,
        xhr: false,
        route: 'http://sample/accessed/all',
        method: 'POST',
        body: [Object],
        objectId: '5cefd27204d6a9685478ab72',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6IjVjZWU3YTA0OTNmOTNhNGU2NWIzMjYzMiJ9LCJpYXQiOjE1NjczMjU2MzMsImV4cCI6MTU3MjUwOTYzM30.oQhBnCi1SOBTH4_dGCPImRK4DL9UEcM2Gn2c0UXvEBE',
        userId: '5cee7a0493f93a4e65b32632',
        status: 'Access Granted',
        level: 'info',
        message: '',
        timestamp: '2019-09-01T08:13:53.803Z' } ] }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/log
 *
 * @apiError    (400)       {Object}    AUTHENTICATION_NOT_SET              - Authentication values are not set.
 * @apiError    (400)       {Object}    AUTHENTICATION_TYPE_NOT_ACCORD      - Authentication type is not according to constants.
 * @apiError    (400)       {Object}    AUTHENTICATION_VALUE_NOT_SET        - Authentication values are not set.
 * @apiError    (401)       {Object}    UNAUTHORIZED_ACCESS                 - Token is not authorized to access this route..
 * @apiError    (401)       {Object}    TOKEN_REVOKED                       - Token is revoked.
 * @apiError    (401)       {Object}    TOKEN_EXPIRED                       - Token has expired.
 * @apiError    (401)       {Object}    AUTHORIZED_SERVICE_ACCESS_DENIED    - Service has no been granted access.
 */
router.get('/'   , controller.get);

/**
 * @api             {delete} __baseURL__/log     Flush
 * @apiVersion      0.0.1
 * @apiName         Flush
 * @apiGroup        Log
 * @apiDescription  Flushes all log data
 *
 * @apiPermission     Admin
 *
 * @apiSuccess              {String}    message                             - Log flushed message
 *
 * @apiSuccessExample Body
 *
    {
        message: 'Logs flushed'
    }
 *
 * @apiSampleRequest __reverseProxy__:__port____baseURL__/log
 *
 * @apiError    (400)       {Object}    AUTHENTICATION_NOT_SET              - Authentication values are not set.
 * @apiError    (400)       {Object}    AUTHENTICATION_TYPE_NOT_ACCORD      - Authentication type is not according to constants.
 * @apiError    (400)       {Object}    AUTHENTICATION_VALUE_NOT_SET        - Authentication values are not set.
 * @apiError    (401)       {Object}    UNAUTHORIZED_ACCESS                 - Token is not authorized to access this route..
 * @apiError    (401)       {Object}    TOKEN_REVOKED                       - Token is revoked.
 * @apiError    (401)       {Object}    TOKEN_EXPIRED                       - Token has expired.
 * @apiError    (401)       {Object}    AUTHORIZED_SERVICE_ACCESS_DENIED    - Service has no been granted access.
 */
router.delete('/'   , controller.flush);

module.exports = router;
