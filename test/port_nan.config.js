/**
 * @author              GenNode Authorization
 * @name                GenNode Authorization
 * @module              gennode.config.js
 * @description         GenNode configuration file
 * @kind                Configuration
 * @copyright           GenNode 2018
 */

module.exports = {
    "serviceName": "GeneratedTestServer",
    "serviceDescription": "Generated by genNode_authorization : 2019. Authorization service",
    "author": "GenNode Authorization",
    "copyright": "Copyright : 2019",
    "repoURL": "http://github.com",
    "licence": "MIT",
    "version": "0.0.1",
    "baseURL": "/auth",
    "environment": {
        "DEBUG": "*",
        "PORT": "NAN",
        "MONGODB_URL": "mongodb://localhost:27017/auth",
        "REVERSE_PROXY": "http://localhost",
        "COLLECTION_RETURN_SIZE": "12",
        "ELASTIC_SEARCH_URL": "http://localhost:9200",
        "TOKEN_EXPIRATION_TIME": "60d",
        "LOG_STASH_PORT": 5000,
        "SECRET": "changeMeNow"
    },
    "docker": true,
    "jenkins": true,
    "postman": true,
    "useProxy": false,
    "test": true,
    "documentation": true,
    "instance": 1,
    "readMe": true,
    "runServer": false,
    "commit": false,
    "commitMessage": "Initial commit by gennode auth",
    "proxy": false
};