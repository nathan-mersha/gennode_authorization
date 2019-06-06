/**
 * @author              Nathan Mersha
 * @name                gennodeAuthServer
 * @module              acm.js
 * @description         Controller for acm
 * @kind                Controller
 * @copyright           Copyright : 2019
 */

let
    acmDAL                  = require('../dal/acm'),
    constants               = require('../lib/constant'),
    errorCodes              = constants.errorCodes,
    config                  = require('../config'),
    helper                  = require('../lib/helper/'),
    controllerHelper        = helper.controllerHelper,
    queryResponseHandler    = controllerHelper.queryResponseHandler,

    debug                   = require('debug')('gennodeAuthServer/controller/acm'),
    util                    = require('util'),
    async                   = require('async');

/**
 * @name                - Create
 * @description         - Creates acm data
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.create          = function (req, res, next) {
    debug('Create init...');

    let body = req.body;
    async.waterfall([
        validateData,
        createData
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

        controllerHelper.dataValidator([],req,res,callback);
    }
    
    /**
     * @name                - Create data
     * @description         - Creates acm data
     * @param callback      - Callback function (error)
     */
    function createData (callback) {
        debug('Create data init...');
        
        acmDAL.create(body,function (err, data) { // Creating acm data
            queryResponseHandler(err,data,res,function (err, data) {
                if(data){ // acm data successfully created
                    res.status(201);
                    res.json(data);
                    callback(null);
                }else {
                    let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                    errMsg.detail = 'acm data could not be found (Failed to create acm data)';
                    res.status(500);
                    res.json(errMsg);
                }
            });
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
    debug('Find init.');

    if(req.query._id !== undefined) {
        if(req.query.private === undefined) {
            getPrivate(req, res, next);
        }else{
            getPublic(req, res, next);
        }
    }else if(req.query.cursor !== undefined && req.query.cursor === "true"){
        res.json("using cursor")
    }else{
        let option = {
            page     : req.query.page  === undefined ? 1                             : Number(req.query.page),   // assigns default page value, if not specified.
            sort     : req.query.sort  === undefined ? {_id : -1}                    : req.query.sort,           // assigns default sort param value, if not specified.
            lean     : req.query.lean  === undefined ? false                         : req.query.lean,           // assigns default lean value, if not specified.
            limit    : req.query.limit === undefined ? config.COLLECTION_RETURN_SIZE : Number(req.query.limit),   // assigns default limit value (passed to the config), if not specified.
            select   : "subject accessControl firstModified lastModified"
        };

        let query = controllerHelper.queryFilter(req,["subject","accessControl" , "_id", "__v"]);
        // get collection paginated invoked
        acmDAL.getCollectionsPaginated(query,option,function (err,data) {
            queryResponseHandler(err,data,res,function (err, data) { // Possible errors are handled.
                if(data){ // Data found.
                    debug("Found data");

                    res.status(200);
                    res.json(data);
                }else if(!data){ // No data found.
                    debug(`Found no data`);

                    let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                    errMsg.detail = "No acm data found."; // Adding detailed data.
                    res.status(404);
                    res.json(errMsg);
                }
            });
        });
    }


    
};

/**
 * @name                - Update Many
 * @description         - Updates all acm data that matches query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.update          = function (req, res, next) {
    debug(`Update many init.`);

    let
        body = req.body,
        query = controllerHelper.queryFilter(req,["subject","accessControl", "_id", "__v"]); // data query

    let
        operation = req.query.operation, // Defines operation on the array, pull or push
        target = req.query.target; // Defines target operation ex (accessControl.read)

    async.waterfall([
        pickUpdateData,
        updateData
    ],function () {
        debug("Update completed.");
    });

    /**
     * @name                - Pick update data
     * @description         - Picks up valid update data.
     * @param callback      - Callback function (error,validUpdateData)
     */
    function pickUpdateData (callback)                  {
        debug("Pick update data init...");

        controllerHelper.pickUpdateData(["subject","accessControl"],req,function (err,validUpdateData) { // Picking up valid update data.
            if(operation !== undefined && target !== undefined){ // Operation method is an array.
                callback(null, null);
            }else{
                if(Object.keys(validUpdateData).length === 0){ // No valid update data found.
                    let errMsg = errorCodes.SEC.IMPROPER_DATA;
                    errMsg.detail = "Valid update data not found in gennodeAuthServer data update.";
                    res.status(400);
                    res.json(errMsg);
                }else if(Object.keys(validUpdateData).length > 0){callback(null,validUpdateData);} // Valid update data found.
            }

        });
    }

    /**
     * @name                        - Update service
     * @description                 - Updates service data.
     * @param validUpdateData       - Valid update data.
     * @param callback              - Callback function (error)
     */
    function updateData (validUpdateData,callback)  {
        debug("Update service init...");

        if(operation !== undefined && target !== undefined){ // Operation method is an array.
            if(Array.isArray(body)){
                if(operation === "pull"){
                    acmDAL.pullFromArray(query, target, body, function (err, data) {
                        if(!err){
                            res.status(200);
                            res.json(data);
                        }else{
                            let errMsg = err.includes("Target array") ? errorCodes.SEC.NO_DATA_FOUND : errorCodes.SEC.SERVER_SIDE_ERROR;
                            errMsg.detail = err;
                            res.status(err.includes("Target array") ? 400 : 500);
                            res.json(errMsg);
                        }
                    });
                }else if(operation === "push"){
                    acmDAL.pushToArray(query, target, body, function (err, data) {
                        if(!err){
                            res.status(200);
                            res.json(data);
                        }else{
                            let errMsg = err.includes("Target array") ? errorCodes.SEC.NO_DATA_FOUND : errorCodes.SEC.SERVER_SIDE_ERROR;
                            errMsg.detail = err;
                            res.status(err.includes("Target array") ? 400 : 500);
                            res.json(errMsg);
                        }
                    });
                }else{
                    let errMsg = errorCodes.SEC.VALIDATION_ERROR;
                    errMsg.detail = `For array manipulation operations method : ${operation} is not valid. Operation must be pull or push.`;
                    res.status(400);
                    res.json(errMsg);
                }
            }else{
                let errMsg = errorCodes.SEC.VALIDATION_ERROR;
                errMsg.detail = `On array manipulation the body must be an array. ${typeof body} is not allowed.`;
                res.status(400);
                res.json(errMsg);
            }
        }else{
            if(Object.keys(query).length === 0){
                let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                errMsg.detail = "No query data found.";
                res.status(400);
                res.json(errMsg)
            }else{
                acmDAL.updateMany(query,validUpdateData,function (err,data) {   // handling update.
                    queryResponseHandler(err,data,res,function (err, data) {    // Possible errors are handled.
                        res.status(200);
                        res.send(data);
                        callback(null);
                    });
                });
            }
        }

    }

};

/**
 * @name                - Remove Many
 * @description         - Removes all acm data that matches query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.remove          = function (req, res, next) {
    debug('Remove many init.');

    let query = controllerHelper.queryFilter(req,["subject","accessControl", "_id", "__v"]);

    if(Object.keys(query).length === 0){
        let errMsg = errorCodes.SEC.NO_DATA_FOUND;
        errMsg.detail = "No query data found.";
        res.status(400);
        res.json(errMsg)
    }else{
        acmDAL.removeMany(query,function (err,data) {   // handling update.
            queryResponseHandler(err,data,res,function (err, data) {   // Possible errors are handled.
                res.status(200);
                res.send(data);
            });
        });
    }
};


/**
 *
 * @name                - Find public
 * @description         - Find acm data by id visible only fields that are public.
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
function getPublic  (req, res, next) {
    debug('Find public init...');

    let
        acmId   = req.query._id,
        query       = {_id: acmId}; // query construction.

    acmDAL.getPublic(query,function (err,data) { // retrieve acm public data (with out the value)
        queryResponseHandler(err,data,res,function (err, data) { // Error handled.
            if(!data){ // No acm value could be found
                res.status(404);
                res.json(errorCodes.SEC.NO_DATA_FOUND);
            }else if(data){ // Found acm data
                res.status(200);
                res.send(data);
            }
        });
    });
}

/**
 * @name                - Find private
 * @description         - Find acm data by id visible only fields that are private.
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
function getPrivate (req, res, next) {
    debug('Find private init...');

    let
        acmId = req.query._id,
        query = {_id: acmId}; // query construction.

    acmDAL.getPrivate(query,function (err,data) { // retrieve acm public data (with out the value)
        queryResponseHandler(err,data,res,function (err, data) { // Error handled.
            if(!data){ // No acm value could be found
                res.status(404);
                res.json(errorCodes.SEC.NO_DATA_FOUND);
            }else if(data){ // Found acm data
                res.status(200);
                res.send(data);
            }
        });
    });
}