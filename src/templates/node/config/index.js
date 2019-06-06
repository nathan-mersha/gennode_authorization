/**
 * @author              __author__
 * @name                __serviceName__
 * @module              index.js
 * @description         Configuration file for __serviceName__ service.
 * @kind                Configuration
 * @copyright           __copyright__
 */


/**
 * @name            - Config files
 * @description     - Describe multiple configuration values.
 */
module.exports = {
    HTTP_PORT                       : process.env.HTTP_PORT,
    MONGODB_URL                     : process.env.MONGODB_URL,
    COLLECTION_RETURN_SIZE          : Number(process.env.COLLECTION_RETURN_SIZE),
    REVERSE_PROXY                   : process.env.REVERSE_PROXY,
    ELASTIC_SEARCH_URL              : process.env.ELASTIC_SEARCH_URL,
    LOG_STASH_PORT                  : process.env.LOG_STASH_PORT,

    TOKEN_EXPIRATION_TIME           : process.env.TOKEN_EXPIRATION_TIME,
    SECRET                          : process.env.SECRET
};
