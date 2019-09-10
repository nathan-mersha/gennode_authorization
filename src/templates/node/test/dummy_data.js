/**
 * @author              __author__
 * @name                __serviceName__
 * @module              dummy_data.js
 * @description         Dummy data for HeroAcademia Authorization service.
 * @kind                Test
 * @copyright           __copyright__
 */

let
    dummyJSON = require('dummy-json'),
    constants = require('../lib/constant').constant,
    mongoose  = require('mongoose');

const customMock = {
    objectId    : new mongoose.Types.ObjectId,
    buffer      : new mongoose.Types.Buffer,
    dates       : new Date(),
    method      : dummyJSON.utils.randomArrayItem(constants.METHODS),
    route       : dummyJSON.utils.randomArrayItem(["http://sampleroute.com/1","http://sampleroute.com/2","http://sampleroute.com/3","http://sampleroute.com/4","http://sampleroute.com/5","http://sampleroute.com/6"]),
    routeGroup  : dummyJSON.utils.randomArrayItem(["Company","Personnel","User","PayRol","Wallet","Account"]),
    roles       : dummyJSON.utils.randomArrayItem(["Admin 1", "Admin 2", "Admin 3", "Admin 4"]),
    schemaName  : dummyJSON.utils.randomArrayItem(["Blog", "Company", "User"]),
    serviceName : dummyJSON.utils.randomArrayItem(["Service A", "Service B", "Service C"]),
    userName    : dummyJSON.utils.randomArrayItem(["Abebe", "Bekila", "Chala", "Demeke"]),

};

/**
 * @name        Dummy data
 * @description     Dummy data for service __serviceName__
 * @type {{create: {success: null, validationError: null}, get: {success: null, wrongIdFormat: string}, update: {success: *, invalidData: {invalidKey: string}}, delete: {success: null, dataNotFound: null}}}
 */
module.exports = {
    // Dummy data for service test begins here
        
                /**
                 * @name            - token
                 * @description     - Dummy data for token
                 */
                token : {
                    create  : {
                        success         : JSON.parse(dummyJSON.parse(' { "userId" : "{{objectId}}"} ', {mockdata : customMock})),
                        validationError : { invalidKey : 'invalidValue' }
                    },
                    get     : {
                        success         : null,
                        wrongIdFormat   : 'wrongIdFormat'
                    },
                    update  : {  
                        success         : JSON.parse(dummyJSON.parse(' { "token" : "{{lorem 5}}" , "userId" : "{{objectId}}" , "expiration" : "{{dates}}" , "revoked" : {{boolean}} } ', {mockdata : customMock})),
                        invalidData     : { invalidKey : 'invalidValue'},
                    },
                    delete  : {
                        success         : null,
                        dataNotFound    : null
                    }
                },  
            
    
                /**
                 * @name            - service
                 * @description     - Dummy data for service
                 */
                service : {
                    create  : {
                        success         : JSON.parse(dummyJSON.parse(`{ "name" : "{{firstName}}" , "serviceId" : "{{objectId}}" , "routes" : [ 
{{#repeat 3}} 
        {
        "method" : "{{method}}",
        "route" : "{{route}}",
        "group" : "{{routeGroup}}",
        "name" : "{{routeGroup}}",
        "description" : "{{lorem 4}}"
        }
    {{/repeat}} 
    
    ] } `, {mockdata : customMock})),
                        unknownMethod         : JSON.parse(dummyJSON.parse(`{ "name" : "{{firstName}}" , "serviceId" : "{{objectId}}" , "routes" : [ 
{{#repeat 3}} 
        {
        "method" : "{{lorem 1}}",
        "route" : "{{route}}",
        "group" : "{{routeGroup}}",
        "name" : "{{routeGroup}}",
        "description" : "{{lorem 4}}"
        }
    {{/repeat}} 
    
    ] } `, {mockdata : customMock})),
                        missingFields         : JSON.parse(dummyJSON.parse(`{ "name" : "{{firstName}}" , "serviceId" : "{{objectId}}" , "routes" : [ 
{{#repeat 3}} 
        {
        "group" : "{{routeGroup}}",
        "name" : "{{routeGroup}}",
        "description" : "{{lorem 4}}"
        }
    {{/repeat}} 
    
    ] } `, {mockdata : customMock})),
                        invalidMethod         : JSON.parse(dummyJSON.parse(`{ "name" : "{{firstName}}" , "serviceId" : "{{objectId}}" , "routes" : [ 
{{#repeat 3}} 
        {
        "method" : "{{lorem 1}}",
        "route" : "{{route}}",
        "group" : "{{routeGroup}}",
        "name" : "{{routeGroup}}",
        "description" : "{{lorem 4}}"
        }
    {{/repeat}} 
    
    ] } `, {mockdata : customMock})),
                        validationError : { invalidKey : 'invalidValue' }
                    },
                    get     : {
                        success         : null,
                        wrongIdFormat   : 'wrongIdFormat'
                    },
                    update  : {  
                        success         : JSON.parse(dummyJSON.parse(`{ "name" : "{{firstName}}" , "serviceId" : "{{objectId}}" , "routes" : [ 
{{#repeat 3}} 
        {
        "method" : "{{method}}",
        "route" : "{{route}}",
        "group" : "{{routeGroup}}",
        "name" : "{{routeGroup}}",
        "description" : "{{lorem 4}}"
        }
    {{/repeat}} 
    
    ] } `, {mockdata : customMock})),
                        invalidData     : { invalidKey : 'invalidValue'},
                    },
                    delete  : {
                        success         : null,
                        dataNotFound    : null
                    }
                },  
            
    
                /**
                 * @name            - user
                 * @description     - Dummy data for user
                 */
                user : {
                    create  : {
                        success         : JSON.parse(dummyJSON.parse(' { "userId" : "{{objectId}}"} ', {mockdata : customMock})),
                        validationError : { invalidKey : 'invalidValue' }
                    },
                    get     : {
                        success         : null,
                        wrongIdFormat   : 'wrongIdFormat'
                    },
                    update  : {  
                        success         : JSON.parse(dummyJSON.parse(' { "userId" : "{{objectId}}"} ', {mockdata : customMock})),
                        invalidData     : { invalidKey : 'invalidValue'},
                    },
                    delete  : {
                        success         : null,
                        dataNotFound    : null
                    }
                },  
            
    
                /**
                 * @name            - role
                 * @description     - Dummy data for role
                 */
                role : {
                    create  : {
                        success         : JSON.parse(dummyJSON.parse(' { "name" : "{{roles}}" , "description" : "{{lorem 2}}" , "members" : [ {{#repeat 4}} "{{objectId}}" {{/repeat}} ] , "accessRoutes" : [ {{#repeat 4}} { "route" : "{{lorem 2}}", "method" : "{{method}}" } {{/repeat}} ] } ', {mockdata : customMock})),
                        missingRequiredFields   : JSON.parse(dummyJSON.parse(' { "description" : "{{lorem 2}}" , "members" : [ {{#repeat 4}} "{{objectId}}" {{/repeat}} ] , "accessRoutes" : [ {{#repeat 4}} { "route" : "{{lorem 2}}", "method" : "{{method}}" } {{/repeat}} ] } ', {mockdata : customMock})),
                        invalidMethod   : JSON.parse(dummyJSON.parse(' { "name" : "{{firstName}}" , "description" : "{{lorem 2}}" , "members" : [ {{#repeat 4}} "{{objectId}}" {{/repeat}} ] , "accessRoutes" : [ {{#repeat 4}} { "route" : "{{lorem 2}}", "method" : "{{lorem 2}}" } {{/repeat}} ] } ', {mockdata : customMock})),
                        validationError : { invalidKey : 'invalidValue' }
                    },
                    get     : {
                        success         : null,
                        wrongIdFormat   : 'wrongIdFormat'
                    },
                    update  : {  
                        success         : JSON.parse(dummyJSON.parse(' { "name" : "{{firstName}}" , "description" : "{{lorem 2}}" , "members" : [ {{#repeat 4}} "{{objectId}}" {{/repeat}} ] }  ', {mockdata : customMock})),
                        invalidData     : { invalidKey : 'invalidValue'},
                    },
                    delete  : {
                        success         : null,
                        dataNotFound    : null
                    }
                },  
            
    
                /**
                 * @name            - acm
                 * @description     - Dummy data for acm
                 */
                acm : {
                    create  : {
                        success         : JSON.parse(dummyJSON.parse(`{ 
    "subject" : "{{objectId}}" , 
    "accessControl" : {
        "read" :  [{{#repeat 4}} "{{objectId}}" {{/repeat}}],
        "update" :  [{{#repeat 4}} "{{objectId}}" {{/repeat}}],
        "delete" :  [{{#repeat 4}} "{{objectId}}" {{/repeat}}]
     
    }
    
    } `, {mockdata : customMock})),

                        successByObject         : JSON.parse(dummyJSON.parse(`{ 
    "object" : "{{objectId}}" , 
    "schemaName" : "{{schemaName}}",
    "serviceName" : "{{serviceName}}",
    "accessControl" : {
        "read" :  [{{#repeat 1}} "{{roles}}" {{/repeat}}],
        "update" :  [{{#repeat 2}} "{{roles}}" {{/repeat}}],
        "delete" :  [{{#repeat 3}} "{{roles}}" {{/repeat}}]
     
    }
    
    } `, {mockdata : customMock})),

                        missingFields         : JSON.parse(dummyJSON.parse(`{ 
    "accessControl" : {
        "read" :  [{{#repeat 4}} "{{objectId}}" {{/repeat}}],
        "update" :  [{{#repeat 4}} "{{objectId}}" {{/repeat}}],
        "delete" :  [{{#repeat 4}} "{{objectId}}" {{/repeat}}]
     
    }
    
    } `, {mockdata : customMock})),
                        validationError : { invalidKey : 'invalidValue' }
                    },
                    get     : {
                        success         : null,
                        wrongIdFormat   : 'wrongIdFormat'
                    },
                    update  : {  
                        success         : JSON.parse(dummyJSON.parse(`{ "subject" : "{{lorem 1}}" }  `, {mockdata : customMock})),
                        invalidData     : { invalidKey : 'invalidValue'},
                    },
                    delete  : {
                        success         : null,
                        dataNotFound    : null
                    }
                },


                admin : {
                    signup : {
                        success         : JSON.parse(dummyJSON.parse(' { "userName" : "{{userName}}" , "password" : "{{lorem 3}}"  } ', {mockdata : customMock})),
                        wrongCredential : {userName : "wrongUserName", password : "wrongPassword"},
                        validationError : JSON.parse(dummyJSON.parse(' { "userName" : "{{userName}}"  } ', {mockdata : customMock}))
                    },
                    get : {
                        success : null,
                        wrongIdFormat : "wrongIdFormat"
                    },
                    update : {
                        success : {role : "SuperAdmin"},
                        invalidData : {invalid : "invalid"}
                    }
                },

                schema : {
                    update : {
                        success : ["Admin 3"],
                        noneExistentRole : ["None Existent role"],
                        invalidData : {invalid : "invalid"},
                    }
                }
            
// Dummy data for service test ends here
};