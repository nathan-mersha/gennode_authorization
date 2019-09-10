/**
 * @author              __author__
 * @name                __serviceName__
 * @module              schema.js
 * @description         Controller for schema
 * @kind                Controller
 * @copyright           __copyright__
 */

let
    schemaDAL               = require('../dal/schema'),
    acmDAL                  = require('../dal/acm'),
    roleDAL                 = require('../dal/role'),
    constants               = require('../lib/constant'),
    errorCodes              = constants.errorCodes,
    config                  = require('../config'),
    helper                  = require('../lib/helper/'),
    controllerHelper        = helper.controllerHelper,
    queryResponseHandler    = controllerHelper.queryResponseHandler,
    debug                   = require('debug')('__serviceName__/controller/schema'),
    util                    = require('util'),
    async                   = require('async');


/**
 * @name                - Find
 * @description         - Retrieves private, public and paginated data based on query construct
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.find            = function (req, res, next) {
    debug('Find init.');

    if(! util.isNullOrUndefined(req.query._id)) {
        if(util.isNullOrUndefined(req.query.private) === "true") {
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
            select   : "schemaName serviceName accessControl documentIds firstModified lastModified"
        };

        let query = controllerHelper.queryFilter(req,["schemaName","serviceName", "accessControl", "documentIds", "firstModified", "lastModified", "_id", "__v"]);
        // get collection paginated invoked
        schemaDAL.getCollectionsPaginated(query,option,function (err,data) {
            queryResponseHandler(err,data,res,function (err, data) { // Possible errors are handled.
                if(data){ // Data found.
                    debug("Found data");

                    res.status(200);
                    res.json(data);
                }else if(!data){ // No data found.
                    debug(`Found no data`);

                    let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                    errMsg.detail = "No schema data found."; // Adding detailed data.
                    res.status(404);
                    res.json(errMsg);
                }
            });
        });
    }

};

/**
 * @name                - Update Many
 * @description         - Updates all schema data that matches query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.update          = function (req, res, next) {
    debug(`Update many init.`);

    let body = req.body,
        query = controllerHelper.queryFilter(req,["schemaName", "serviceName", "_id"]); // data query

    let operation = req.query.operation, // Defines operation on the array, pull or push
        target = req.query.target; // Defines target operation ex (accessControl.read)


    async.waterfall([
        checkSchemaExistence,
        updateSchema
    ]);

    function checkSchemaExistence(callback) {
        schemaDAL.getPrivate(query, function (err, data) {
            if(!data){
                let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                errMsg.detail = "No schema data found.";
                res.status(400);
                res.json(errMsg);
            }else{
                callback(null);
            }
        })
    }

    function updateSchema() {
        if(operation !== undefined && target !== undefined){ // Operation method is an array.
            if(Array.isArray(body)){
                filterExistingRoles(body, function (filteredRoles) {
                    if(filteredRoles.length === 0){
                        let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                        errMsg.detail = `No existing roles found from body : ${JSON.stringify(body)}`;
                        res.status(400);
                        res.json(errMsg);
                    }else{
                        if(operation === "pull"){
                            schemaDAL.pullFromArray(query, target, body, function (err, data) {
                                if(!err){
                                    updateACM(operation, target, body, data.documentIds, function () {
                                        res.status(200);
                                        res.json(data);
                                    });
                                }else{
                                    let errMsg = err.includes("Target array") ? errorCodes.SEC.NO_DATA_FOUND : errorCodes.SEC.SERVER_SIDE_ERROR;
                                    errMsg.detail = err;
                                    res.status(err.includes("Target array") ? 400 : 500);
                                    res.json(errMsg);
                                }
                            });
                        }else if(operation === "push"){

                            schemaDAL.pushToArray(query, target, body, function (err, data) {
                                if(!err){
                                    updateACM(operation, target, body, data.documentIds, function () {
                                        res.status(200);
                                        res.json(data);
                                    })
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
                    }
                });
            }else{
                let errMsg = errorCodes.SEC.VALIDATION_ERROR;
                errMsg.detail = `On array manipulation the body must be an array. ${typeof body} is not allowed.`;
                res.status(400);
                res.json(errMsg);
            }
        }
        else{
            let errMsg = errorCodes.SEC.VALIDATION_ERROR;
            errMsg.detail = `Operation must be either push or pull, target must be one of the accessControl[key], Provided values : target : ${target}, operation : ${operation}`;
            res.status(400);
            res.json(errMsg);
        }
    }



    /**
     * @name                    - Update acm
     * @description             - Updates acm data after schema pull push
     * @param operation         - Operation (pull, push)
     * @param targetArray       - Target array to perform operation (ex : accessControl.read)
     * @param elements          - Elements
     * @param documentIds       - Documents to pull out or push to
     * @param callback          - Callback function (error, updatedACMs)
     */
    function updateACM(operation, targetArray, elements, documentIds, callback) {
        // Schema :
        // method : pull
        // targetArray : accessControl.read
        // elements : [ Admin 1, Admin 2]

        // ACM : Query {subject : element}
        // method : pull
        // targetArray : accessControl.read
        // elements : documentIds

        let updatedACMs = [];
        let counter = 0;

        if(operation === "pull"){
            elements.forEach(function (element) {
                let query = {subject : element};
                acmDAL.pullFromArray(query, targetArray, documentIds, function (err, data) {
                    if(!err){updatedACMs.push(data);}
                    counter++;
                    if(counter === elements.length){callback(null, updatedACMs);}
                });
            });
        }else if(operation === "push"){
            elements.forEach(function (element) {
                let query = {subject : element};
                acmDAL.pushToArray(query, targetArray, documentIds, function (err, data) {
                    if(!err){updatedACMs.push(data);}
                    counter++;
                    if(counter === elements.length){callback(null, updatedACMs);}
                });
            });
        }else{throw new Error(`Unknown method : ${operation}`);}
    }
};

/**
 * @name                - Remove Many
 * @description         - Removes all schema data that matches query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.remove          = function (req, res, next) {
    debug('Remove many init.');

    let query = controllerHelper.queryFilter(req,["schemaName", "serviceName", "accessControl", "documentsIds", "_id", "__v"]);

    if(Object.keys(query).length === 0){
        let errMsg = errorCodes.SEC.NO_DATA_FOUND;
        errMsg.detail = "No query data found.";
        res.status(400);
        res.json(errMsg)
    }else{
        schemaDAL.removeMany(query,function (err,data) {   // handling update.
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
    let query = controllerHelper.queryFilter(req,["schemaName", "serviceName", "_id", "__v"]);

    schemaDAL.count(query, function (err, count) {
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
 * @description         - Find schema data by id visible only fields that are public.
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
function getPublic  (req, res, next) {
    debug('Find public init...');

    let
        schemaId   = req.query._id,
        query       = {_id: schemaId}; // query construction.

    schemaDAL.getPublic(query,function (err,data) { // retrieve schema public data (with out the value)
        queryResponseHandler(err,data,res,function (err, data) { // Error handled.
            if(!data){ // No schema value could be found
                res.status(404);
                res.json(errorCodes.SEC.NO_DATA_FOUND);
            }else if(data){ // Found schema data
                res.status(200);
                res.send(data);
            }
        });
    });
}

/**
 * @name                - Find private
 * @description         - Find schema data by id visible only fields that are private.
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
function getPrivate (req, res, next) {
    debug('Find private init...');

    let
        schemaId = req.query._id,
        query = {_id: schemaId}; // query construction.

    schemaDAL.getPrivate(query,function (err,data) { // retrieve schema public data (with out the value)
        queryResponseHandler(err,data,res,function (err, data) { // Error handled.
            if(!data){ // No schema value could be found
                res.status(404);
                res.json(errorCodes.SEC.NO_DATA_FOUND);
            }else if(data){ // Found schema data
                res.status(200);
                res.send(data);
            }
        });
    });
}

function filterExistingRoles(roles, callback) {
    let filteredRoles = [];
    let counter = 0;
    roles.forEach(function (role) {
        let query = {name : role};
        roleDAL.getPrivate(query, function (err, data) {
            if(data){
                filteredRoles.push(role);
            }
            counter++;
            if(counter === roles.length){callback(filteredRoles);}
        })
    })
}