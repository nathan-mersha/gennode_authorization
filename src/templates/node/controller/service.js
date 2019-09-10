/**
 * @author              __author__
 * @name                __serviceName__
 * @module              service.js
 * @description         Controller for service
 * @kind                Controller
 * @copyright           __copyright__
 */

let
    serviceDAL              = require('../dal/service'),
    constants               = require('../lib/constant'),
    errorCodes              = constants.errorCodes,
    config                  = require('../config'),
    helper                  = require('../lib/helper/'),
    controllerHelper        = helper.controllerHelper,
    queryResponseHandler    = controllerHelper.queryResponseHandler,
    debug                   = require('debug')('__serviceName__/controller/service'),
    async                   = require('async');


/**
 * @name                - Create
 * @description         - Creates service data
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
     * @description         - Creates service data
     * @param callback      - Callback function (error)
     */
    function createData (callback) {
        debug('Create data init...');
        
        serviceDAL.create(body,function (err, data) { // Creating service data
            queryResponseHandler(err,data,res,function (err, data) {
                if(data){ // service data successfully created
                    res.status(201);
                    res.json(data);
                    callback(null);
                }else {
                    let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                    errMsg.detail = 'service data could not be found (Failed to create service data)';
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
    }else{
        let option = {
            page     : req.query.page  === undefined ? 1                             : Number(req.query.page),   // assigns default page value, if not specified.
            sort     : req.query.sort  === undefined ? {_id : -1}                    : req.query.sort,           // assigns default sort param value, if not specified.
            lean     : req.query.lean  === undefined ? false                         : req.query.lean,           // assigns default lean value, if not specified.
            limit    : req.query.limit === undefined ? config.COLLECTION_RETURN_SIZE : Number(req.query.limit),   // assigns default limit value (passed to the config), if not specified.
            select   : "name serviceId routes firstModified lastModified"
        };

        let query = controllerHelper.queryFilter(req,["name","serviceId","routes" , "_id", "__v"]);
        // get collection paginated invoked
        serviceDAL.getCollectionsPaginated(query,option,function (err,data) {
            queryResponseHandler(err,data,res,function (err, data) { // Possible errors are handled.
                if(data){ // Data found.
                    debug("Found data");

                    res.status(200);
                    res.json(data);
                }else if(!data){ // No data found.
                    debug(`Found no data`);

                    let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                    errMsg.detail = "No service data found."; // Adding detailed data.
                    res.status(404);
                    res.json(errMsg);
                }
            });
        });
    }


    
};

/**
 * @name                - Update Many
 * @description         - Updates all service data that matches query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.update          = function (req, res, next) {
    debug(`Update many init.`);

    let body = req.body,
        query = controllerHelper.queryFilter(req,["name","serviceId","routes", "_id", "__v"]);

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

        controllerHelper.pickUpdateData(["name","serviceId","routes"],req,function (err,validUpdateData) { // Picking up valid update data.
            if(operation !== undefined && target !== undefined){ // Operation method is an array.
                callback(null, null);
            }else{
                if(Object.keys(validUpdateData).length === 0){ // No valid update data found.
                    let errMsg = errorCodes.SEC.IMPROPER_DATA;
                    errMsg.detail = "Valid update data not found.";
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
                    serviceDAL.pullFromArray(query, target, body, function (err, data) {
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
                    serviceDAL.pushToArray(query, target, body, function (err, data) {
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
                serviceDAL.updateMany(query,validUpdateData,function (err,data) {   // handling update.
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
 * @description         - Removes all service data that matches query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.remove          = function (req, res, next) {
    debug('Remove many init.');

    let query = controllerHelper.queryFilter(req,["name","serviceId","routes", "_id", "__v"]);

    if(Object.keys(query).length === 0){
        let errMsg = errorCodes.SEC.NO_DATA_FOUND;
        errMsg.detail = "No query data found.";
        res.status(400);
        res.json(errMsg)
    }else{
        serviceDAL.removeMany(query,function (err,data) {   // handling update.
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
    let query = controllerHelper.queryFilter(req,["name", "serviceId", "_id", "__v"]);

    serviceDAL.count(query, function (err, count) {
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
 * @description         - Find service data by id visible only fields that are public.
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
function getPublic  (req, res, next) {
    debug('Find public init...');

    let
        serviceId   = req.query._id,
        query       = {_id: serviceId}; // query construction.

    serviceDAL.getPublic(query,function (err,data) { // retrieve service public data (with out the value)
        queryResponseHandler(err,data,res,function (err, data) { // Error handled.
            if(!data){ // No service value could be found
                res.status(404);
                res.json(errorCodes.SEC.NO_DATA_FOUND);
            }else if(data){ // Found service data
                res.status(200);
                res.send(data);
            }
        });
    });
}

/**
 * @name                - Find private
 * @description         - Find service data by id visible only fields that are private.
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
function getPrivate (req, res, next) {
    debug('Find private init...');

    let
        serviceId = req.query._id,
        query = {_id: serviceId}; // query construction.

    serviceDAL.getPrivate(query,function (err,data) { // retrieve service public data (with out the value)
        queryResponseHandler(err,data,res,function (err, data) { // Error handled.
            if(!data){ // No service value could be found
                res.status(404);
                res.json(errorCodes.SEC.NO_DATA_FOUND);
            }else if(data){ // Found service data
                res.status(200);
                res.send(data);
            }
        });
    });
}