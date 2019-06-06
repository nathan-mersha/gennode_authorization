/**
 * @author              __author__
 * @name                __serviceName__
 * @module              controllerHelper.js
 * @description         Controller helpers.
 * @kind                Lib
 * @copyright           __copyright__
 */

let
    debug       = require('debug')('__serviceName__/lib/helper/others/controllerHelper'),
    util        = require('util'),
    constant    = require('../../constant'),
    errorCodes  = constant.errorCodes;

/**
 * @name                    - Query response handler
 * @description             - Handles possible error and empty data return upon query, create, remove or update.
 * @param err               - Error (Possible)
 * @param data              - Data  (Possible)
 * @param res               - Response object
 * @param callback          - Callback function (error,data)
 */
exports.queryResponseHandler    = function queryResponseHandler(err,data,res,callback)      {
    debug("Query response handler init...");

    if(err){ // Possible error while querying.
         debug(`Error : ${err.toString()}`);
         let errMsg = errorCodes.SEC.VALIDATION_ERROR;
         errMsg.hint = err;
         res.status(400);
         res.json(errMsg);
    }else { // No Error.
        callback(err,data);
    }
};

/**
 * @name                    - Data validator
 * @description             - Checks if the provided data attributes is present in the request body
 * @param paramVariables    - The param variables to check
 * @param req               - The request object to check from
 * @param res               - The response body to respond with any error messages if the provided request object fails to fulfill the param values.
 * @param callback          - Passes on with null as an error if every thing is up to order.
 */
exports.dataValidator           = function dataValidator(paramVariables,req,res,callback)   {
    debug(`Data validator init...`);

    paramVariables.forEach(function (variable) {
        req.checkBody(variable)
            .notEmpty().withMessage(`${variable} must not be empty`);
    });

    let validationError = req.validationErrors();

    if(validationError){ // caught validation error.
        debug(`Validation Error`);

        let errCode = errorCodes.SEC.VALIDATION_ERROR;
        errCode.detail = validationError;

        res.status(400);
        res.json(errCode);
    }else{ // validation has passed
        debug(`Validation Passed`);
        callback(null);
    }
};

/**
 * @name                    - Pick update data
 * @description             - Picks valid update data from the request body
 * @param pickFields        - List of fields that are valid to update.
 * @param req               - Request object
 * @param callback          - Callback function (error,validUpdateData)
 */
exports.pickUpdateData          = function pickUpdateData(pickFields,req,callback)          {
    debug("Pick update data init...");

    let updateData = {};
    pickFields.forEach(function (field,index) { // Looping through the valid update data fields
        if(! util.isNullOrUndefined(req.body[field])) { // check if the field exists on the query
            updateData[field] = req.body[field];
        }
        if(index+1 === pickFields.length) { // Looped through the final element.
            callback(null,updateData);
        }
    });
};

/**
 * @name                    - Query filter
 * @description             - Filters valid query from request
 * @param req               - Request object
 * @param lookingFor        - Query looking for
 * @return {{}}             - Valid queries.
 */
exports.queryFilter             = function queryFilter(req, lookingFor)                     {
    let query = {};
    lookingFor.forEach(function (element) {
        if(! util.isNullOrUndefined(req.query[element])){
            query[element] = req.query[element]
        }
    });
    return query;
};


/**
 * @name                    - Resolve obj target
 * @description             - Resolves string path to target
 * @param path              - String path
 * @param obj               - Target Object
 * @returns {*}             - object || undefined
 */
exports.resolveObjTarget        = function resolveObjTarget(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
};


/**
 * @name                    - Is Child contained in parent
 * @description             - Checks if the child elements are contained in the parent element for primitive and none primitive obj
 * @param parentArray       - Parent array to check inside
 * @param childArray        - Child array to check
 * @returns {boolean}       - true if child array is contained, false otherwise.
 */
exports.isChildContainedInParent = function isChildContainedInParent(parentArray, childArray) {
    Object.compare = function (obj1, obj2) {
        //Loop through properties in object 1
        for (var p in obj1) {
            //Check property exists on both objects
            if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

            switch (typeof (obj1[p])) {
                //Deep compare objects
                case 'object':
                    if (!Object.compare(obj1[p], obj2[p])) return false;
                    break;
                //Compare function code
                case 'function':
                    if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                    break;
                //Compare values
                default:
                    if (obj1[p] != obj2[p]) return false;
            }
        }

        //Check object 2 for any extra properties
        for (var p in obj2) {
            if (typeof (obj1[p]) == 'undefined') return false;
        }
        return true;
    };


    let elementsContained = 0;
    for (let j = 0; j < childArray.length; j++){
        for(let i = 0; i < parentArray.length; i++){
            if(Object.compare(parentArray[i], childArray[j])){
                elementsContained ++;
                break;
            }
        }
    }

    return elementsContained === childArray.length;
};

/**
 * @name                    - Remove child from parent
 * @description             - Removes child array from parent array for primitive and none-primitive objects.
 * @param parentArray       - Parent Array to remove from
 * @param childArray        - Child array to remove
 */
exports.removeChildFromParent = function removeChildFromParent(parentArray, childArray) {
    Object.compareV = function (obj1, obj2) {
        //Loop through properties in object 1
        for (var p in obj1) {
            //Check property exists on both objects
            if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

            switch (typeof (obj1[p])) {
                //Deep compare objects
                case 'object':
                    if (!Object.compareV(obj1[p], obj2[p])) return false;
                    break;
                //Compare function code
                case 'function':
                    if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                    break;
                //Compare values
                default:
                    if (obj1[p] != obj2[p]) return false;
            }
        }

        //Check object 2 for any extra properties

        return true;
    };

    for (let j = 0; j < childArray.length; j++){
        for(let i = 0; i < parentArray.length; i++){
            if(Object.compareV(parentArray[i], childArray[j])){
                delete parentArray[i]
            }
        }
    }
};