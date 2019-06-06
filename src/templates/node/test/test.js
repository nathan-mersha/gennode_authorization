/**
 * @author              Nathan Mersha
 * @name                gennodeAuthServer
 * @description         Test for gennodeAuthServer service.
 * @kind                Test
 * @copyright           Copyright : 2019
 */

let
    request     = require('supertest'),
    mongoose    = require('mongoose'),
    objectId    = mongoose.Types.ObjectId,
    chai        = require('chai'),
    chaiExclude = require('chai-exclude'),
    expect      = chai.expect,
    async       = require('async'),
    helper      = require('../lib/helper').controllerHelper,

    app         = require('../app/app'),
    constants   = require('../lib/constant'),
    url         = require('./url_generator'),
    errorCodes  = constants.errorCodes,
    dummyData   = require('./dummy_data');

chai.use(chaiExclude); // Using chai plugin for object keys exclude comparison.

/**
 * @name                - Send request
 * @description         - Abstracts test requests.
 * @param urlPath       - Url path
 * @param method        - Method
 * @param body          - Body if any
 * @param expectCode    - Code to expect
 * @param callback      - Callback function (error,response)
 */
function sendRequest(urlPath,method,body,expectCode,callback) {
    request(app)[method](urlPath)
        .send(body)
        .expect(expectCode)
        .end(callback);
}

/**
 * @name                - Is error response
 * @description         - Checks if body is an error response.
 * @param body          - Body to check.
 */
function isErrorResponse(body){
    expect(body).to.be.an('object').that.includes.all.keys('errorCode','errorName','errorMessage','hint');
    expect(body.errorCode,body.errorName,body.errorMessage,body.hint).to.be.a('string');
}

/**
 * @name                - Is paginated response
 * @description         - Checks if body is paginated response
 * @param body          - Body to check.
 */
function isPaginatedResponse(body){
    expect(body).to.be.an('object').that.has.all.keys('docs','total','limit','page','pages');
    expect(body.docs).to.be.an('array');
    expect(body.total,body.limit,body.page,body.pages).to.be.a('number');
}

/**
 * @name                - Is update response
 * @description         - Evaluates if body is update response
 * @param body          - Body to evaluate
 */
function isUpdateResponse(body) {
    expect(body).to.be.an('object').that.has.all.keys('n', 'nModified', 'ok');
}

/**
 * @name                - Is update response
 * @description         - Evaluates if body is update response
 * @param body          - Body to evaluate
 */
function isRemoveResponse(body) {
    expect(body).to.be.an('object').that.has.all.keys('n', 'ok');
}

// Begin inserting test validation here
    
        describe("Token",function () {
        
            /**
             * @name            - is__modelName__Public
             * @param body      - Body to evaluate
             * @param private   - If true then body will be evaluate it's private fields as well
             * @description     - Validates if the provided data is __modelName__ public data
             */
             function isToken(body, private = false) {
                 if(private) {
// Begin body expected evaluation here for model : token (private)
    expect(body).to.be.an('object').that.has.all.keys('token');
    expect(body.token).to.be.a('String');
// End body expected evaluation here for model : token (private)
                 }else{
// Begin body expected evaluation here for model : token (public)
    expect(body).to.be.an('object').that.has.all.keys('token');
    expect(body.token).to.be.a('String');
// End body expected evaluation here for model : token (public)
                 }
        
                expect(new Date(body.lastModified),new Date(body.firstModified)).to.be.an.instanceOf(Date);
                expect(new objectId(body._id)).to.be.an.instanceOf(objectId);
            }
            
            describe("Create" ,function () {

                this.timeout(10000);
                it("Should fail to create token (Validation error)" ,function (done) {
                    sendRequest(url.token.create(),'post',dummyData.token.create.validationError,400,function (err,res) {
                        let body = res.body;
                        isErrorResponse(body);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully create token" ,function (done) {
                    sendRequest(url.token.create(),'post',dummyData.token.create.success,201,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isToken(body, true);
                        dummyData.token.get.success = body;
                        done();
                    });
                });
            });

            describe("Validate", function () {
                const accessGrantedMsg  = "Access Granted.",
                      accessDeniedMsg   = "Access Denied.";

                let
                    userId = "5cee7a0493f93a4e65b32632",
                    performPUTOnObjectByAny  = "5cee7a0493f44a4e65b32632",
                    performPUTOnObjectByUser = "5cee7a0493f44a4e65b35532",
                    noAccessToObject         = "5cee7a0456f44a4e65b35532",
                    token  = null;

                let route = {
                    accessedByAll  : "http://sample/accessed/all",
                    accessedByNone : "http://sample/accessed/none",
                    accessedByUser : "http://sample/accessed/user"
                };

                let validateToken = {
                    missingRequiredFields : {
                        route       : route.accessedByAll,
                        method      : "POST",
                        body        : {sampleKey : "sampleVal"},
                        objectId    : "5cefd27204d6a9685478ab72"
                    },

                    allowedToBeAccessedByAny : {
                        route       : route.accessedByAll,
                        method      : "POST",
                        body        : {sampleKey : "sampleVal"},
                        objectId    : "5cefd27204d6a9685478ab72",
                        token       : token
                    },

                    allowedToPerformPUTByAny : {
                        route       : route.accessedByAll,
                        method      : "PUT",
                        body        : {sampleKey : "sampleVal"},
                        objectId    : performPUTOnObjectByAny,
                        token       : token
                    },

                    allowedToPerformPUTByUser : {
                        route       : route.accessedByAll,
                        method      : "PUT",
                        body        : {sampleKey : "sampleVal"},
                        objectId    : performPUTOnObjectByUser,
                        token       : token
                    },

                    allowedToPerformPUTByUserOnUserRoute : {
                        route       : route.accessedByUser,
                        method      : "PUT",
                        body        : {sampleKey : "sampleVal"},
                        objectId    : performPUTOnObjectByUser,
                        token       : token
                    },

                    allowedToPerformMethodDeniedRoute : {
                        route       : route.accessedByNone,
                        method      : "PUT",
                        body        : {sampleKey : "sampleVal"},
                        objectId    : performPUTOnObjectByUser,
                        token       : token
                    },

                    deniedMethodOnObject : {
                        route       : route.accessedByAll,
                        method      : "PUT",
                        body        : {sampleKey : "sampleVal"},
                        objectId    : noAccessToObject,
                        token       : token
                    },

                    deniedToPerformDELETEByAny : {
                        route       : route.accessedByAll,
                        method      : "DELETE",
                        body        : {sampleKey : "sampleVal"},
                        objectId    : performPUTOnObjectByAny,
                        token       : token
                    },

                    allowedToBeAccessedByNone : {
                        route       : route.accessedByNone,
                        method      : "POST",
                        body        : {sampleKey : "sampleVal"},
                        objectId    : "5cefd27204d6a9685478ab72",
                        token       : token
                    },

                    toExpireAfterOneSec : {
                        route       : route.accessedByNone,
                        method      : "POST",
                        body        : {sampleKey : "sampleVal"},
                        objectId    : "5cefd27204d6a9685478ab72"
                    }
                };

                this.timeout(10000);
                before(function (done) {
                    console.log("Generating dummy data for tests.");
                    async.waterfall([
                        requestToken,
                        updateAnyRole, // route to be accessed by all
                        updateAnyACM,
                        createUserRole,
                        createUserACM
                    ],function () {
                        done();
                    });

                    /**
                     * @name            - Request token
                     * @description     - Requests a new token by userId.
                     * @param callback  - Callback function (error)
                     */
                    function requestToken(callback) {
                        sendRequest(url.token.create(),'post',{userId : userId},201,function (err,res) {
                            validateToken.allowedToBeAccessedByAny.token = res.body.token;
                            validateToken.allowedToBeAccessedByNone.token = res.body.token;
                            validateToken.allowedToPerformPUTByAny.token = res.body.token;
                            validateToken.deniedToPerformDELETEByAny.token = res.body.token;
                            validateToken.allowedToPerformPUTByUser.token = res.body.token;
                            validateToken.allowedToPerformPUTByUserOnUserRoute.token = res.body.token;
                            validateToken.allowedToPerformMethodDeniedRoute.token = res.body.token;
                            validateToken.deniedMethodOnObject.token = res.body.token;
                            callback(null);
                        });
                    }

                    /**
                     * @name            - Update any role
                     * @description     - Updates role type 'any' to have access for the routes accessed by all
                     * @param callback  - Callback function (error)
                     */
                    function updateAnyRole(callback) {
                        let updateData  = {accessRoutes : [
                                { route : route.accessedByAll, method : "POST"},
                                { route : route.accessedByAll, method : "PUT"},
                                { route : route.accessedByAll, method : "GET"}
                                ]};
                        sendRequest(url.role.update("name=any"),'put',updateData,200,function (err,res) {
                            let body = res.body;
                            if(body.ok){callback(null);}
                        });
                    }

                    /**
                     * @name            - Update any acm
                     * @description     - Updates any acm role
                     * @param callback  - Callback function (error)
                     */
                    function updateAnyACM(callback) {
                        let updateData = {
                            accessControl : {
                                read    : [performPUTOnObjectByAny],
                                update  : [performPUTOnObjectByAny]
                            }
                        };
                        sendRequest(url.acm.update("subject=any"),'put',updateData,200,function (err,res) {
                            let body = res.body;
                            if(body.ok){callback(null);}
                        });
                    }

                    /**
                     * @name            - Create user role
                     * @description     - Create sample role with test user
                     * @param callback  - Callback function (error)
                     */
                    function createUserRole(callback) {
                        let sampleRole = {
                            name            : "Sample Privilege",
                            description     : "Sample description for the privilege",
                            members         : [userId],
                            accessRoutes    : [
                                {route : route.accessedByUser, method : "PUT"}
                            ]
                        };

                        sendRequest(url.role.create(),'post',sampleRole,201,function (err,res) {
                            let body = res.body;
                            if(body._id){callback(null);}
                        });
                    }

                    /**
                     * @name            - Create user acm
                     * @description     - Creates custom user acm data.
                     * @param callback  - Callback function (error)
                     */
                    function createUserACM(callback) {
                        let userACMData = {
                            subject : userId,
                            accessControl : {
                                update : [performPUTOnObjectByUser]
                            }
                        };

                        sendRequest(url.acm.create(),'post',userACMData,200,function (err,res) {
                            let body = res.body;
                            if(body._id){callback(null);}
                        });
                    }

                });

                after(function () {
                    // Roll back
                    async.waterfall([
                        removedAnyRoleUpdate,
                        removeAnyACMUpdate,
                        removeUserRole,
                        removeUserACM
                    ],function () {
                        console.log("Rollback completed.")
                    });

                    function removedAnyRoleUpdate(cb) {
                        let updateData  = {accessRoutes : []};
                        sendRequest(url.role.update("name=any"),'put',updateData,200,function (err,res) {
                            let body = res.body;
                            if(body.ok){cb(null);}
                        });
                    }

                    function removeAnyACMUpdate(cb) {
                        let updateData = {
                            accessControl : {
                                read    : [],
                                update  : []
                            }
                        };
                        sendRequest(url.acm.update("subject=any"),'put',updateData,200,function (err,res) {
                            let body = res.body;
                            if(body.ok){cb(null);}
                        });
                    }

                    function removeUserRole(cb) {
                        let userRoleQuery = "name=Sample Privilege";
                        sendRequest(url.role.remove(userRoleQuery),'delete',null, 200, function (err, res) {

                            if(res.body.ok){cb(null);}
                        });
                    }

                    function removeUserACM(cb) {
                        let userACMQuery = `subject=${userId}`;
                        sendRequest(url.acm.remove(userACMQuery),'delete',null, 200, function (err, res) {
                            if(res.body.ok){cb(null);}
                        });
                    }

                });

                this.timeout(10000);
                it("Should fail to grant access (Body missing required fields)" ,function (done) {
                    sendRequest(url.token.validate(),'post',validateToken.missingRequiredFields,400,function (err,res) {
                        let body = res.body;
                        expect(body.errorCode).to.equal("SEC_007"); // Validation error
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully grant access (Route is allowed to be accessed by anyone)" ,function (done) {
                    sendRequest(url.token.validate(),'post',validateToken.allowedToBeAccessedByAny,200,function (err,res) {
                        let body = res.body;
                        expect(body.message).to.equal(accessGrantedMsg);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to grant access (Token has expired)" ,function (done) {
                    let tokenExpirationTimeCopy = process.env.TOKEN_EXPIRATION_TIME;
                    process.env.TOKEN_EXPIRATION_TIME = "1000"; // Change token expiration time to one second.

                    async.waterfall([
                        createAToken,
                        validateExpToken,
                        rollBackExpirationTime
                    ],function () {
                        done();
                    });

                    /**
                     * @name            - Create token
                     * @description     - Creates a new token for user by 1sec expiration time
                     * @param cb        - Callback function (error, response)
                     */
                    function createAToken(cb) {
                        sendRequest(url.token.create(),'post',{userId : userId},201,function (err,res) { // Create token
                            cb(null, res);
                        });
                    }

                    /**
                     * @name            - Validate Exp token
                     * @description     - Validation an expired token after 2sec (1 sec safe threshold)
                     * @param res       - Token data response object
                     * @param cb        - Callback function (error)
                     */
                    function validateExpToken(res, cb) {
                        validateToken.toExpireAfterOneSec.token = res.body.token;
                        setTimeout(function () {
                            sendRequest(url.token.validate(),'post',validateToken.toExpireAfterOneSec,401,function (err,res) {
                                let body = res.body;
                                expect(body.message).to.equal(accessDeniedMsg);
                                cb(null);
                            });
                        },2000);
                    }

                    /**
                     * @name            - Roll back expiration time
                     * @description     - Rolls back expiration time to whatever was set on the process env before the test.
                     * @param cb        - Callback function (error)
                     */
                    function rollBackExpirationTime(cb) {
                        process.env.TOKEN_EXPIRATION_TIME = tokenExpirationTimeCopy;
                        cb(null);
                    }

                });

                this.timeout(10000);
                it("Should successfully grant access (Group 'any' is allowed to perform operation on object)" ,function (done) {
                    sendRequest(url.token.validate(),'post',validateToken.allowedToPerformPUTByAny,200,function (err,res) {
                        let body = res.body;
                        expect(body.message).to.equal(accessGrantedMsg);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully deny access (Group 'any' is not allowed to perform operation on object)" ,function (done) {
                    sendRequest(url.token.validate(),'post',validateToken.deniedToPerformDELETEByAny,200,function (err,res) {
                        let body = res.body;
                        expect(body.message).to.equal(accessDeniedMsg);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully grant access (User is allowed to perform method on object, with all access of route)" ,function (done) {
                    sendRequest(url.token.validate(),'post',validateToken.allowedToPerformPUTByUser,200,function (err,res) {
                        let body = res.body;
                        expect(body.message).to.equal(accessGrantedMsg);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully grant access (User is allowed to perform method on object, with only user access route)" ,function (done) {
                    sendRequest(url.token.validate(),'post',validateToken.allowedToPerformPUTByUserOnUserRoute,200,function (err,res) {
                        let body = res.body;
                        expect(body.message).to.equal(accessGrantedMsg);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to grant access (User allowed to perform method on object and denied route.)" ,function (done) {
                    sendRequest(url.token.validate(),'post',validateToken.allowedToPerformMethodDeniedRoute,200,function (err,res) {
                        let body = res.body;
                        expect(body.message).to.equal(accessDeniedMsg);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to grant access (User or 'any' group is denied to perform method on object)" ,function (done) {
                    sendRequest(url.token.validate(),'post',validateToken.deniedMethodOnObject,200,function (err,res) {
                        let body = res.body;
                        expect(body.message).to.equal(accessDeniedMsg);
                        done();
                    });
                });
            })
        });
    
    
        describe("Service",function () {
        
            /**
             * @name            - is__modelName__Public
             * @param body      - Body to evaluate
             * @param private   - If true then body will be evaluate it's private fields as well
             * @description     - Validates if the provided data is __modelName__ public data
             */
             function isService(body, private = false) {
                 if(private) {
// Begin body expected evaluation here for model : service (private)
    expect(body).to.be.an('object').that.has.all.keys('__v', '_id', 'firstModified', 'lastModified', 'name', 'serviceId', 'routes');
    expect(body.name,body.serviceId).to.be.a('String');
    expect(body.routes).to.be.a('Array');
// End body expected evaluation here for model : service (private)
                 }else{
// Begin body expected evaluation here for model : service (public)
    expect(body).to.be.an('object').that.has.all.keys('__v', '_id', 'firstModified', 'lastModified', 'name', 'serviceId', 'routes');
    expect(body.name,body.serviceId).to.be.a('String');
    expect(body.routes).to.be.a('Array');
// End body expected evaluation here for model : service (public)
                 }
        
                expect(new Date(body.lastModified),new Date(body.firstModified)).to.be.an.instanceOf(Date);
                expect(new objectId(body._id)).to.be.an.instanceOf(objectId);
            }
            
            describe("Create" ,function () {
                
                this.timeout(10000);
                it("Should successfully create service" ,function (done) {
                    sendRequest(url.service.create(),'post',dummyData.service.create.success,201,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isService(body, true);
                        dummyData.service.get.success = body;
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to create service (Method and route fields missing)" ,function (done) {
                    sendRequest(url.service.create(),'post',dummyData.service.create.missingFields,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body, true);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to create service (Method is not http method)" ,function (done) {
                    sendRequest(url.service.create(),'post',dummyData.service.create.missingFields,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body, true);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });
               
            });
        
            describe("Find" ,function () {
            
                this.timeout(10000);
                it("Should successfully retrieve service data (public)" ,function (done) {
                    sendRequest(url.service.findByIdPublic(dummyData.service.get.success._id),'get',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        expect(body._id).to.equal(dummyData.service.get.success._id);
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should successfully retrieve service data (private)" ,function (done) {
                    sendRequest(url.service.findByIdPrivate(dummyData.service.get.success._id),'get',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        expect(body._id).to.equal(dummyData.service.get.success._id);
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should fail to retrieve service data ( Id wrong format )" ,function (done) {
                    sendRequest(url.service.findByIdPublic(dummyData.service.get.wrongIdFormat),'get',null,400,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });

            });
        
            describe("Find paginated" ,function () {
            
                this.timeout(10000);
                it("Should successfully retrieve service paginated data" ,function (done) {
                    let validQuery = '__validQuery__';
                    sendRequest(url.service.findPaginated(validQuery),'get',null,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isPaginatedResponse(body); 
                        done();
                    });
                });
            });
        
            describe("Update" ,function () {

                let serviceData     = null,
                    update      = {
                        success : {
                            data :
                                [{
                                    method        : "POST",
                                    route         : "http://test/sample",
                                    group         : "Company",
                                    name          : "Create company",
                                    description   : "Create company data."
                                },
                                {
                                    method        : "GET",
                                    route         : "http://test/sample",
                                    group         : "Company",
                                    name          : "Retrieves company",
                                    description   : "Retrieves company data."
                                }],
                            target : "routes"
                        },
                        invalid : {
                            data : "invalidData",
                        }
                    };


                before(function (done) {
                    sendRequest(url.service.create(),'post',dummyData.service.create.success,201,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isService(body, true);
                        serviceData = body;
                        done();
                    });
                });

                after(function (done) {
                    let query = `_id=${serviceData._id}`;
                    sendRequest(url.service.remove(query),'del',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRemoveResponse(body);
                        expect(body.n).to.be.at.least(1);
                        done();
                    });
                });
            
                this.timeout(10000);
                it("Should successfully update service data" ,function (done) {
                    
                    let query = `_id=${dummyData.service.get.success._id}`;
                    sendRequest(url.service.update(query),'put',dummyData.service.update.success,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isUpdateResponse(body); 
                        expect(body.nModified).to.be.at.least(1); 
                        done();
                    });
                });

                it("Should fail to update data. (Query not provided)" ,function (done) {
                    let query = ``;
                    sendRequest(url.service.update(query),'put',dummyData.service.update.success,400,function (err,res) {
                        let body = res.body;
                        isErrorResponse(body);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to update service data (Invalid update data)",function (done) {
                    let query = `_id=${dummyData.service.get.success._id}`;
                    sendRequest(url.service.update(query),'put',dummyData.service.update.invalidData,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.IMPROPER_DATA.errorCode);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully push items to target", function (done) {
                    let query = `_id=${serviceData._id}&target=${update.success.target}&operation=push`;
                    sendRequest(url.service.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isService(body);
                        expect(body.routes).excluding('_id').to.include(... update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to push items (Items already exist)", function (done) {
                    let query = `_id=${serviceData._id}&target=${update.success.target}&operation=push`;
                    sendRequest(url.service.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isService(body);
                        expect(body.routes).excluding('_id').to.include(...update.success.data);
                        let responseArray = body.routes;
                        helper.removeChildFromParent(responseArray, update.success.data);
                        expect(responseArray).to.not.include(...update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully pull items from target", function (done) {
                    let query = `_id=${serviceData._id}&target=${update.success.target}&operation=pull`;
                    sendRequest(url.service.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isService(body);
                        expect(body.routes).to.not.include(...update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to pull items (Items don't exist)", function (done) {
                    let query = `_id=${serviceData._id}&target=${update.success.target}&operation=pull`;
                    sendRequest(url.service.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isService(body);
                        expect(body.routes).to.not.include(...update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to push items (Target object not found)", function (done) {
                    let query = `_id=${serviceData._id}&target=notFound&operation=push`;
                    sendRequest(url.service.update(query),'put',update.success.data,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.NO_DATA_FOUND.errorCode);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to pull items (Target object not found)", function (done) {
                    let query = `_id=${serviceData._id}&target=notFound&operation=pull`;
                    sendRequest(url.service.update(query),'put',update.success.data,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to perform operation on target (Body is not an array)", function (done) {
                    let query = `_id=${serviceData._id}&target=${update.success.target}&operation=push`;
                    sendRequest(url.service.update(query),'put',update.invalid.data,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });
            });
        
            describe("Remove" ,function () {
            
                this.timeout(10000);
                it("Should successfully remove service data" ,function (done) {
                    let query = `_id=${dummyData.service.get.success._id}`;
                    sendRequest(url.service.remove(query),'del',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRemoveResponse(body); 
                        expect(body.n).to.be.at.least(1); 
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to remove service data. (Query not provided)" ,function (done) {
                    let query = ``;
                    sendRequest(url.service.remove(query),'del',null,400,function (err, res) {
                        let body = res.body;
                        isErrorResponse(body);
                        done();
                    });
                });

            });
        });
    
    
        describe("User",function () {
        
            /**
             * @name            - is__modelName__Public
             * @param body      - Body to evaluate
             * @param private   - If true then body will be evaluate it's private fields as well
             * @description     - Validates if the provided data is __modelName__ public data
             */
             function isUser(body, private = false) {
                 if(private) {
// Begin body expected evaluation here for model : user (private)
    expect(body).to.be.an('object').that.has.all.keys('__v', '_id', 'firstModified', 'lastModified', 'userId');
    expect(body.userId).to.be.a('String');
// End body expected evaluation here for model : user (private)
                 }else{
// Begin body expected evaluation here for model : user (public)
    expect(body).to.be.an('object').that.has.all.keys('__v', '_id', 'firstModified', 'lastModified', 'userId');
    expect(body.userId).to.be.a('String');
// End body expected evaluation here for model : user (public)
                 }
        
                expect(new Date(body.lastModified),new Date(body.firstModified)).to.be.an.instanceOf(Date);
                expect(new objectId(body._id)).to.be.an.instanceOf(objectId);
            }
            
            describe("Create" ,function () {
                
                this.timeout(10000);
                it("Should successfully create user" ,function (done) {
                    sendRequest(url.user.create(),'post',dummyData.user.create.success,201,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isUser(body, true);
                        dummyData.user.get.success = body;
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to create user (Required field missing)" ,function (done) {
                    sendRequest(url.user.create(),'post',dummyData.user.create.validationError,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });
               
            });
        
            describe("Find" ,function () {
            
                this.timeout(10000);
                it("Should successfully retrieve user data (public)" ,function (done) {
                    sendRequest(url.user.findByIdPublic(dummyData.user.get.success._id),'get',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        expect(body._id).to.equal(dummyData.user.get.success._id);
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should successfully retrieve user data (private)" ,function (done) {
                    sendRequest(url.user.findByIdPrivate(dummyData.user.get.success._id),'get',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        expect(body._id).to.equal(dummyData.user.get.success._id);
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should fail to retrieve user data ( Id wrong format )" ,function (done) {
                    sendRequest(url.user.findByIdPublic(dummyData.user.get.wrongIdFormat),'get',null,400,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });
            });
        
            describe("Find paginated" ,function () {
            
                this.timeout(10000);
                it("Should successfully retrieve user paginated data" ,function (done) {
                    let validQuery = '__validQuery__';
                    sendRequest(url.user.findPaginated(validQuery),'get',null,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isPaginatedResponse(body); 
                        done();
                    });
                });
            });
        
            describe("Update" ,function () {
            
                this.timeout(10000);
                it("Should successfully update user data" ,function (done) {
                    
                    let query = `_id=${dummyData.user.get.success._id}`;
                    sendRequest(url.user.update(query),'put',dummyData.user.update.success,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isUpdateResponse(body); 
                        expect(body.ok).to.be.at.least(1);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to update data. (Query not provided)" ,function (done) {
                    let query = ``;
                    sendRequest(url.user.update(query),'put',dummyData.user.update.success,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        done();
                    });
                });
        
                this.timeout(10000);
                it("Should fail to update user data (Invalid update data)",function (done) {
                    let query = `_id=${dummyData.user.get.success._id}`;
                    sendRequest(url.user.update(query),'put',dummyData.user.update.invalidData,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.IMPROPER_DATA.errorCode);
                        done();
                    });
                });
            });
        
            describe("Remove" ,function () {
            
                this.timeout(10000);
                it("Should successfully remove user data" ,function (done) {
                    let query = `_id=${dummyData.user.get.success._id}`;
                    sendRequest(url.user.remove(query),'del',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRemoveResponse(body); 
                        expect(body.n).to.be.at.least(1); 
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to remove user data. (Query not provided)" ,function (done) {
                    let query = ``;
                    sendRequest(url.user.remove(query),'del',null,400,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        done();
                    });
                });

            });
        });
    
    
        describe("Role",function () {
        
            /**
             * @name            - is__modelName__Public
             * @param body      - Body to evaluate
             * @param private   - If true then body will be evaluate it's private fields as well
             * @description     - Validates if the provided data is __modelName__ public data
             */
             function isRole(body, private = false) {
                 if(private) {
// Begin body expected evaluation here for model : role (private)
    expect(body).to.be.an('object').that.has.all.keys('__v', '_id', 'firstModified', 'lastModified', 'name', 'description', 'members', 'accessRoutes');
    expect(body.name).to.be.a('String');
    expect(body.members,body.accessRoutes).to.be.a('Array');
    expect(new Date(body.description)).to.be.an.instanceof(Date);
// End body expected evaluation here for model : role (private)
                 }else{
// Begin body expected evaluation here for model : role (public)
    expect(body).to.be.an('object').that.has.all.keys('__v', '_id', 'firstModified', 'lastModified', 'name', 'description', 'members', 'accessRoutes');
    expect(body.name).to.be.a('String');
    expect(body.members,body.accessRoutes).to.be.a('Array');
    expect(new Date(body.description)).to.be.an.instanceof(Date);
// End body expected evaluation here for model : role (public)
                 }
        
                expect(new Date(body.lastModified),new Date(body.firstModified)).to.be.an.instanceOf(Date);
                expect(new objectId(body._id)).to.be.an.instanceOf(objectId);
            }
            
            describe("Create" ,function () {
                
                this.timeout(10000);
                it("Should successfully create role" ,function (done) {
                    sendRequest(url.role.create(),'post',dummyData.role.create.success,201,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRole(body, true);
                        dummyData.role.get.success = body;
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to create role (Required field missing)" ,function (done) {
                    sendRequest(url.role.create(),'post',dummyData.role.create.missingRequiredFields,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to create route (Unknown Http method)" ,function (done) {
                    sendRequest(url.role.create(),'post',dummyData.role.create.invalidMethod,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body, true);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });
            });
        
            describe("Find" ,function () {
            
                this.timeout(10000);
                it("Should successfully retrieve role data (public)" ,function (done) {
                    sendRequest(url.role.findByIdPublic(dummyData.role.get.success._id),'get',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        expect(body._id).to.equal(dummyData.role.get.success._id);
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should successfully retrieve role data (private)" ,function (done) {
                    sendRequest(url.role.findByIdPrivate(dummyData.role.get.success._id),'get',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        expect(body._id).to.equal(dummyData.role.get.success._id);
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should fail to retrieve role data ( Id wrong format )" ,function (done) {
                    sendRequest(url.role.findByIdPublic(dummyData.role.get.wrongIdFormat),'get',null,400,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });
            });
        
            describe("Find paginated" ,function () {
            
                this.timeout(10000);
                it("Should successfully retrieve role paginated data" ,function (done) {
                    let validQuery = '__validQuery__';
                    sendRequest(url.role.findPaginated(validQuery),'get',null,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isPaginatedResponse(body); 
                        done();
                    });
                });
            });
        
            describe("Update" ,function () {
                let roleData     = null,
                    update      = {
                        success : {
                            data : [{route : "http://route/sample/1", method : "post"}, {route : "http://route/sample/2", method : "get"}],
                            target : "accessRoutes"
                        },
                        invalid : {
                            data : "invalidData",
                        }
                    };


                before(function (done) {
                    sendRequest(url.role.create(),'post',dummyData.role.create.success,201,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRole(body, true);
                        roleData = body;
                        done();
                    });
                });

                after(function (done) {
                    let query = `_id=${roleData._id}`;
                    sendRequest(url.role.remove(query),'del',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRemoveResponse(body);
                        expect(body.n).to.be.at.least(1);
                        done();
                    });
                });
            
                this.timeout(10000);
                it("Should successfully update role data" ,function (done) {
                    
                    let query = `_id=${dummyData.role.get.success._id}`;
                    sendRequest(url.role.update(query),'put',dummyData.role.update.success,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isUpdateResponse(body); 
                        expect(body.nModified).to.be.at.least(1); 
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to update role data (Query not provided)" ,function (done) {
                    let query = ``;
                    sendRequest(url.role.update(query),'put',dummyData.role.update.success,400,function (err,res) {
                        let body = res.body;
                        isErrorResponse(body);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to update role data (Invalid update data)",function (done) {
                    let query = `_id=${dummyData.role.get.success._id}`;
                    sendRequest(url.role.update(query),'put',dummyData.role.update.invalidData,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.IMPROPER_DATA.errorCode);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully push items to target", function (done) {
                    let query = `_id=${roleData._id}&target=${update.success.target}&operation=push`;
                    sendRequest(url.role.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRole(body);
                        (function () {
                            body.accessRoutes.forEach(function (accessRoute) {
                                delete accessRoute._id;
                            })
                        })();
                        expect(body.accessRoutes).to.include(...update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to push items (Items already exist)", function (done) {
                    let query = `_id=${roleData._id}&target=${update.success.target}&operation=push`;
                    sendRequest(url.role.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRole(body);
                        (function () {
                            body.accessRoutes.forEach(function (accessRoute) {
                                delete accessRoute._id;
                            })
                        })();
                        expect(body.accessRoutes).to.include(...update.success.data);
                        let responseArray = body.accessRoutes;
                        helper.removeChildFromParent(responseArray, update.success.data);
                        expect(responseArray).to.not.include(...update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully pull items from target", function (done) {
                    let query = `_id=${roleData._id}&target=${update.success.target}&operation=pull`;
                    sendRequest(url.role.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRole(body);
                        expect(body.accessRoutes).to.not.include(...update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to pull items (Items don't exist)", function (done) {
                    let query = `_id=${roleData._id}&target=${update.success.target}&operation=pull`;
                    sendRequest(url.role.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRole(body);
                        expect(body.accessRoutes).to.not.include(...update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to push items (Target object not found)", function (done) {
                    let query = `_id=${roleData._id}&target=notFound&operation=push`;
                    sendRequest(url.role.update(query),'put',update.success.data,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.NO_DATA_FOUND.errorCode);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to pull items (Target object not found)", function (done) {
                    let query = `_id=${roleData._id}&target=notFound&operation=pull`;
                    sendRequest(url.role.update(query),'put',update.success.data,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to perform operation on target (Body is not an array)", function (done) {
                    let query = `_id=${roleData._id}&target=${update.success.target}&operation=push`;
                    sendRequest(url.role.update(query),'put',update.invalid.data,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });

            });
        
            describe("Remove" ,function () {
            
                this.timeout(10000);
                it("Should successfully remove role data" ,function (done) {
                    let query = `_id=${dummyData.role.get.success._id}`;
                    sendRequest(url.role.remove(query),'del',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRemoveResponse(body); 
                        expect(body.n).to.be.at.least(1); 
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to remove role data (Query not provided)" ,function (done) {
                    let query = ``;
                    sendRequest(url.role.remove(query),'del',null,400,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        done();
                    });
                });


            });
        });
    
    
        describe("Acm",function () {
        
            /**
             * @name            - is__modelName__Public
             * @param body      - Body to evaluate
             * @param private   - If true then body will be evaluate it's private fields as well
             * @description     - Validates if the provided data is __modelName__ public data
             */
             function isAcm(body, private = false) {
                 if(private) {
// Begin body expected evaluation here for model : acm (private)
    expect(body).to.be.an('object').that.has.all.keys('__v', '_id', 'firstModified', 'lastModified', 'subject', 'accessControl');
    expect(new objectId(body.subject)).to.be.an.instanceof(objectId);
// End body expected evaluation here for model : acm (private)
                 }else{
// Begin body expected evaluation here for model : acm (public)
    expect(body).to.be.an('object').that.has.all.keys('__v', '_id', 'firstModified', 'lastModified', 'subject', 'accessControl');
    expect(new objectId(body.subject)).to.be.an.instanceof(objectId);
// End body expected evaluation here for model : acm (public)
                 }
        
                expect(new Date(body.lastModified),new Date(body.firstModified)).to.be.an.instanceOf(Date);
                expect(new objectId(body._id)).to.be.an.instanceOf(objectId);
            }
            
            describe("Create" ,function () {
                
                this.timeout(10000);
                it("Should successfully create acm" ,function (done) {
                    sendRequest(url.acm.create(),'post',dummyData.acm.create.success,201,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isAcm(body, true);
                        dummyData.acm.get.success = body;
                        done();
                    });
                });

                it("Should fail to create acm (Required field missing)",function (done) {
                    sendRequest(url.acm.create(),'post',dummyData.acm.create.missingFields,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });

                });
               
            });
        
            describe("Find" ,function () {
            
                this.timeout(10000);
                it("Should successfully retrieve acm data (public)" ,function (done) {
                    sendRequest(url.acm.findByIdPublic(dummyData.acm.get.success._id),'get',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        expect(body._id).to.equal(dummyData.acm.get.success._id);
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should successfully retrieve acm data (private)" ,function (done) {
                    sendRequest(url.acm.findByIdPrivate(dummyData.acm.get.success._id),'get',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        expect(body._id).to.equal(dummyData.acm.get.success._id);
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should fail to retrieve acm data ( Id wrong format )" ,function (done) {
                    sendRequest(url.acm.findByIdPublic(dummyData.acm.get.wrongIdFormat),'get',null,400,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });
            });
        
            describe("Find paginated" ,function () {
            
                this.timeout(10000);
                it("Should successfully retrieve acm paginated data" ,function (done) {
                    let validQuery = '__validQuery__';
                    sendRequest(url.acm.findPaginated(validQuery),'get',null,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isPaginatedResponse(body); 
                        done();
                    });
                });
            });
        
            describe("Update" ,function () {

                let acmData     = null,
                    update      = {
                        success : {
                            data : ["5cee7a0493f93a4e61b32632", "5cee7a0493f93a4e65b32631"],
                            target : "accessControl.read"
                        },
                        invalid : {
                            data : "invalidData",
                        }
                    };


                before(function (done) {
                    sendRequest(url.acm.create(),'post',dummyData.acm.create.success,201,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isAcm(body, true);
                        acmData = body;
                        done();
                    });
                });

                after(function (done) {
                    let query = `_id=${acmData._id}`;
                    sendRequest(url.acm.remove(query),'del',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRemoveResponse(body);
                        expect(body.n).to.be.at.least(1);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully update acm data" ,function (done) {
                    
                    let query = `_id=${dummyData.acm.get.success._id}`;
                    sendRequest(url.acm.update(query),'put',dummyData.acm.update.success,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isUpdateResponse(body);
                        expect(body.nModified).to.be.at.least(1);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to update acm data (Query not provided)" ,function (done) {
                    let query = ``;
                    sendRequest(url.acm.update(query),'put',dummyData.acm.update.success,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        done();
                    });
                });
        
                this.timeout(10000);
                it("Should fail to update acm data (Invalid update data)",function (done) {
                    let query = `_id=${dummyData.acm.get.success._id}`;
                    sendRequest(url.acm.update(query),'put',dummyData.acm.update.invalidData,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.IMPROPER_DATA.errorCode);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully push items to target", function (done) {
                    let query = `_id=${acmData._id}&target=accessControl.read&operation=push`;
                    sendRequest(url.acm.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isAcm(body);
                        expect(body.accessControl.read).to.include.members(update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to push items (Items already exist)", function (done) {
                    let query = `_id=${acmData._id}&target=accessControl.read&operation=push`;
                    sendRequest(url.acm.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isAcm(body);
                        expect(body.accessControl.read).to.include.members(update.success.data);
                        let responseArray = body.accessControl.read;

                        delete responseArray[responseArray.indexOf(update.success.data[0])];
                        delete responseArray[responseArray.indexOf(update.success.data[1])];
                        expect(responseArray).to.not.include.members(update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should successfully pull items from target", function (done) {
                    let query = `_id=${acmData._id}&target=accessControl.read&operation=pull`;
                    sendRequest(url.acm.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isAcm(body);
                        expect(body.accessControl.read).to.not.include.members(update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to pull items (Items don't exist)", function (done) {
                    let query = `_id=${acmData._id}&target=accessControl.read&operation=pull`;
                    sendRequest(url.acm.update(query),'put',update.success.data,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isAcm(body);
                        expect(body.accessControl.read).to.not.include.members(update.success.data);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to push items (Target object not found)", function (done) {
                    let query = `_id=${acmData._id}&target=accessControl.notFound&operation=push`;
                    sendRequest(url.acm.update(query),'put',update.success.data,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.NO_DATA_FOUND.errorCode);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to pull items (Target object not found)", function (done) {
                    let query = `_id=${acmData._id}&target=accessControl.notFound&operation=pull`;
                    sendRequest(url.acm.update(query),'put',update.success.data,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to perform operation on target (Body is not an array)", function (done) {
                    let query = `_id=${acmData._id}&target=accessControl.read&operation=push`;
                    sendRequest(url.acm.update(query),'put',update.invalid.data,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                        done();
                    });
                });

            });
        
            describe("Remove" ,function () {
            
                this.timeout(10000);
                it("Should successfully remove acm data" ,function (done) {
                    let query = `_id=${dummyData.acm.get.success._id}`;
                    sendRequest(url.acm.remove(query),'del',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRemoveResponse(body); 
                        expect(body.n).to.be.at.least(1); 
                        done();
                    });
                });

                this.timeout(10000);
                it("Should fail to remove acm data (Query not provide)" ,function (done) {
                    let query = ``;
                    sendRequest(url.acm.remove(query),'del',null,400,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        done();
                    });
                });
            });
        });
    

// End inserting test validation here