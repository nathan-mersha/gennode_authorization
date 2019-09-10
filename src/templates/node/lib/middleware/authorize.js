/**
 * @author              __author__
 * @name                __serviceName__
 * @module              validate.js
 * @description         Middleware validator
 * @kind                Middleware
 * @copyright           __copyright__
 */

let
    async       = require('async'),
    constants   = require('../constant'),
    config      = require('../../config'),
    adminDAL    = require('../../dal/admin'),
    accessRoute = constants.accessRoutes,
    _           = require('underscore'),
    jwt         = require('jsonwebtoken'),
    errorCodes  = constants.errorCodes;

/**
 * @name            - Authorize
 * @description     - Authorize's requests
 * @param req       - Request object
 * @param res       - Response object
 * @param next      - Next
 */
function authorize(req,res,next) {

    async.waterfall([
        isOpenRoute,
        retrieveToken,
        getRole,
        checkRouteAccess
    ]);

    /**
     * @name            - Is open route
     * @description     - Checks if route is one of the open routes that should be accessed by all
     * @param callback  - Callback function (error)
     */
    function isOpenRoute(callback) {
        let requestedRoute = {
            method   : req.method.toUpperCase(),
            endpoint : normalizeEndPoint(req.originalUrl.toLowerCase())
        };
        _.findWhere(accessRoute.openRoute, requestedRoute) !== undefined ? next() : callback(null);
    }

    /**
     * @name            - Retrieve token
     * @description     - Retrieves token from the request object
     * @param callback  - Callback function (error, tokenValue)
     */
    function retrieveToken(callback) {
        if(req.get("Authorization") === undefined){
            let errMsg = errorCodes.AUT.AUTHENTICATION_TYPE_NOT_ACCORD;
            errMsg.detail = "No authorization key on request header.";
            res.status(401);
            res.json(errMsg);
        }else{
            let
                token       = req.get("Authorization").split(" "),
                errMsg      = errorCodes.AUT.AUTHENTICATION_TYPE_NOT_ACCORD;

            // Checking token type
            if(token[0] !== "Bearer"){
                errMsg.detail = "Token type must be 'Bearer'";
                res.status(401);
                res.json(errMsg);
            }

            // Checking token format
            if(token.length !== 2){
                errMsg.detail = "Token must have the format 'Bearer tokenValue' (Note : there is a space between the token type and the value)";
                res.status(401);
                res.json(errMsg);
            }
            callback(null, token[1]); // Return token value
        }

    }

    /**
     * @name                - Get role
     * @description         - Retrieves user role from the token value
     * @param token         - Token value
     * @param callback      - Callback function (error)
     */
    function getRole(token, callback) {
        jwt.verify(token, config.SECRET, function (err, decoded) {
            if(err){
                let errMsg = errorCodes.SEC.VALIDATION_ERROR;
                errMsg.detail = err.name;
                errMsg.message = "Access Denied.";
                res.status(401);
                res.json(errMsg);
            }else{
                let query = {userName : decoded.data.userName};
                adminDAL.getPrivate(query, function (err, data) {
                    if(err){
                        let errMsg = errorCodes.SEC.SERVER_SIDE_ERROR;
                        errMsg.detail = err;
                        res.status(500);
                        res.json(errMsg);
                    }else if(!data){
                        let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                        errMsg.detail = `No data found for userName : ${decoded.data.userName}`;
                        res.status(401);
                        res.json(errMsg);
                    }else if(data){
                        callback(null, data.role);
                    }
                });
            }
        });
    }

    /**
     * @name                - Check route access
     * @description         - Checks if the role is allowed to access the route.
     * @param role          - Admin's role
     * @param callback      - Callback function (error)
     */
    function checkRouteAccess(role, callback) {
        if(role === "SuperAdmin"){next();}
        else if(role === "Admin"){
            let requestedRoute = {
                method   : req.method.toUpperCase(),
                endpoint : normalizeEndPoint(req.originalUrl.toLowerCase())
            };

            if(_.findWhere(accessRoute.superAdmin, requestedRoute) !== undefined){ // A route only super admin is allowed to access
                let errMsg = errorCodes.AUT.UNAUTHORIZED_ACCESS;
                errMsg.detail = `Route : ${requestedRoute.endpoint}, Method : ${requestedRoute.method} can only be accessed by superAdmin.`;
                res.status(401);
                res.json(errMsg);
            }else{
                next();
                callback(null);
            }

        }
    }

    /**
     * @name                - Normalize endpoint
     * @description         - Truncates the last / if it exists, helps comparing apples to apples.
     * @param endpoint      - Endpoint
     * @returns {*}         - Normalizes endpoint
     */
    function normalizeEndPoint(endpoint) {
        return endpoint.charAt(endpoint.length - 1) === "/" ? endpoint.slice(0, samp.length - 1) : endpoint;
    }


}


module.exports = authorize;

