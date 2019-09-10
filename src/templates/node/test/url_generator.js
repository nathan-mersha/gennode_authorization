/**
 * @author              __author__
 * @name                __serviceName__
 * @module              url_generator.js
 * @description         Url generator for __serviceName__ test
 * @kind                Test
 * @copyright           __copyright__
 */


// Begin inserting routes url here
const baseURL       = `__baseURL__`;
const tokenRoute    = `${baseURL}/token`;
const serviceRoute  = `${baseURL}/service`;
const userRoute     = `${baseURL}/user`;
const roleRoute     = `${baseURL}/role`;
const acmRoute      = `${baseURL}/acm`;
const adminRoute    = `${baseURL}/admin`;
const logRoute      = `${baseURL}/log`;
const schemaRoute   = `${baseURL}/schema`;

// End inserting routes url here

module.exports = {
    // Begin inserting rest end points for routes here
        
            token : {
                create          : ()=> `${tokenRoute}/create`,
                validate        : ()=> `${tokenRoute}/validate`
            },

            service : {
                create          : ()=> `${serviceRoute}`,
                findByIdPublic  : (id)=> `${serviceRoute}/?_id=${id}`,
                findByIdPrivate : (id)=> `${serviceRoute}/?_id=${id}&private=true`,
                findPaginated   : (query)=> `${serviceRoute}/?${query}`,
                count           : (query)=> `${serviceRoute}/count?${query}`,
                update          : (query)=> `${serviceRoute}/?${query}`,
                remove          : (query)=> `${serviceRoute}/?${query}`
            },

            user : {
                create          : ()=> `${userRoute}`,
                findByIdPublic  : (id)=> `${userRoute}/?_id=${id}`,
                findByIdPrivate : (id)=> `${userRoute}/?_id=${id}&private=true`,
                findPaginated   : (query)=> `${userRoute}/?${query}`,
                update          : (query)=> `${userRoute}/?${query}`,
                count           : (query)=> `${userRoute}/count?${query}`,
                remove          : (query)=> `${userRoute}/?${query}`
            },

            role : {
                create          : ()=> `${roleRoute}`,
                findByIdPublic  : (id)=> `${roleRoute}/?_id=${id}`,
                findByIdPrivate : (id)=> `${roleRoute}/?_id=${id}&private=true`,
                findPaginated   : (query)=> `${roleRoute}/?${query}`,
                update          : (query)=> `${roleRoute}/?${query}`,
                count           : (query)=> `${roleRoute}/count?${query}`,
                remove          : (query)=> `${roleRoute}/?${query}`
            },

            acm : {
                create          : (createBy="subject")=> `${acmRoute}?createBy=${createBy}`,
                findByIdPublic  : (id)=> `${acmRoute}/?_id=${id}`,
                findByIdPrivate : (id)=> `${acmRoute}/?_id=${id}&private=true`,
                findPaginated   : (query)=> `${acmRoute}/?${query}`,
                count           : (query)=> `${acmRoute}/count?${query}`,
                update          : (query)=> `${acmRoute}/?${query}`,
                remove          : (query)=> `${acmRoute}/?${query}`
            },

            admin : {
                signup          : ()=> `${adminRoute}/signup`,
                login           : ()=> `${adminRoute}/login`,
                findByIdPrivate : (id)=> `${adminRoute}/?_id=${id}&private=true`,
                findPaginated   : (query)=> `${adminRoute}/?${query}`,
                count           : (query)=> `${adminRoute}/count?${query}`,
                update          : (query)=> `${adminRoute}/?${query}`,
                remove          : (query)=> `${adminRoute}/?${query}`,
            },

            log : {
                status          : ()=> `${logRoute}/status`,
                get             : ()=> `${logRoute}/`,
                flush           : ()=> `${logRoute}`
            },

            schema : {
                count           : (query) => `${schemaRoute}/count?${query}`,
                findByQuery     : (query)=> `${schemaRoute}/?${query}`,
                findPaginated   : (query)=> `${schemaRoute}/?${query}`,
                update          : (query) => `${schemaRoute}/?${query}`,
                remove          : (query) => `${schemaRoute}/?${query}`,
            }

// End inserting rest end points for routes here
};