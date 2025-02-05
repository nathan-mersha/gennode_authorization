/**
 * @author              __author__
 * @name                __serviceName__
 * @module              constant.js
 * @description         Constants for __serviceName__
 * @kind                Routes
 * @copyright           __copyright__
 */


/**
 * @name                    - Constants
 * @description             - Module exports multiple constants
 */
module.exports = {

    /**
     * @name                - User types
     * @description         - Defines user types of both human users and services.
     */
    USER_TYPES                      :   {
        SUPER_ADMIN                 : "superAdmin",
        ADMIN_LV2                   : "adminLV2",
        ADMIN_LV3                   : "adminLV3",
        AUTHORIZED_SERVICES         : "authorizedServices",
        AUTHENTICATION_SERVICE      : "authenticationService",
        LOGGED_IN_USER              : "loggedInUser",
        ANY                         : "any"
    },

    /**
     * @name                - Access level
     * @description         - Defines access level descriptions
     */
    ACCESS_LEVEL                    :   {

        /**
         * @name            - Access Level 1
         * @description     - Defines authorization for all.
         */
        LV1 : {
            superAdmin              : true,
            adminLV2                : true,
            adminLV3                : true,
            authorizedServices      : true,
            authenticationService   : true,
            loggedInUser            : true,
            any                     : true,
        },
        /**
         * @name            - Access Level 2
         * @description     - Defines authorization for all logged in users and beyond.
         */
        LV2 : {
            superAdmin              : true,
            adminLV2                : true,
            adminLV3                : true,
            authorizedServices      : true,
            authenticationService   : true,
            loggedInUser            : true,
            any                     : false,
        },
        /**
         * @name            - Access Level 3
         * @description     - Defines authorization for authorized services and all admin levels
         */
        LV3 : {
            superAdmin              : true,
            adminLV2                : true,
            adminLV3                : true,
            authorizedServices      : true,
            authenticationService   : false,
            loggedInUser            : false,
            any                     : false,
        },
        /**
         * @name            - Access Level 3b
         * @description     - Defines authorization for authentication services and all admin levels
         */
        LV3b : {
            superAdmin              : true,
            adminLV2                : false,
            adminLV3                : false,
            authorizedServices      : true,
            authenticationService   : true,
            loggedInUser            : false,
            any                     : false,
        },
        /**
         * @name            - Access Level 4
         * @description     - Defines authorization for Admin level 3 and above
         */
        LV4 : {
            superAdmin              : true,
            adminLV2                : true,
            adminLV3                : true,
            authorizedServices      : false,
            authenticationService   : false,
            loggedInUser            : false,
            any                     : false,
        },
        /**
         * @name            - Access Level 5
         * @description     - Defines authorization for Admin level 2 and above.
         */
        LV5 : {
            superAdmin              : true,
            adminLV2                : true,
            adminLV3                : false,
            authorizedServices      : false,
            authenticationService   : false,
            loggedInUser            : false,
            any                     : false,
        },
        /**
         * @name            - Access Level 6
         * @description     - Defines authorization for super admin only
         */
        LV6 : {
            superAdmin              : true,
            adminLV2                : false,
            adminLV3                : false,
            authorizedServices      : false,
            authenticationService   : false,
            loggedInUser            : false,
            any                     : false,
        }
    },

    /**
     * @name                - Running modes
     * @description         - Defines Running modes. (Default test mode)
     */
    RUNNING_MODES           :   {
        TEST_MODE           : 'test_mode',
        DEVELOPMENT_MODE    : 'development_mode',
        PRODUCTION_MODE     : 'production_mode',
    },

    /**
     * @name                - Service status
     * @description         - Generic service messages of over all service status.
     */
    SERVICE_STATUS                  : {
        SERVICE_INVOKED     : 'serviceInvoked',
        SERVICE_FAILED      : 'serviceFailed',
        SERVICE_SUCCEEDED   : 'serviceSucceeded',
        SERVICE_PENDING     : 'servicePending',
        SERVICE_DENIED      : 'serviceDenied'
    },

    /**
     * @name                - Log type
     * @description         - Message log type and levels.
     */
    LOG_TYPE                        : {
        SILLY               : "silly",
        DEBUG               : "debug",
        VERBOSE             : "verbose",
        INFO                : "info",
        WARN                : "warn",
        ERROR               : "error"
    },

    /**
     * @name                - Methods
     * @description         - Http methods
     */
    METHODS                         :  ["GET","POST","PUT","PATCH","DELETE","COPY","HEAD","OPTIONS","LINK","UNLINK","PURGE","LOCK","UNLOCK","PROPFIND","VIEW"],

    /**
     * @name                - Validation message
     * @description         - Validation message
     */
    VALIDATION_MESSAGE              : {
        PROCESSING_REQUEST   : "Processing Request",
        ACCESS_DENIED        : "Access Denied",
        ACCESS_GRANTED       : "Access Granted"
    }

};