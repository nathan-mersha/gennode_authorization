/**
 * @author              __author__
 * @name                __serviceName__
 * @module              log.js
 * @description         Socket controller for log
 * @kind                Controller
 * @copyright           __copyright__
 */


/**
 * @name            - Stream Log
 * @description     - Streams log
 */
exports.streamLog = function streamLogs() {
    logger.stream({ start: -1 }).on('log', function(log) {
        socket.emit('logs', log);
    });
};

