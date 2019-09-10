/**
 * @author              __author__
 * @name                __serviceName__
 * @module              index.js
 * @description         Index for constants and errorCodes
 * @kind                Constants
 * @copyright           __copyright__
 */


let
    accessRoutes = require('./accessRoutes'),
    constant     = require('./constant'),
    errorCodes   = require('./errorCodes');

module.exports = {
    accessRoutes : accessRoutes,
    constant     : constant,
    errorCodes   : errorCodes
};
