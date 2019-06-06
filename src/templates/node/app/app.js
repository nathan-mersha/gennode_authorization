/**
 * @author              __author__
 * @name                __serviceName__
 * @module              app.js
 * @description         Starting point for __serviceName__ service.
 * @kind                Init
 * @copyright           __copyright__
 */

let
    path        = require('path'),
    dotEnv      = require('dotenv').config({path: path.resolve(__dirname, '.env')}),
    express     = require('express'),
    app         = express(),
    parser      = require('body-parser').json(),
    validator   = require('express-validator')(),
    config      = require('../config/index'),
    route       = require('../routes/index'),
    mongoose    = require('mongoose'),
    debug       = require('debug')('__serviceName__'),
    helmet      = require('helmet'),
    constants   = require('../lib/constant/index'),
    roleDAL     = require('../dal/role'),
    acmDAL      = require('../dal/acm'),
    errorCodes  = constants.errorCodes,
    dbCFailure  = 0,
    initializer = require('../lib/middleware/initializer');


/**
 * @description     - Connecting to mongodb
 */
mongoose.connect(config.MONGODB_URL, {useNewUrlParser: true});

/**
 * @description     - Defines successful mongodb connection
 */
mongoose.connection.on('connected',function () {
    debug(`Mongodb successfully Connected to : ${config.MONGODB_URL}`);
});

/**
 * @description     - Handling mongoose db connection error.
 */
mongoose.connection.on('error',function (err) {
    dbCFailure++;
    debug(`Error While Connecting to Mongodb at : ${config.MONGODB_URL}`);
    debug(`Connection Error is : ${err.toString()}`);
    if(dbCFailure < 10) {
            debug(`Retrying Connection ...`);
            mongoose.connect(config.MONGODB_URL);
    }
});

/**
 * @description     - Provides multiple securities.
 */
app.use(helmet());

/**
 * @description     - Defining mode and access control
 */
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('__baseURL__/apidoc'    ,express.static(path.join(__dirname,'./apidocs')));
app.use('__baseURL__/coverage'  ,express.static(path.join(__dirname,'./coverage/lcov-report')));
app.use('__baseURL__/test'      ,express.static(path.join(__dirname,'./report')));

/**
 * @description     - Passing third party middle wares, Data validator and json parser.
 */
app.use(validator);
app.use(parser);

/**
 * @name        - Ping dependent services
 * @description - Pings the services that this service is depended on for resilient functionality
 */
(function pingDependentServices() {
    initializer.pinger([
 // Begin dependant service list
 // End dependant service list
        ],
        {abortIfFail: false}, function (err,allServicesUp) {
            if(allServicesUp){
                app.listen(config.HTTP_PORT,function () {
                    debug(`Server created at port : ${config.HTTP_PORT}`);
                });
            }else{
                debug(`Some dependent services may be down, quiting init sequence`);
            }
        });
})();

/**
 * @description     - Routing app.
 */
route(app);

/**
 * @description     - Request handler for unmatched endpoints.
 */
app.use(function (req, res, next) {
    if(req.url === "/") {
        res.redirect(`${config.REVERSE_PROXY}:${config.HTTP_PORT}__baseURL__/apidoc`);
        res.status(200);
    }else{
        debug("Un-matched endpoint");

        res.status(400);
        res.json(errorCodes.SEC.UN_MATCHED_ENDPOINT);
        next();
    }
});

/**
 * @name            - Create any role
 * @description     - Creates role by 'any' name if no data by this name previously existed.
 */
(function createsAnyRole() {
    let query       = {name : "any"};
    let createData  = {name : "any", description : "Any one can access these routes."};

    roleDAL.getPrivate(query, (err, data)=>{
        if(!data){
            roleDAL.create(createData, function (createdError, createdRouteData) {
                if(!createdError){
                    debug("Found no 'any' role, creating for the first time...");
                    debug(createdRouteData);
                }
            })
        }
    })
})();

/**
 * @name            - Create acm for any role
 * @description     - Creates acm data for 'any'if there is no previous
*/
(function createACMForAnyRole() {
    let query = {subject : "any"};

    acmDAL.getPrivate(query, function (err, data) {
        if(!data){
            acmDAL.create(query, function (createdError, createdData) {
                if(!createdError){
                    debug("Found no 'any', acm data, creating for the first time...");
                    debug(createdData);
                }
            })
        }
    })
})();


/**
 * @description     - Exporting app for testing purposes.
 */
module.exports = app;
