/**
 * @author              __author__
 * @name                __serviceName__
 * @module              url_generator
 * @description         Url generator for __serviceName__
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
                update          : (query)=> `${serviceRoute}/?${query}`,
                remove          : (query)=> `${serviceRoute}/?${query}`
            },
            
    
            user : {
                create          : ()=> `${userRoute}`,
                findByIdPublic  : (id)=> `${userRoute}/?_id=${id}`,
                findByIdPrivate : (id)=> `${userRoute}/?_id=${id}&private=true`,
                findPaginated   : (query)=> `${userRoute}/?${query}`,
                update          : (query)=> `${userRoute}/?${query}`,
                remove          : (query)=> `${userRoute}/?${query}`
            },
            
    
            role : {
                create          : ()=> `${roleRoute}`,
                findByIdPublic  : (id)=> `${roleRoute}/?_id=${id}`,
                findByIdPrivate : (id)=> `${roleRoute}/?_id=${id}&private=true`,
                findPaginated   : (query)=> `${roleRoute}/?${query}`,
                update          : (query)=> `${roleRoute}/?${query}`,
                remove          : (query)=> `${roleRoute}/?${query}`
            },
            
    
            acm : {
                create          : (createBy="subject")=> `${acmRoute}?createBy=${createBy}`,
                findByIdPublic  : (id)=> `${acmRoute}/?_id=${id}`,
                findByIdPrivate : (id)=> `${acmRoute}/?_id=${id}&private=true`,
                findPaginated   : (query)=> `${acmRoute}/?${query}`,
                update          : (query)=> `${acmRoute}/?${query}`,
                remove          : (query)=> `${acmRoute}/?${query}`
            },

// End inserting rest end points for routes here
};