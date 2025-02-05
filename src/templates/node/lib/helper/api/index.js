/**
 * @author              __author__
 * @name                __serviceName__
 * @module              index.js
 * @description         Defines methods for calling Api and abstracts request response objects.
 * @kind                Constants
 * @copyright           __copyright__
 */

let
    debug                   = require('debug')('__serviceName__/lib/helper/api/index'),
    _request                = require('request');

/**
 * @name                    - Authentication Option
 * @description             - Defines and constructs option for api request.
 * @param method            - Method of the request
 * @param body              - Body (if any)
 * @param token             - Token (if any provided)
 * @returns
 *          {{
 *              method: *,
 *              json: boolean,
 *              headers: {Authentication: string},
 *              body: *,
 *              agentOptions: {ca: (string|Buffer)}
 *          }}
 */
function authOption(method, body, token)            {
    debug("Constructing request option.");

    return { // generated and parsed option.
        method : method, // defines the method GET, POST, PUT, DELETE ...
        json : (body !== null), // defines true only when body data is available to attach
        headers      : {
            'Authentication' : `Bearer ${token}`
        },
        body : body,    // body of the request (if any)
        agentOptions : {
//            ca : cert   // adds certificate authority
        }
    };
}

/**
 * @name                    - Response handler
 * @description             - Handles and parses the response got from the request, also handles possible casting errors
 * @param err               - Error object from the response
 * @param res               - Response object
 * @param body              - Body of the response
 * @param callback          - Callback function (Error,parsedBody,Response)
 */
function responseHandler(err, res, body, callback)  {
    debug("Response handler init...");

    debug(`Type of object : ${body}`);
    if(typeof body === 'object' || typeof body === 'array'){
        callback(err,res,body);
    }else{
        try{
            callback(err,res,JSON.parse(body));
        }catch(errors){ // Possible json casting error caught.
            debug(`Message body is : ${body}`);
            debug(`Errors : ${errors}`)
        }
    }
}

/**
 * @name                    - Request
 * @description             - Requests based on the provided params
 * @param url               - Request URL
 * @param method            - Request Method (GET, POST, PUT, DELETE ...)
 * @param body              - Request Body
 * @param token             - Request token (if any)
 * @param callback          - Callback function (error, response, body)
 */
exports.request = function request(url, method, body, token, callback){
    debug("Request init.");

    let options = authOption(method, body, token);
    _request(url,options,function (err,res,body) {
        debug(`Response : ${JSON.stringify(body)}`);
        if(err){
            debug(`Error is : ${err}`);
        }
        responseHandler(err,res,body,callback);
    });

};
