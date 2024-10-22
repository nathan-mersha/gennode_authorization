/**
 * @author              __author__
 * @name                __serviceName__
 * @module              index.js
 * @description         Index for constants and errorCodes
 * @kind                Constants
 * @copyright           __copyright__
 */

let
    debug   = require('debug')('initializer'),
    xtend   = require('xtend'),
    request = require('request'),
    async   = require('async');


/**
 * @name                        - Pinger
 * @description                 - Pings dependent services that this service depends on
 * @param servicesAddresses     - Dependent services.
 * @param providedOption        - Defines abort if fail option (true by default)
 * @param cb                    - Callback function (error,proceed)
 */
exports.pinger              = function pinger               (servicesAddresses,providedOption,cb)   {
    debug("Pinger init...");

    let defaultOption = {abortIfFail: true}; // Defines default option

    function checker(cb2) {
        debug("Checker init...");

        let option = xtend(defaultOption, providedOption); // Merge options with the provided one.

        /*
         Begin execution
         */
        async.waterfall([
            serviceChecker, // Checks for dependent services.
            infoLogger      // Logs information.
        ],function (err,proceed) {
            cb2(null,proceed);
        });

        /**
         * @name            - Service Checker
         * @description     - Check if services are up & respond with down services
         * @param callback  - Callback function (error,allServiceUp,downServices)
         */
        function serviceChecker (callback)                              {
            debug("Service checker init...");

            let allServicesUp = true;

            /**
             * @description     - Defines an array of down services
             * @type {Array}
             */
            let downServices  = [];

            servicesAddresses.forEach(function (serviceAddress) {
                request.get(serviceAddress,function (err,res,body) {
                    if (!res) {
                        allServicesUp = false;
                        downServices.push(serviceAddress);
                    }
                });
            });

            debug("Service Checker completed");
            callback(null,allServicesUp, downServices);
        }

        /**
         * @name                    - Info logger
         * @description             - Logs information about the condition of the services.
         * @param allServicesUp     - All services that are up and running
         * @param downServices      - All services that are down
         * @param callback          - Callback function (error,proceed)
         */
        function infoLogger     (allServicesUp,downServices,callback)   {
            debug("Info Logger init...");
            if(allServicesUp){ // all dependent services are up
                debug("All dependent services are up");
                servicesAddresses.forEach(function (serviceAddress) {
                    debug(`${serviceAddress} : is up`);
                });
                callback(null, true);

            }else if(!allServicesUp){ // all services are not up
                debug("Some or all dependent services are down");
                downServices.forEach(function (downService) {
                    debug(`${downService} : is down`);
                });

                if(option.abortIfFail){ // not initiating this service
                    debug("Quiting services");
                    debug("Some dependent services may be down");
                    callback(null, false);
                }else if(!(option.abortIfFail)) { // initiate services anyway
                    debug("Some dependent services are down, proceeding anyway");

                    callback(null, true);
                }
            }
        }
    }
    checker(function (err,proceed) {
        cb(err, proceed);
    });

};


