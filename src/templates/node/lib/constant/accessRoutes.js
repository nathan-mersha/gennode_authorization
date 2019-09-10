/**
 * @author              __author__
 * @name                __serviceName__
 * @module              accessRoutes.js
 * @description         Open and close routes
 * @kind                Routes
 * @copyright           __copyright__
 */


// NOTE : Don't end endpoint with "/"

const baseURL = "__baseURL__";

module.exports = {
    openRoute   : [
        {method : "POST", endpoint : `${baseURL}/admin/login`}
    ],
    superAdmin  : [
        {method : "POST", endpoint : `${baseURL}/admin/signUp`},
        {method : "PUT",  endpoint : `${baseURL}/admin`},
        {method : "GET",  endpoint : `${baseURL}/admin`},
        {method : "DELETE", endpoint : `${baseURL}/admin`}
    ]
};