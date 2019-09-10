/**
 * @author              __author__
 * @name                __serviceName__
 * @module              log.js
 * @description         Controller for log
 * @kind                Controller
 * @copyright           __copyright__
 */

let
    fs   = require('fs'),
    path = require('path');


/**
 * @name                - Status
 * @description         - Returns the status of this service.
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.status          = function (req, res, next) {
    res.status(200);
    res.json({
        memoryUsage : process.memoryUsage(),
        cpuUsage : process.cpuUsage(),
        upTime : process.uptime()
    });
};

/**
 * @name                - Get
 * @description         - Queries log by query
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.get = function (req, res, next) {
    let from = Number(req.query.from) || 30; // Should define stat query from x amount of days.
    let to = Number(req.query.to) || 0;

    const options = {
        from: req.query.from || new Date() - (24 * 60 * 60 * 1000 * from),
        until: req.query.until || new Date() - (24 * 60 * 60 * 1000 * to),
        limit: req.query.limit || 12,
        start: req.query.start || 0,
        order: req.query.order || 'desc'
    };

    logger.query(options, function (err, results) {
        if (err) {
            res.status(500);
            res.json(err);
        }else{
            res.status(200);
            res.json(results);
        }
    });

};

/**
 * @name                - Flush
 * @description         - Flushes all logs
 * @param req           - Request object
 * @param res           - Response object
 * @param next          - Next
 */
exports.flush = function (req, res, next) {
    const infoFilePath = path.resolve(__dirname, '..', 'logs', 'info.log');
    const warnFilePath = path.resolve(__dirname, '..', 'logs', 'warn.log');

    fs.truncate(infoFilePath, 0, function(){});
    fs.truncate(warnFilePath, 0, function(){});

    res.status(200);
    res.json({message : "Logs flushed"})

};