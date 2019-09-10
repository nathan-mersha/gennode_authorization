/**
 * @author              __author__
 * @name                __serviceName__
 * @module              index.js
 * @description         Index file for socket controller.
 * @kind                Controller
 * @copyright           __copyright__
 */


let logs = require('./log');

// todo : define which socket emitters and listeners should be implemented.
module.exports = function () {
    logs.streamLog();
};