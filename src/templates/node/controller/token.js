/**
 * @author              __author__
 * @name                __serviceName__
 * @module              token.js
 * @description         Controller for token
 * @kind                Controller
 * @copyright           __copyright__
 */

let
    constants               = require('../lib/constant'),
    userDAL                 = require('../dal/user'),
    roleDAL                 = require('../dal/role'),
    acmDAL                  = require('../dal/acm'),
    logger                  = require('../lib/helper/others/logger'),
    errorCodes              = constants.errorCodes,
    config                  = require('../config'),
    helper                  = require('../lib/helper/'),
    controllerHelper        = helper.controllerHelper,
    debug                   = require('debug')('__serviceName__/controller/token'),
    jwt                     = require('jsonwebtoken'),
    async                   = require('async');

const
    PROCESSING_REQUEST      = "Processing Request",
    ACCESS_DENIED           = "Access Denied",
    ACCESS_GRANTED          = "Access Granted";

/**
 * @name                - Create
 * @description         - Creates token data
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.create          = function (req, res, next) {
    debug('Create init...');

    let body = req.body;
    async.waterfall([
        validateData,
        createUser,
        createData,
    ],function () {
        debug('Create completed.');
    });

    /**
     * @name                - Validate data
     * @description         - Validates if the body contains the require field.
     * @param callback      - Callback function (error)
     */
    function validateData (callback) {
        debug('Validate data init...');
        controllerHelper.dataValidator(["userId"],req,res,callback);
    }

    /**
     * @name                - Create user
     * @description         - Creates token requester user.
     * @param callback      - Callback function (error)
     */
    function createUser(callback) {
        debug('Create user init.');

        let query = {userId : body.userId};
        userDAL.getPrivate(query,function (err, data) {
            if(!data && !err){ // No user data found.
                userDAL.create(query, function (err, data) {
                    if(err){
                        let errMsg = errorCodes.SEC.SERVER_SIDE_ERROR;
                        err.detail = err;
                        res.status(500);
                        res.json(errMsg);
                    }else if(data){
                        callback(null);
                    }
                });
            }else{
                callback(null);
            }
        });

    }

    /**
     * @name                - Create data
     * @description         - Creates token data
     * @param callback      - Callback function (error)
     */
    function createData (callback) {
        debug('Create data init...');

        jwt.sign({
            data:{userId : body.userId}
        }, config.SECRET, { expiresIn: config.TOKEN_EXPIRATION_TIME },(err, token)=>{
            if(err){
                let errMsg = errorCodes.SEC.SERVER_SIDE_ERROR;
                errMsg.detail = err;
                res.status(500);
                res.json(err);
            }else if(token){
                res.status(201);
                res.json({
                    token : token
                });
            }
            callback(null);
        });

    }
};

exports.validate        = function (req, res, next) {
    debug("Validate token init");

    let
        body = req.body,
        userId = null;

    async.waterfall([
        validateData,
        saveRequest,
        isRouteAllowedToAccessByAny,
        createUserData, // Creates user if user does not exists.
        areAnyRoleAllowedToAccessRouteAndObject,
        isUserAllowedToPerformMethodOnObject, // Respond
    ],function () {
        debug("Token verification completed.");
    });

    /**
     * @name                - Validate Data
     * @description         - Validate body field
     * @param callback      - Callback function (error)
     */
    function validateData(callback) {
        debug('Validate data init.');
        controllerHelper.dataValidator(["route","method","token"],req,res,callback);
    }

    /**
     * @name                - Save request
     * @description         - Saves all requests.
     * @param callback      - Callback function (error)
     */
    function saveRequest(callback) {
        debug("Save request init.");
        jwt.verify(body.token, config.SECRET, function (err, decoded) {
            if(err){
                let errMsg = errorCodes.SEC.VALIDATION_ERROR;
                errMsg.detail = err.name;
                errMsg.message = "Access Denied.";
                res.status(401);
                res.json(errMsg);

                // Logged Access denied.
                body.status = ACCESS_DENIED;
                logger.log("warning", body);
            }else{
                body.userId = decoded.data.userId;
                // Log request processing
                body.status = PROCESSING_REQUEST;
                logger.log("debug",body);
                callback(null, decoded);
            }
        });
    }

    /**
     * @name                - Is route allowed to access by all
     * @description         - Checks if the requested route is allowed to be accessed by all
     * @param decodedToken  - Decoded token val
     * @param callback      - Callback function (error)
     */
    function isRouteAllowedToAccessByAny(decodedToken, callback) {
        debug('Is route allowed to access route by any.');
        if(body.method === "POST"){
            let roleQuery = {
                'name' : 'any', 'accessRoutes.route' : body.route, 'accessRoutes.method' : body.method
            };
            roleDAL.getAllCollection(roleQuery, function (err, data) {
                if(data.length > 0){
                    res.status(200);
                    res.json({message : "Access Granted."});

                    // Update log status to granted.
                    body.status = ACCESS_GRANTED;
                    logger.log("debug",body);
                }else{ // Route is not allowed to be accessed by many.
                    callback(null, decodedToken);
                }
            })
        }else{
            callback(null,decodedToken);
        }
    }

    /**
     * @name                - Create user data
     * @description         - Creates or retrieves user data
     * @param decodedData   - Token decoded data.
     * @param callback      - Callback function (error, userData)
     */
    function createUserData(decodedData, callback) {
        debug("Create user data init.");
        let query = {userId : decodedData.data.userId};
        userId = decodedData.data.userId;
        userDAL.getPrivate(query, function (err, data) {
            if(err){
                let errMsg = errorCodes.SEC.SERVER_SIDE_ERROR;
                errMsg.detail = err;
                res.status(500);
                res.json(errMsg);
            }else if(!data){ // No user data found, create one with empty role.
                userDAL.create(query, function (err, createdData) {
                    if(!err && createdData){callback(null, createdData);}
                })
            }else if(data){ // Found user data.
                callback(null, data);
            }
        });
    }

    /**
     * @name                - Are roles allowed to access route
     * @description         - Are roles allowed to access route
     * @param userData      - User data
     * @param callback      - Callback function (error, userData)
     */
    function areAnyRoleAllowedToAccessRouteAndObject(userData, callback) {
        debug("Are roles allowed to access route init.");
        let roleQuery = {name : 'any', 'accessRoutes.route': body.route, 'accessRoutes.method' : body.method};

        roleDAL.getAllCollection(roleQuery, function (err, roleData) {
            if(roleData.length > 0){ // this route is allowed to be accessed by anyone.
                if(body.objectId === undefined){ // Verification does not require object ownership
                    res.status(200);
                    res.json({message : "Access Granted."});

                    // Update log status to granted.
                    body.status = ACCESS_GRANTED;
                    logger.log("debug",body);
                }else{
                    isSubjectAllowedToPerformMethodOnObject('any', body.objectId, body.method, function (err, isAllowedToAccess) {
                        if(isAllowedToAccess){
                            res.status(200);
                            res.json({message : "Access Granted."});

                            // Update log status to granted.
                            body.status = ACCESS_GRANTED;
                            logger.log("debug",body);
                        }else{callback(null, true, userData);}
                    });
                }
            }else{
                callback(null, false, userData);
            }
        });
    }

    /**
     * @name                - Is user allowed to perform method on object
     * @description         - Checks if user has ownership of the provided method on object
     * @param isRouteForAll - true if route and it's method is allowed to be accessed by all.
     * @param userData      - User data
     * @param callback      - Callback function (error)
     */
    function isUserAllowedToPerformMethodOnObject(isRouteForAll, userData, callback) {
        debug("Is user allowed to perform method on object init.");

        async.waterfall([
            retrieveAllRolesAllowedToAccessRoute, // get all roles allowed to access route and method
            checkIfSubjectIsAllowedToPerformMethodOnObject // If user is allowed to access route then check method operation
        ],function () {
            callback(null);
        });

        /**
         * @name            - Retrieve all roles allowed to access route
         * @description     - Retrieves all roles allowed to access requested route
         * @param cb        - Callback function (error, isUserAllowedToAccessRoute)
         */
        function retrieveAllRolesAllowedToAccessRoute(cb) {
            if(isRouteForAll){
                cb(null, isRouteForAll);
            }else{
                let roleQuery = {'members' : userData.userId, 'accessRoutes.route': body.route, 'accessRoutes.method' : body.method};
                roleDAL.getAllCollection(roleQuery, function (err, roleData) {
                    if(roleData.length > 0){ // this route is allowed to be accessed by anyone.
                        cb(null, true);
                    }else{
                        res.status(401);
                        res.json({message : "Access Denied."});

                        // Logged Access denied.
                        body.status = ACCESS_DENIED;
                        logger.log("warning", body);
                    }
                });
            }
        }

        /**
         * @name                    - Check if subject is allowed to perform method on object
         * @description             - Checks if the subject is allowed to perform method on object
         * @param isRouteAllowed    - True if route is allowed for the user or for all.
         * @param cb                - Callback function (error)
         */
        function checkIfSubjectIsAllowedToPerformMethodOnObject(isRouteAllowed, cb) {
            if(isRouteAllowed){
                if(body.objectId === undefined){ // Verification does not require object ownership
                    res.status(200);
                    res.json({message : "Access Granted."});

                    // Update log status to granted.
                    body.status = ACCESS_GRANTED;
                    logger.log("debug",body);
                }else{
                    isSubjectAllowedToPerformMethodOnObject(userData.userId, body.objectId, body.method, function (err, isAllowedToAccess) {
                        if(isAllowedToAccess){
                            res.status(200);
                            res.json({message : "Access Granted."});

                            // Update log status to granted.
                            body.status = ACCESS_GRANTED;
                            logger.log("debug",body);
                        }else{ // User is not allowed to access the data at all.
                            res.status(401);
                            res.json({message : "Access Denied."});

                            // Logged Access denied.
                            body.status = ACCESS_DENIED;
                            logger.log("warning", body);
                        }
                        cb(null);
                    });
                }
            }else{
                res.status(401);
                res.json({message : "Access Denied."});

                // Logged Access denied.
                body.status = ACCESS_DENIED;
                logger.log("warning", body);
            }

        }
    }


    /**
     * @name                - Is subject allowed to perform method on object
     * @description         - Checks if the subject is allowed to perform certain action on the object.
     * @param subject       - Subject id ('any', 'objectId')
     * @param objectId      - ObjectId of the resource being accessed.
     * @param method        - http methods ('GET', 'PUT', 'DELETE')
     * @param callback      - Callback function (error, isAllowedToAccess)
     */
    function isSubjectAllowedToPerformMethodOnObject(subject, objectId, method, callback) {
        let query,
            methodPOST = method === "POST";

        if(method === "GET"){
            query = {'subject' : subject,  'accessControl.read'   : objectId};
        }else if(method === "PUT"){
            query = {'subject' : subject,  'accessControl.update' : objectId};
        }else if(method === "DELETE"){
            query = {'subject' : subject,  'accessControl.delete' : objectId}
        }

        if(methodPOST){callback(null, false);}
        else{
            acmDAL.getAllCollection(query, function (err,acmData) {
                if(err){
                    callback(null, false);
                }else{
                    callback(null, acmData.length > 0);
                }
            });
        }
    }
};




