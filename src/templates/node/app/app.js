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
    config      = require('./config'),
    route       = require('./route'),
    mongoose    = require('mongoose'),
    debug       = require('debug')('__serviceName__'),
    helmet      = require('helmet'),
    constants   = require('./lib/constant/index'),
    roleDAL     = require('./dal/role'),
    acmDAL      = require('./dal/acm'),
    authorize   = require('./lib/middleware/authorize'),
    errorCodes  = constants.errorCodes,
    dbCFailure  = 0,
    initializer = require('./lib/helper/others/initializer'),
    server      = require('http').Server(app),
    io          = require('socket.io')(server),
    socketIndex = require('./socket'),
    adminDAL    = require('./dal/admin');

// Defining the mongodb address based on the defined environment
let mongodbURL  = process.env.test === "true" ? config.MONGODB_URL_TEST : config.MONGODB_URL;

let winston = require('winston');
let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info',
            filename: path.resolve(__dirname, 'logs', 'info.log'),
            level: 'info'
        })
    ]
});

global.logger = logger;
global.log = (message, level="info")=> {
    logger.log(level, message)
};

/**
 * @description     - Connecting to mongodb, based on the environment
 */
mongoose.connect(mongodbURL, {useNewUrlParser:true});

/**
 * @description     - Defines successful mongodb connection
 */
mongoose.connection.on('connected',function () {
    debug(`Mongodb successfully Connected to : ${mongodbURL}`);
});

/**
 * @description     - Handling mongoose db connection error.
 */
mongoose.connection.on('error',function (err) {
    dbCFailure++;
    debug(`Error While Connecting to Mongodb at : ${mongodbURL}`);
    debug(`Connection Error is : ${err.toString()}`);
    if(dbCFailure < 10) {
            debug(`Retrying Connection ...`);
            mongoose.connect(mongodbURL);
    }
});

/**
 * @description     - Provides multiple securities.
 */
app.use(helmet());

// TODO : Must remove test condition on production.
if(process.env.test !== "true"){
    app.use(authorize);
}

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
                // Connecting... socket io.
                server.listen(config.HTTP_PORT);
                debug(`Server created at port : ${config.HTTP_PORT}`);

                io.on('connection', function (socket) {
                    debug(`Socket connected at port : ${config.HTTP_PORT}`);
                    global.socket = socket; // assigning socketIO var on the global scope.
                    socket.emit("info", `Connection successful at port : ${config.HTTP_PORT}`);

                    // Implemented socket emitters and listeners.
                    socketIndex();
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
        res.redirect(`${config.REVERSE_PROXY}:${config.HTTP_PORT}/__baseURL__/apidoc`);
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
 * @name            - Create superAdmin
 * @description     - Creates a super admin from the credentials provided in the env file.
 */
(function createSuperAdministrator() {
    let query = {role : "SuperAdmin"};
    adminDAL.getPrivate(query, function (err, data) {
        if(!data){
            let superAdmin = {
                userName : process.env.USER_NAME || "gennode",
                password : process.env.PASSWORD || "changeMeNowAndQuick",
                role : "SuperAdmin"
            };
            adminDAL.create(superAdmin,function (err, data) {
                debug("Super Admin created.");
            });
        }
    });
})();



/**
 * @description     - Exporting app for testing purposes.
 */
module.exports = app;
