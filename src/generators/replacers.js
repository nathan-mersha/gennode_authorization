/**
 * @author              Nathan Mersha
 * @name                Gennode Authorization
 * @module              replacer.js
 * @description         Generates replacer object for different file types.
 * @kind                Generator
 * @copyright           June 2019 gennode_authorization
 */

let
    mc          = require('../mergedConfig'),
    snakeCase   = require('snake-case');


/**
 * @name                - Global replace
 * @description         - Globally replaces values
 * @param toSnake       - If true service name will be refactored to snake_case
 * @returns {{from: [RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp], to: [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]}}
 */
exports.globalReplace = function packageJSON(toSnake){

    return {
        from : [
            /__serviceName__/g,
            /__serviceDescription__/g,
            /__author__/g,
            /__copyright__/g,
            /__repoURL__/g,
            /__licence__/g,
            /__version__/g,
            /__baseURL__/g,
            /__instance__/g,

            /__port__/g,
            /__mongodbURL__/g,
            /__mongodbURLTest__/g,
            /__reverseProxy__/g,
            /__collectionReturnSize__/g,
            /__elasticSearch__/g,
            /__logStashPort__/g,
            /__tokenExpiration__/g,
            /__secret__/g,
            /__saltLength__/g
        ],
        to: [
            toSnake ? snakeCase(mc.mergedConfig.serviceName) : mc.mergedConfig.serviceName,
            mc.mergedConfig.serviceDescription,
            mc.mergedConfig.author,
            mc.mergedConfig.copyright,
            mc.mergedConfig.repoURL,
            mc.mergedConfig.licence,
            mc.mergedConfig.version,
            mc.mergedConfig.baseURL,
            mc.mergedConfig.instance,

            mc.mergedConfig.environment.PORT,
            mc.mergedConfig.environment.MONGODB_URL,
            mc.mergedConfig.environment.MONGODB_URL_TEST,
            mc.mergedConfig.environment.REVERSE_PROXY,
            mc.mergedConfig.environment.COLLECTION_RETURN_SIZE,
            mc.mergedConfig.environment.ELASTIC_SEARCH_URL,
            mc.mergedConfig.environment.LOG_STASH_PORT,
            mc.mergedConfig.environment.TOKEN_EXPIRATION_TIME,
            mc.mergedConfig.environment.SECRET,
            mc.mergedConfig.environment.SALT_LENGTH
        ]
    };
};

/**
 * @name                            - Jenkins nginx
 * @param author                    - Author
 * @param serviceName               - Service name
 * @param configExport              - Configuration export
 */
exports.genNodeConfig        = function (author, serviceName, configExport) {
    return {
        from : [
            /__author__/g,
            /__serviceName__/g,
            /__configurationExport__/g
        ],
        to: [
            author,
            serviceName,
            configExport
        ]
    };
};


