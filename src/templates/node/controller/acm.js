/**
 * @author              __author__
 * @name                __serviceName__
 * @module              acm.js
 * @description         Controller for acm
 * @kind                Controller
 * @copyright           __copyright__
 */

let
    acmDAL                  = require('../dal/acm'),
    schemaDAL               = require('../dal/schema'),
    constants               = require('../lib/constant'),
    errorCodes              = constants.errorCodes,
    config                  = require('../config'),
    helper                  = require('../lib/helper/'),
    controllerHelper        = helper.controllerHelper,
    queryResponseHandler    = controllerHelper.queryResponseHandler,
    debug                   = require('debug')('__serviceName__/controller/acm'),
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

    let body     = req.body,
        createBy = req.query.createBy;

    if(createBy === "object"){ // Create acm by object
        createByObject();
    }else{ // Create acm by subject
        createBySubject();
    }

    /**
     * @name            - Create by object
     * @description     - Creates acm by object
     */
    function createByObject() {
        async.waterfall([
            validateData,
            createSchema,
            parseToSubjectModel,
            createData
        ],function () {
            debug("Create acm by object completed.");
        });

        /**
         * @name                - Validate data
         * @description         - Validates data
         * @param callback      - Callback function (error)
         */
        function validateData(callback) {
            debug("Validate data init...");
            controllerHelper.dataValidator(["object", "schemaName", "serviceName", "accessControl"],req,res,callback);
        }

        /**
         * @name                - Create Schema
         * @description         - Creates schema data from acm object creator.
         * @param callback      - Callback function (error)
         */
        function createSchema(callback) {
            let schemaQuery = {schemaName : body.schemaName};

            schemaDAL.getPrivate(schemaQuery, function (err, data) {
                if(err) {
                    let errMsg = errorCodes.SEC.SERVER_SIDE_ERROR;
                    errMsg.detail = err;
                    res.status(500);
                    res.json(errMsg);
                }else if(data){
                    // Already schema by name already exists.
                    let elements = [body.object],
                        targetedArray = "documentIds";
                    schemaDAL.pushToArray(schemaQuery, targetedArray, elements,function (err,data) {
                        if(!err){
                            callback(null);
                        }else {
                            let errMsg = errorCodes.SEC.SERVER_SIDE_ERROR;
                            errMsg.detail = err;
                            res.status(500);
                            res.json(errMsg);
                        }
                    });
                }else if(!data){ // No schema data found, create it.
                    let schemaData = {
                        schemaName : body.schemaName,
                        serviceName : body.serviceName,
                        accessControl : body.accessControl,
                        documentIds : [body.object] // Inserted the first document id in the collection.
                    };

                    schemaDAL.create(schemaData, function (err, data) {
                        if(!err){
                            callback(null);
                        }else {
                            let errMsg = errorCodes.SEC.SERVER_SIDE_ERROR;
                            errMsg.detail = err;
                            res.status(500);
                            res.json(errMsg);
                        }
                    });
                }
            });
        }

        /**
         * @name                - Parse to subject model
         * @description         - Parses object acm model to subject model
         * @param callback      - Callback function (error, subjectACM)
         */
        function parseToSubjectModel(callback) {
            debug("Parse to subject model init...");
            objectToSubjectACM(body, callback);
        }

        /**
         * @name                - Create Data
         * @description         - Crates a subject acm model
         * @param subjectACMs   - Subject ACM
         * @param callback      - Callback function (error)
         */
        function createData(subjectACMs, callback) {
            debug("Create data init...");

            let counter = 0;
            let createdACMObjectData = [];

            subjectACMs.forEach(function (subjectACM) {
                createACMData(subjectACM, function(err, createdACMData) {
                    counter++;
                    createdACMObjectData.push(createdACMData);
                    if(counter === subjectACMs.length){
                        res.status(201);
                        res.json({acmSubjects : createdACMObjectData});
                        callback(null);
                    }
                });
            });
        }
    }

    /**
     * @name            - Create by subject
     * @description     - Creates acm data by subject
     */
    function createBySubject(){
        async.waterfall([
            validateData,
            createACM
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
            controllerHelper.dataValidator(["subject"],req,res,callback);
        }

        /**
         * @name                - Creates acm
         * @description         - Creates an acm data
         * @param callback      - Callback function (error)
         */
        function createACM(callback) {
            createACMData(body,function (err, data) {
                if(err){
                    let errMsg = errorCodes.SEC.SERVER_SIDE_ERROR;
                    errMsg.detail = err;
                    res.status(500);
                    res.json(errMsg);
                }else if(!data){
                    let errMsg = errorCodes.SEC.NO_DATA_FOUND;
                    errMsg.detail = "Could not create acm data.";
                    res.status(400);
                    res.json(errMsg);
                }else if(data){
                    res.status(201);
                    res.json(data);
                    callback(null);
                }
            });
        }
    }

    /**
     * @name            - Create acm data
     * @description     - Verifies acm data existence if so, updates the old acm data by the provided keys, else creates a new one
     * @param cb        - Callback function (error, createdACMData)
     */
    function createACMData(acmInput, cb) {

        async.waterfall([
            verifyACMExistence,
            createData
        ],function () {
            debug("Crating acm data from object to subject view completed");
        });

        /**
         * @name                - Verify acm existence
         * @description         - Checks if acm data by subject already exists
         * @param callback      - Callback function (error, acmData)
         */
        function verifyACMExistence(callback) {
            debug('Verify acm existence init.');

            let query = {subject : acmInput.subject};
            acmDAL.getPrivate(query, function (err, data) {
                if(!err){
                    callback(null, data);
                }else{
                    cb(err, null); // some error occurred, created no acm data
                }
            });
        }

        /**
         * @name                - Create data
         * @description         - Creates acm data
         * @param acmData       - Acm data
         * @param callback      - Callback function (error)
         */
        function createData (acmData, callback) {
            debug('Create data init...');

            if(acmData){ // Acm data already exists, so update the access
                // Update the acm data since it already exists
                if(!acmInput.accessControl) {callback(null);}
                else{
                    let accessControlKeys = Object.keys(acmInput.accessControl);
                    let counter = 0;
                    accessControlKeys.forEach(function (accessControlKey) {
                        acmDAL.pushToArray({_id : acmData._id},`accessControl.${accessControlKey}`, acmInput.accessControl[accessControlKey], function (err, data) {
                            counter++;
                            if(counter === accessControlKeys.length){
                                cb(null, data);
                            }
                        });
                    });
                }

            }else{
                acmDAL.create(acmInput,function (err, data) { // Creating acm data
                    queryResponseHandler(err,data,res,function (err, data) {
                        if(err){ // acm data successfully created
                            cb(err, null);
                        }else if(data){
                            cb(null, data);
                        }
                    });
                });
            }
        }
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
    }else if(req.query.cursor === "true"){
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
                    if(data.nModified > 0){ // Some files have been modified
                        queryResponseHandler(err,data,res,function (err, data) {    // Possible errors are handled.
                            if(!err){
                                res.status(200);
                                res.send(data);
                                callback(null);
                            }
                        });
                    }else if(data.nModified === 0 && req.query.createOnNoModified === "true"){ // No file has been modified, so create a new one.
                        acmDAL.create(validUpdateData, function (err, data) {
                            if(!err){
                                res.status(201);
                                res.json(data);
                            }
                        });
                    }else{ // No modified and no create on no modified request
                        res.status(200);
                        res.json(data);
                    }

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
 * @name                - Count
 * @description         - Counts by query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.count           = function (req, res, next) {
    let query = controllerHelper.queryFilter(req,["subject","accessControl" , "_id", "__v"]);

    acmDAL.count(query, function (err, count) {
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
 * @name                - Object to subject acm
 * @description         - Parses Object acm model to subject acm
 * @param objectAcm     - Object acm
 * @param cb            - Callback function (error, subjectACM)
 */
function objectToSubjectACM(objectAcm, cb) {

    /**
     * @name                - Return acm subject frame
     * @description         - Creates an empty subject based acm model to be populated my acm on methods.
     * @param objectAcm     - Object based acm data
     * @returns {Array}     - Subject based acm arrays.
     */
    function returnACMSubjectFrame(objectAcm) {

        let accessControlKeys = Object.keys(objectAcm.accessControl);
        let parsedACMs = [];
        let emptyAccessControlMethods = ()=>{
            let copiedAccessControl = Object.assign({}, objectAcm.accessControl);
            Object.keys(copiedAccessControl).forEach(function (copiedAcmKey) {
                copiedAccessControl[copiedAcmKey] = [];
            });
            return copiedAccessControl;
        };
        accessControlKeys.forEach(function (accessControlKey) {

            let method = objectAcm.accessControl[accessControlKey];
            method.forEach(function (subject) {
                let acmSubjectExists = false;
                parsedACMs.forEach(function (parsedACM) {
                    if(parsedACM.subject === subject){
                        acmSubjectExists = true;
                    }
                });

                let parsedACM = {
                    subject : null,
                    accessControl : emptyAccessControlMethods()
                };
                parsedACM.subject = subject;
                if(!acmSubjectExists){ // There is no entry in the acm
                    parsedACMs.push(parsedACM);
                }
            });

        });
        return parsedACMs;
    }

    /**
     * @name                    - Insert acm object data
     * @description             - Populates object data on a acm subject frame
     * @param objectAcm         - Object based acm
     * @param parsedACMs        - Subject based empty acm data
     * @param callback          - Callback function (error, constructedSubjectBasedACMs)
     */
    function insertACMObjectData(objectAcm, parsedACMs, callback) {
        let setCounter = 0;
        parsedACMs.forEach(function (parsedAcm) {
            let accessControlKeys = Object.keys(objectAcm.accessControl);
            let counter = 0;
            accessControlKeys.forEach(function (accessControlKey) {
                let method = objectAcm.accessControl[accessControlKey];
                if(method.includes(parsedAcm.subject)){
                    let subjectAccessControlMethod = parsedAcm.accessControl[accessControlKey];
                    subjectAccessControlMethod.push(objectAcm.object);
                }
                counter++;
                if(counter === accessControlKeys.length){
                    setCounter++;
                    if(setCounter === parsedACMs.length){callback(null, parsedACMs);}
                }
            });
        });

    }

    let acmFrame = returnACMSubjectFrame(objectAcm);
    insertACMObjectData(objectAcm, acmFrame, cb);
}

/**
 *
 * @name                - Find public
 * @description         - Find acm data by id visible only fields that are public.
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
function getPublic(req, res, next) {
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
function getPrivate(req, res, next) {
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