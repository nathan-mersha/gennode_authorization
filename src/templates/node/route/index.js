/**
 * @author              __author__
 * @name                __serviceName__
 * @module              index.js
 * @description         Defines index routes
 * @kind                Route
 * @copyright           __copyright__
 */

// Begin route var declaration here
let
    token   = require('./token'),
    service = require('./service'),
    user    = require('./user'),
    role    = require('./role'),
    acm     = require('./acm'),
    admin   = require('./admin'),
    schema  = require('./schema'),
    log     = require('./log');
// End route var declaration here

/**
 * @description     - Defines the first routing mechanism
 * @param app       - The router object
 */
module.exports = function (app) {
// Begin routing definition here
    app.use('/auth/token', token);
    app.use('/auth/service', service);
    app.use('/auth/user', user);
    app.use('/auth/role', role);
    app.use('/auth/acm', acm);
    app.use('/auth/admin', admin);
    app.use('/auth/schema', schema);
    app.use('/auth/log', log);
// End Routing definition here
};
