/**
 * @author             Nathan Mersha
 * @name               gennodeAuthServer
 * @description        Route index for gennodeAuthServer
 * @kind               Route
 * @module             Route index
 * @copyright          Copyright : 2019
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
    app.use('/auth/token', token);
    app.use('/auth/service', service);
    app.use('/auth/user', user);
    app.use('/auth/role', role);
    app.use('/auth/acm', acm);
// End Routing definition here
};
