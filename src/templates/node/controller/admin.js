/**
 * @author              __author__
 * @name                __serviceName__
 * @module              admin.js
 * @description         Controller for admin
 * @kind                Controller
 * @copyright           __copyright__
 */

let
    adminDAL                = require('../dal/admin'),
    constants               = require('../lib/constant'),
    errorCodes              = constants.errorCodes,
    config                  = require('../config'),
    helper                  = require('../lib/helper/'),
    controllerHelper        = helper.controllerHelper,
    queryResponseHandler    = controllerHelper.queryResponseHandler,
    jwt                     = require('jsonwebtoken'),
    async                   = require('async');


/**
 * @name                - SignUp
 * @description         - Sign's up Administrator
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.signUp          = function (req, res, next) {
    let body = req.body;

    async.waterfall([
        validateData,
        checkIfUserNameIsUnique,
        createAdmin
    ]);

    /**
     * @name                - Validate Data
     * @description         - Validates for required fields
     * @param callback      - Callback function (error)
     */
    function validateData(callback) {
        controllerHelper.dataValidator(["userName", "password"],req,res,callback);
    }

    /**
     * @name                - Check if username is unique
     * @description         - Checks if the username is unique
     * @param callback      - Callback function (error)
     */
    function checkIfUserNameIsUnique(callback) {
        let query = {userName : body.userName};

        adminDAL.getPrivate(query, function (err, data) {
            if(err){
                let errMsg = errorCodes.SEC.SERVER_SIDE_ERROR;
                errMsg.detail = err;
                res.status(500);
                res.json(errMsg);
            }else if(data){
                let errMsg = errorCodes.AUT.USERNAME_EXISTS;
                errMsg.detail = `Username : ${body.userName} already exists.`;
                res.status(400);
                res.json(errMsg);
            }else if(!data){
                callback(null);
            }
        });
    }

    /**
     * @name                - Create Admin
     * @description         - Creates Admin
     * @param callback      - Callback function (error)
     */
    function createAdmin(callback) {
        adminDAL.create(body,function (err,data) {// register admin here
            queryResponseHandler(err,data,res,function (err, data) {
                data.password = undefined;
                if(data){ // Data returned
                    res.status(201);
                    res.json(data);
                    callback(null);
                }else if(!data){ // No data returned.
                    res.status(500);
                    res.json(errorCodes.SEC.NO_DATA_FOUND);
                }
            });
        });
    }

};

/**
 * @name                - Login
 * @description         - Logs in admin and generates a token
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.login           = function (req, res, next) {
    let body = req.body;
    async.waterfall([
        validateData,
        validateUserNamePassword,
        generateToken
    ]);

    /**
     * @name            - Validate data
     * @description     - Validates for required fields.
     * @param callback  - Callback function (error)
     */
    function validateData(callback) {
        controllerHelper.dataValidator(["userName", "password"],req,res,callback);
    }

    /**
     * @name            - Validate userName password
     * @description     - Validates username and password
     * @param callback  - Callback function (error)
     */
    function validateUserNamePassword(callback) {
        let query = {userName : body.userName};
        adminDAL.comparePassword(query, body.password, function (error, isValid) {
            if(error){
                let errMsg = errorCodes.AUT.UNAUTHORIZED_ACCESS;
                errMsg.detail = error;
                res.status(401);
                res.json(errMsg);
            }else if(!isValid){
                let errMsg = errorCodes.AUT.UNAUTHORIZED_ACCESS;
                errMsg.detail = "Username or password does not match";
                res.status(401);
                res.json(errMsg);
            }else if (isValid){
                callback(null);
            }
        });
    }

    /**
     * @name            - Generate token
     * @description     - Generates token for the validated user
     * @param callback  - Callback function (error)
     */
    function generateToken(callback) {
        jwt.sign({
            data:{userName : body.userName}
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

/**
 * @name                - Find
 * @description         - Retrieves private, public and paginated data based on query construct
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.find            = function (req, res, next) {
    if(req.query._id !== undefined) {
        if(req.query.private === undefined) {
            getPrivate(req, res, next);
        }else{
            getPublic(req, res, next);
        }
    }else{
        let option = {
            page     : req.query.page  === undefined ? 1                             : Number(req.query.page),   // assigns default page value, if not specified.
            sort     : req.query.sort  === undefined ? {_id : -1}                    : req.query.sort,           // assigns default sort param value, if not specified.
            lean     : req.query.lean  === undefined ? false                         : req.query.lean,           // assigns default lean value, if not specified.
            limit    : req.query.limit === undefined ? config.COLLECTION_RETURN_SIZE : Number(req.query.limit),  // assigns default limit value (passed to the config), if not specified.
            select   : "email userName role firstModified lastModified"
        };

        let query = controllerHelper.queryFilter(req,["email" ,"userName" , "role", "_id", "__v"]);
        // get collection paginated invoked
        adminDAL.getCollectionsPaginated(query,option,function (err,data) {
            queryResponseHandler(err,data,res,function (err, data) { // Possible errors are handled.
                if(data){ // Data found.
                    res.status(200);
                    res.json(data);
                }else if(!data){ // No data found.
                    let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                    errMsg.detail = "No admin data found."; // Adding detailed data.
                    res.status(404);
                    res.json(errMsg);
                }
            });
        });
    }
};

/**
 * @name                - Update Many
 * @description         - Updates all admin data that matches query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.update          = function (req, res, next) {
    let query = controllerHelper.queryFilter(req,["email", "userName", "role", "_id", "__v"]);
    async.waterfall([
        pickUpdateData,
        updateData
    ],function () {
    });

    /**
     * @name                - Pick update data
     * @description         - Picks up valid update data.
     * @param callback      - Callback function (error,validUpdateData)
     */
    function pickUpdateData (callback)                  {
        controllerHelper.pickUpdateData(["email", "userName", "role"],req,function (err,validUpdateData) { // Picking up valid update data.
            if(Object.keys(validUpdateData).length === 0){ // No valid update data found.
                let errMsg = errorCodes.SEC.IMPROPER_DATA;
                errMsg.detail = "Valid update data not found.";
                res.status(400);
                res.json(errMsg);
            }else if(Object.keys(validUpdateData).length > 0){callback(null,validUpdateData);} // Valid update data found.
        });
    }

    /**
     * @name                        - Update admin
     * @description                 - Updates admin data.
     * @param validUpdateData       - Valid update data.
     * @param callback              - Callback function (error)
     */
    function updateData (validUpdateData,callback)  {
        if(Object.keys(query).length === 0){
            let errMsg = errorCodes.SEC.NO_DATA_FOUND;
            errMsg.detail = "No query data found.";
            res.status(400);
            res.json(errMsg)
        }else{
            adminDAL.updateMany(query,validUpdateData,function (err,data) {   // handling update.
                queryResponseHandler(err,data,res,function (err, data) {    // Possible errors are handled.
                    res.status(200);
                    res.send(data);
                    callback(null);
                });
            });
        }

    }
};

/**
 * @name                - Remove Many
 * @description         - Removes all admin data that matches query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.remove          = function (req, res, next) {
    let query = controllerHelper.queryFilter(req,["email", "userName", "role", "_id", "__v"]);

    if(Object.keys(query).length === 0){
        let errMsg = errorCodes.SEC.NO_DATA_FOUND;
        errMsg.detail = "No query data found.";
        res.status(400);
        res.json(errMsg)
    }else{
        adminDAL.removeMany(query,function (err,data) {   // handling update.
            queryResponseHandler(err,data,res,function (err, data) {   // Possible errors are handled.
                res.status(200);
                res.send(data);
            });
        });
    }
};

/**
 * @name                - Count
 * @description         - Counts by query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.count           = function (req, res, next) {
    let query = controllerHelper.queryFilter(req,["email", "userName", "role" , "_id", "__v"]);

    adminDAL.count(query, function (err, count) {
        if(err){
            let errMsg = errorCodes.SEC.SERVER_SIDE_ERROR;
            errMsg.detail = err;
            res.status(500);
            res.json(errMsg);
        }else{
            res.status(200);
            res.json({count : count});
        }
    });
};


/**
 *
 * @name                - Find public
 * @description         - Find admin data by id visible only fields that are public.
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
function getPublic  (req, res, next) {
    let
        adminId = req.query._id,
        query   = {_id: adminId}; // query construction.

    adminDAL.getPublic(query,function (err,data) { // retrieve admin public data (with out the value)
        queryResponseHandler(err,data,res,function (err, data) { // Error handled.
            if(!data){ // No admin value could be found
                res.status(404);
                res.json(errorCodes.SEC.NO_DATA_FOUND);
            }else if(data){ // Found admin data
                res.status(200);
                res.send(data);
            }
        });
    });
}

/**
 * @name                - Find private
 * @description         - Find admin data by id visible only fields that are private.
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
function getPrivate (req, res, next) {
    let
        adminId = req.query._id,
        query   = {_id: adminId}; // query construction.

    adminDAL.getPrivate(query,function (err,data) { // retrieve admin public data (with out the value)
        queryResponseHandler(err,data,res,function (err, data) { // Error handled.
            if(!data){ // No admin value could be found
                res.status(404);
                res.json(errorCodes.SEC.NO_DATA_FOUND);
            }else if(data){ // Found admin data
                res.status(200);
                res.send(data);
            }
        });
    });
}