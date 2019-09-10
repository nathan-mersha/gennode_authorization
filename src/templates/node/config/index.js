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
    HTTP_PORT                       : process.env.HTTP_PORT || 3400,
    MONGODB_URL                     : process.env.MONGODB_URL,
    MONGODB_URL_TEST                : process.env.MONGODB_URL_TEST,
    COLLECTION_RETURN_SIZE          : Number(process.env.COLLECTION_RETURN_SIZE) || 12,
    REVERSE_PROXY                   : process.env.REVERSE_PROXY,
    ELASTIC_SEARCH_URL              : process.env.ELASTIC_SEARCH_URL,
    LOG_STASH_PORT                  : process.env.LOG_STASH_PORT,

    SALT_LENGTH                     : process.env.SALT_LENGTH || 8,
    TOKEN_EXPIRATION_TIME           : process.env.TOKEN_EXPIRATION_TIME,
    SECRET                          : process.env.SECRET
};
