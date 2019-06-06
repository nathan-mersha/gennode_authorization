/**
 * @author              __author__
 * @name                __serviceName__
 * @module              logger.js
 * @description         Logger module
 * @kind                Logger
 * @copyright           __copyright__
 */

let
    logStashClient  = require('logstash-client'),
    config          = require('../../../config');

/**
 * @name            - Log
 * @description     - Logs message by name, level and message
 * @param level     - Level of the message (debug,error)
 * @param message   - Message to log.
 */
exports.log = function log(level, message) {
    let logStash = new logStashClient({
        type: 'tcp',
        host: config.REVERSE_PROXY !== undefined ? config.REVERSE_PROXY.toString().replace("http://","").replace("https://","") : "",
        port: config.LOG_STASH_PORT
    });
    logStash.send({
        'message': message,
        'level': level
    });
};




