/**
 * @author              __author__
 * @name                __serviceName__
 * @description        Route index for __serviceName__
 * @kind               Route
 * @module             Route index
 * @copyright          __copyright__
 */

// Begin route var declaration here
let
    token   = require('./token'),
    service = require('./service'),
    user    = require('./user'),
    role    = require('./role'),
    acm     = require('./acm');
// End route var declaration here

/**
 * @description     - Defines the first routing mechanism
 * @param app       - The router object
 */
module.exports = function (app) {
// Begin routing definition here
    app.use('__baseURL__/token', token);
    app.use('__baseURL__/service', service);
    app.use('__baseURL__/user', user);
    app.use('__baseURL__/role', role);
    app.use('__baseURL__/acm', acm);
// End Routing definition here
};
