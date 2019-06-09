/**
 * @author              Nathan Mersha
 * @name                GenNode Authorization
 * @module              index.js
 * @description         Starting point for generating node server files.
 * @kind                Generator
 * @copyright           June 2019 GenNode Authorization
 */

let
    lib             = require('./src/lib/index'),
    defaultConfig   = require('./src/config/index'),
    nodeGenConfig   = null,
    outputPath      = null,
    mergedConfig    = {},
    mergedConfigEx  = require('./src/mergedConfig'),
    constants       = require('./src/config/constants'),
    createDir       = constants.directories,
    replaceValues   = require('./src/generators/replacers'),
    snakeCase       = require('snake-case'),
    async           = require('async'),
    shelljs         = require('shelljs'),
    path            = require('path'),
    xtend           = require('xtend');

const
    log  = ">> ",
    iLog = ">>>>";

/**
 * @name                - Config index
 * @description         - Begins generating execution.
 */
module.exports = {

    /**
     * @name                    - Gen node authorization
     * @description             - Generates gen node file
     * @param configFilePath    - Path to config file
     * @param outPutPath        - Out put path
     */
    genNodeAuthorization                 : function (configFilePath, outPutPath, callbackMain){

        async.waterfall([
            locateConfigFile,
            mergeConfigFile,
            validateConfigFile,
            refactorConfigFile,
            generateDirectories,
            generatePackageJSON,
            generateGit,
            generateEnvironmentFile,
            generateApp,
            generateConfig,
            generateControllers,
            generateDals,
            generateLibs,
            generateModels,
            generateRoutes,
            generateTestFiles,
            generateJenkinsFile,
            generateDockerFile,
            generatePostManCollectionFile,
            generateReadMeFile,
            generateApiDocJSON,
            installPackages,
            generateTestReportAndCoverage,
            generateDocumentation,
            commitFiles,
            runServer
        ],function () {
            console.log('Completed generating server files.');
            console.log(`\n\n\n
        --------------------------------------------------------------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------
        -------------------------------------    Thanks for using GenNode Authorization.  ----------------------------------
        --------------------------------------------------------------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------
        \n\n\n
        `
            );
            callbackMain();
        });

        /**
         * @name                    - Locate config file
         * @description             - Locates users config file.
         * @param callback          - Callback function (error)
         */
        function locateConfigFile               (callback) {
            console.log(`${log} 1. Locate config file init.`);
            console.log("Config file path : ", configFilePath);
            nodeGenConfig = require(path.resolve(configFilePath));
            outputPath = path.resolve(outPutPath);
            callback(null);
        }

        /**
         * @name                    - Merge config files
         * @description             - Merges the default config file with the one the user's config file.
         * @param callback          - Callback function (error)
         */
        function mergeConfigFile                (callback) {
            console.log(`${log} 2. Merge config file init.`);
            mergeConfigFiles(nodeGenConfig, callback);


        }

        /**
         * @name                    - Validate config file
         * @description             - Validates the merged config file
         * @param callback          - Callback function (error)
         */
        function validateConfigFile             (callback) {
            console.log(`${log} 3. Validating config file.`);

            if(isNaN(mergedConfig.environment.PORT)) {
                console.error(`Port value : ${mergedConfig.environment.PORT} is not a number.`)
            }else{
                callback(null);
            }
        }

        /**
         * @name                    - Refactor config file
         * @description             - Refactors config file
         * @param callback          - Callback function (error)
         */
        function refactorConfigFile             (callback) {
            console.log(`${log} 4. Refactor config file init.`);

            if(!mergedConfig.baseURL.startsWith('/')) {
                mergedConfig.baseURL = '/'.concat(mergedConfig.baseURL);
            }
            callback(null);
        }



        /**
         * @name                    - Generate directories
         * @description             - Generates required directories in the parent file
         * @param callback          - Callback function (error)
         */
        function generateDirectories            (callback) {
            console.log(`${log} 6. Generate directories init.`);

            shelljs.mkdir(path.resolve(outputPath, nodeGenConfig.serviceName));
            shelljs.cd(path.resolve(outputPath, nodeGenConfig.serviceName));
            shelljs.mkdir(createDir);
            callback(null);
        }

        /**
         * @name                    - Generate package json
         * @description             - Generates the npm package file.
         * @param callback          - Callback function (error)
         */
        function generatePackageJSON            (callback) {
            console.log(`${log} 8. Generate package json init.`);
            lib.generator(path.resolve(__dirname, './src/templates/node/package/package.json'), replaceValues.globalReplace(true), 'package.json', '.', callback);
        }

        /**
         * @name                    - Generate git
         * @description             - Generates git file, with remote repo if provided.
         * @param callback          - Callback function (error)
         */
        function generateGit                    (callback) {
            console.log(`${log} 9. Generate git init.`);
            shelljs.exec('git init');
            setTimeout(function () {
                lib.generator(path.resolve(__dirname, './src/templates/git/gitignore'), replaceValues.globalReplace(), '.gitignore', '.', callback);
            },2000);
        }

        /**
         * @name                    - Generate environment file
         * @description             - Generates environment file
         * @param callback          - Callback function (error)
         */
        function generateEnvironmentFile        (callback) {
            console.log(`${log} 10. Generate environment file.`);
            lib.generator(path.resolve(__dirname, './src/templates/env/.env'), replaceValues.globalReplace(), '.env', '.', callback);
        }

        /**
         * @name                    - Generate app
         * @description             - Generates app file
         * @param callback          - Callback function (error)
         */
        function generateApp(callback) {
            console.log(`${log} 11. Generate app file.`);
            lib.generator(path.resolve(__dirname, './src/templates/node/app/app.js'), replaceValues.globalReplace(), 'app.js', '.', callback);

        }

        /**
         * @name                    - Generate config
         * @description             - Generates config file
         * @param callback          - Callback function (error)
         */
        function generateConfig                 (callback) {
            console.log(`${log} 12. Generate config init.`);
            lib.generator(path.resolve(__dirname, './src/templates/node/config/index.js'), replaceValues.globalReplace(), 'index.js', './config', callback);
        }

        /**
         * @name                    - Generate controllers
         * @description             - Generates controllers.
         * @param callback          - Callback function (error)
         */
        function generateControllers(callback) {
            console.log(`${log} 13. Generate controller files.`);

            async.waterfall([
                generateAcm,
                generateRole,
                generateService,
                generateToken,
                generateUser
            ],function () {
                callback(null);
            });

            /**
             * @name            - Generate acm
             * @description     - Generates acm controller
             * @param cb        - Callback function (error)
             */
            function generateAcm(cb) {
                console.log(`${log} Generate amc.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/controller/acm.js'), replaceValues.globalReplace(), 'acm.js', './controller', cb);

            }

            /**
             * @name            - Generate role
             * @description     - Generates role controller
             * @param cb        - Callback function (error)
             */
            function generateRole(cb) {
                console.log(`${log} Generate role.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/controller/role.js'), replaceValues.globalReplace(), 'role.js', './controller', cb);
            }

            /**
             * @name            - Generate service
             * @description     - Generates service controller
             * @param cb        - Callback function (error)
             */
            function generateService(cb) {
                console.log(`${log} Generate service`);
                lib.generator(path.resolve(__dirname, './src/templates/node/controller/service.js'), replaceValues.globalReplace(), 'service.js', './controller', cb);
            }

            /**
             * @name            - Generate token
             * @description     - Generates token controller
             * @param cb        - Callback function (error)
             */
            function generateToken(cb) {
                console.log(`${log} Generate token`);
                lib.generator(path.resolve(__dirname, './src/templates/node/controller/token.js'), replaceValues.globalReplace(), 'token.js', './controller', cb);
            }

            /**
             * @name            - Generate user
             * @description     - Generates user controller
             * @param cb        - Callback function (error)
             */
            function generateUser(cb) {
                console.log(`${log} Generate user`);
                lib.generator(path.resolve(__dirname, './src/templates/node/controller/user.js'), replaceValues.globalReplace(), 'user.js', './controller', cb);
            }
        }


        /**
         * @name                - Generate dals
         * @description         - Generates dal files
         * @param callback      - Callback function (error)
         */
        function generateDals(callback) {
            console.log(`${log} 13. Generate dal files.`);

            async.waterfall([
                generateAcm,
                generateRole,
                generateService,
                generateUser
            ],function () {
                callback(null);
            });

            /**
             * @name            - Generate acm
             * @description     - Generates acm dal
             * @param cb        - Callback function (error)
             */
            function generateAcm(cb) {
                console.log(`${log} Generate amc.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/dal/acm.js'), replaceValues.globalReplace(), 'acm.js', './dal', cb);

            }

            /**
             * @name            - Generate role
             * @description     - Generates role dal
             * @param cb        - Callback function (error)
             */
            function generateRole(cb) {
                console.log(`${log} Generate role.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/dal/role.js'), replaceValues.globalReplace(), 'role.js', './dal', cb);
            }

            /**
             * @name            - Generate service
             * @description     - Generates service dal
             * @param cb        - Callback function (error)
             */
            function generateService(cb) {
                console.log(`${log} Generate service`);
                lib.generator(path.resolve(__dirname, './src/templates/node/dal/service.js'), replaceValues.globalReplace(), 'service.js', './dal', cb);
            }


            /**
             * @name            - Generate user
             * @description     - Generates user dal
             * @param cb        - Callback function (error)
             */
            function generateUser(cb) {
                console.log(`${log} Generate user`);
                lib.generator(path.resolve(__dirname, './src/templates/node/dal/user.js'), replaceValues.globalReplace(), 'user.js', './dal', cb);
            }

        }

        /**
         * @name                - Generate libs
         * @description         - Generates constants, errorCode, constantIndex, helperIndex, apiIndex, logger helper, initializer
         * @param callback      - Callback function (error)
         */
        function generateLibs(callback) {
            console.log(`${log} 14. Generate library files.`);

            async.waterfall([
                generateConstants,
                generateErrorCodes,
                generateConstantIndex,
                generateHelperIndex,
                generateControllerHelper,
                generateApiIndex,
                generateLoggerHelper,
                generateInitializer,
            ],function () {
                callback(null);
            });

            /**
             * @name            - Generate constants
             * @description     - Generates some constant values.
             * @param cb        - Callback function (error)
             */
            function generateConstants(cb) {
                console.log(`${iLog} Generating constants.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/lib/constant/constant.js'), replaceValues.globalReplace(), 'constant.js', './lib/constant', cb);
            }

            /**
             * @name            - Generate error codes
             * @description     - Generates constant error codes.
             * @param cb        - Callback function (error)
             */
            function generateErrorCodes(cb) {
                console.log(`${iLog} Generating error codes.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/lib/constant/errorCodes.js'), replaceValues.globalReplace(), 'errorCodes.js', './lib/constant', cb);
            }

            /**
             * @name            - Generate constant index
             * @description     - Generates index file for the constant files.
             * @param cb        - Callback function (error)
             */
            function generateConstantIndex(cb) {
                console.log(`${iLog} Generating constant index.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/lib/constant/index.js'), replaceValues.globalReplace(), 'index.js', './lib/constant', cb);
            }

            /**
             * @name            - Generate helper index
             * @description     - Generates helper index files.
             * @param cb        - Callback function (error)
             */
            function generateHelperIndex(cb) {
                console.log(`${iLog} Generating helper index.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/lib/helper/index.js'), replaceValues.globalReplace(), 'index.js', './lib/helper', cb);
            }

            /**
             * @name            - Generate controller helper
             * @description     - Generates controller helper file
             * @param cb        - Callback function (error)
             */
            function generateControllerHelper(cb) {
                console.log(`${iLog} Generating controller helper.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/lib/helper/others/controllerHelper.js'), replaceValues.globalReplace(), 'controllerHelper.js', './lib/helper/others', cb);
            }

            /**
             * @name            - Generate api index
             * @description     - Generates index file for api module.
             * @param cb        - Callback function (error)
             */
            function generateApiIndex(cb) {
                console.log(`${iLog} Generating controller helper.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/lib/helper/api/index.js'), replaceValues.globalReplace(), 'index.js', './lib/helper/api', cb);
            }

            /**
             * @name            - Generate logger helper
             * @description     - Generates logger helper file.
             * @param cb        - Callback function (error)
             */
            function generateLoggerHelper(cb) {
                console.log(`${iLog} Generating logger helper.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/lib/helper/others/logger.js'), replaceValues.globalReplace(), 'logger.js', './lib/helper/others', cb);
            }

            /**
             * @name            - Generate initializer
             * @description     - Generates initializer file.
             * @param cb        - Callback function (error)
             */
            function generateInitializer(cb) {
                console.log(`${iLog} Generating initializer.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/lib/helper/others/initializer.js'), replaceValues.globalReplace(), 'initializer.js', './lib/helper/others', cb);
            }
        }

        /**
         * @name                - Generate models
         * @description         - Generates model files.
         * @param callback      - Callback function (error)
         */
        function generateModels(callback) {
            console.log(`${log} 15. Generate model files.`);

            async.waterfall([
                generateAcm,
                generateRole,
                generateService,
                generateUser
            ],function () {
                callback(null);
            });

            /**
             * @name            - Generate acm
             * @description     - Generates acm model
             * @param cb        - Callback function (error)
             */
            function generateAcm(cb) {
                console.log(`${log} Generate amc.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/model/acm.js'), replaceValues.globalReplace(), 'acm.js', './model', cb);

            }

            /**
             * @name            - Generate role
             * @description     - Generates role model
             * @param cb        - Callback function (error)
             */
            function generateRole(cb) {
                console.log(`${log} Generate role.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/model/role.js'), replaceValues.globalReplace(), 'role.js', './model', cb);
            }

            /**
             * @name            - Generate service
             * @description     - Generates service model
             * @param cb        - Callback function (error)
             */
            function generateService(cb) {
                console.log(`${log} Generate service`);
                lib.generator(path.resolve(__dirname, './src/templates/node/model/service.js'), replaceValues.globalReplace(), 'service.js', './model', cb);
            }


            /**
             * @name            - Generate user
             * @description     - Generates user model
             * @param cb        - Callback function (error)
             */
            function generateUser(cb) {
                console.log(`${log} Generate user`);
                lib.generator(path.resolve(__dirname, './src/templates/node/model/user.js'), replaceValues.globalReplace(), 'user.js', './model', cb);
            }
        }
 
        function generateRoutes(callback) {
            console.log(`${log} 16. Generate routes.`);

            async.waterfall([
                generateAcm,
                generateIndex,
                generateRole,
                generateService,
                generateToken,
                generateUser
            ],function () {
                callback(null);
            });

            /**
             * @name            - Generate acm
             * @description     - Generates acm route
             * @param cb        - Callback function (error)
             */
            function generateAcm(cb) {
                console.log(`${log} Generate acm.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/route/acm.js'), replaceValues.globalReplace(), 'acm.js', './route', cb);

            }

            /**
             * @name            - Generate index
             * @description     - Generates index route
             * @param cb        - Callback function (error)
             */
            function generateIndex(cb) {
                console.log(`${log} Generate index.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/route/index.js'), replaceValues.globalReplace(), 'index.js', './route', cb);

            }

            /**
             * @name            - Generate role
             * @description     - Generates role route
             * @param cb        - Callback function (error)
             */
            function generateRole(cb) {
                console.log(`${log} Generate role.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/route/role.js'), replaceValues.globalReplace(), 'role.js', './route', cb);
            }

            /**
             * @name            - Generate service
             * @description     - Generates service route
             * @param cb        - Callback function (error)
             */
            function generateService(cb) {
                console.log(`${log} Generate service`);
                lib.generator(path.resolve(__dirname, './src/templates/node/route/service.js'), replaceValues.globalReplace(), 'service.js', './route', cb);
            }

            /**
             * @name            - Generate service
             * @description     - Generates service route
             * @param cb        - Callback function (error)
             */
            function generateToken(cb) {
                console.log(`${log} Generate service`);
                lib.generator(path.resolve(__dirname, './src/templates/node/route/token.js'), replaceValues.globalReplace(), 'token.js', './route', cb);
            }

            /**
             * @name            - Generate user
             * @description     - Generates user route
             * @param cb        - Callback function (error)
             */
            function generateUser(cb) {
                console.log(`${log} Generate user`);
                lib.generator(path.resolve(__dirname, './src/templates/node/route/user.js'), replaceValues.globalReplace(), 'user.js', './route', cb);
            }
        }

        /**
         * @name                - Generate test files.
         * @description         - Generates test files (Dummy data, stress, test and url gen)
         * @param callback      - Callback function (error)
         */
        function generateTestFiles(callback) {
            console.log(`${log} 17. Generate test files`);

            if(mergedConfig.test){
                async.waterfall([
                    generateDummyData,
                    generateStressFile,
                    generateTestFile,
                    generateUrlGenerator
                ],function () {
                    console.log(`${log} Generate test files completed.`);
                    callback(null);
                });

                /**
                 * @name            - Generate dummy data
                 * @description     - Generates dummy data for test.
                 * @param cb        - Callback function (error)
                 */
                function generateDummyData(cb) {
                    console.log(`${iLog} Generate dummy data.`);
                    lib.generator(path.resolve(__dirname, './src/templates/node/test/dummy_data.js'), replaceValues.globalReplace(), 'dummy_data.js', './test', cb);
                }

                /**
                 * @name            - Generate stress file
                 * @description     - Generates artillery stress file (yml)
                 * @param cb        - Callback function (error)
                 */
                function generateStressFile(cb) {
                    console.log(`${iLog} Generate stress file.`);
                    lib.generator(path.resolve(__dirname, './src/templates/node/test/stress.yml'), replaceValues.globalReplace(), 'stress.yml', './test', cb);
                }

                /**
                 * @name            - Generate test file
                 * @description     - Generates e2e test.
                 * @param cb        - Callback function (error)
                 */
                function generateTestFile(cb) {
                    console.log(`${iLog} Generate test file.`);
                    lib.generator(path.resolve(__dirname, './src/templates/node/test/test.js'), replaceValues.globalReplace(), 'test.js', './test', cb);
                }

                /**
                 * @name            - Generate url generator
                 * @description     - Url generator file.
                 * @param cb        - Callback function (error)
                 */
                function generateUrlGenerator(cb) {
                    console.log(`${iLog} Generate url generator.`);
                    lib.generator(path.resolve(__dirname, './src/templates/node/test/url_generator.js'), replaceValues.globalReplace(), 'url_generator.js', './test', cb);
                }

            }else{
                console.log(`${iLog} Skip generating test files.`);
            }

        }

        /**
         * @name                - Generate jenkinsfile
         * @description         - Generates jenkins pipeline file.
         * @param callback      - Callback function (error)
         */
        function generateJenkinsFile(callback) {
            console.log(`${log} 18. Generate jenkins file.`);
            lib.generator(path.resolve(__dirname, './src/templates/jenkins/Jenkinsfile'), replaceValues.globalReplace(), 'Jenkinsfile', '.', callback);
        }

        /**
         * @name                - Generate docker file
         * @description         - Generates dockerignore, dockerCompose and docker file.
         * @param callback      - Callback function (error)
         */
        function generateDockerFile(callback) {
            console.log(`${log} 19. Generate docker file.`);

            if(mergedConfig.docker){
                async.waterfall([
                    generateDockerIgnore,
                    generateDockerCompose,
                    generateDocker,
                ],function () {
                    callback(null);
                });

                /**
                 * @name            - Generate docker ignore file
                 * @description     - Generates docker ignore file.
                 * @param cb        - Callback function (error)
                 */
                function generateDockerIgnore(cb) {
                    console.log(`${iLog} Generating docker ignore.`);
                    lib.generator(path.resolve(__dirname, './src/templates/docker/.dockerignore'), replaceValues.globalReplace(), '.dockerignore', '.', cb);
                }

                /**
                 * @name            - Generate docker compose
                 * @description     - Generates docker compose file.
                 * @param cb        - Callback function (error)
                 */
                function generateDockerCompose(cb) {
                    console.log(`${iLog} Generating docker compose.`);
                    lib.generator(path.resolve(__dirname, './src/templates/docker/docker-compose.yml'), replaceValues.globalReplace(true), 'docker-compose.yml', '.', cb);
                }

                /**
                 * @name            - Generate docker
                 * @description     - Generates docker file
                 * @param cb        - Callback function (error)
                 */
                function generateDocker(cb) {
                    console.log(`${iLog} Generating docker file.`);
                    lib.generator(path.resolve(__dirname, './src/templates/docker/Dockerfile'), replaceValues.globalReplace(), 'Dockerfile', '.', cb);
                }
            }else{
                console.log(`${log} Skip generating docker file.`);
                callback(null);
            }

        }

        /**
         * @name                - Generate postman collection file.
         * @description         - Generates postman collection file.
         * @param callback      - Callback function (error)
         */
        function generatePostManCollectionFile(callback) {
            console.log(`${log} 19. Generate postman collection file.`);

            if(mergedConfig.postman){
                lib.generator(path.resolve(__dirname, './src/templates/documentation/gennodeAuthServer.postman_collection.json'), replaceValues.globalReplace(), `${snakeCase(mergedConfig.serviceName)}.postman_collection.json`, '.', callback);
            }else{
                console.log(`${iLog} Skip generating postman file.`);
                callback(null);
            }
        }

        /**
         * @name                - Generate readme file
         * @description         - Generates ReadMe.md file
         * @param callback      - Callback function (error)
         */
        function generateReadMeFile(callback) {
            console.log(`${log} 20. Generate readMe file.`);

            if(mergedConfig.readMe){
                lib.generator(path.resolve(__dirname, './src/templates/documentation/README.md'), replaceValues.globalReplace(), 'README.md', '.', callback);
            }else{
                console.log(`${iLog} Skip generating readme file.`);
                callback(null);
            }
        }

        /**
         * @name                - Generate apiDoc json
         * @description         - Generates apidoc json file.
         * @param callback      - Callback function (error)
         */
        function generateApiDocJSON(callback) {
            console.log(`${log} 20. Generate apidoc.json`);
            if(mergedConfig.documentation){
                lib.generator(path.resolve(__dirname, './src/templates/documentation/apidoc.json'), replaceValues.globalReplace(), 'apidoc.json', '.', callback);
            }else{
                console.log(`${iLog} Skip generating apidoc.json`);
            }
        }


        /**
         * @name                    - Install packages
         * @description             - Install npm packages
         * @param callback          - Callback function (error)
         */
        function installPackages                (callback) {
            console.log(`${log} 26. Install packages init.`);
            shelljs.exec('npm install');
            callback(null);
        }

        /**
         * @name                    - Generate test report and coverage
         * @description             - Generates test reports and coverages.
         * @param callback          - Callback function (error)
         */
        function generateTestReportAndCoverage  (callback) {
            console.log(`${log} 30. Generate test report and coverage init.`);

            if(mergedConfig.test){
                shelljs.exec('npm run test');
                callback(null);
            }else{callback(null);}
        }

        /**
         * @name                    - Generate Documentation
         * @description             - Generates documentation
         * @param callback          - Callback function (error)
         */
        function generateDocumentation  (callback) {
            console.log(`${log} 31. Generate documentation.`);

            if(mergedConfig.documentation){
                shelljs.exec('npm run apidoc');
                callback(null);
            }else{
                console.log(`${iLog} Skip generating document.`);
                callback(null);
            }
        }



        /**
         * @name                    - Commit Files
         * @description             - Commit's generated files
         * @param callback          - Callback function (error)
         */
        function commitFiles                    (callback) {
            console.log(`${log} 31. Commit and push init.`);

            if(mergedConfig.commit) {
                shelljs.exec('git add .');
                shelljs.exec(`git commit --message=${mergedConfig.commitMessage}`);
                callback(null);
            }else{
                console.log('Skipping...');
                callback(null);
            }
        }

        /**
         * @name                    - Run server
         * @description             - If requested to run server after completion, then server will begin running.
         * @param callback          - Callback function (error)
         */
        function runServer                      (callback) {
            console.log(`${log} 32. Running server init.`);

            if(mergedConfig.runServer) {
                shelljs.exec('npm run start');
            }else{
                console.log('Skipping...');
            }
            callback(null);
        }

    },

    /**
     * @name                    - Generate sample config
     * @description             - Generates sample my hero academia gennode_authorization config file
     */
    generateSampleConfig    : function () {
        console.log(`${log} Generating sample Hero Academia GenNode authorization configuration file.`);
        lib.generator(path.resolve(__dirname, './src/templates/gennode_authorization/heroacademia_authorization.config.js'), replaceValues.genNodeConfig(), 'heroacademia_authorization.config.js', '.', function () {
            console.log(`${log} Done generating my hero academia gennode_authorization configuration file.`);
        });
    },

    /**
     * @name                    - Generate config
     * @description             - Generates gennode configuration file from the user's prompted answer
     * @param answers           - User answers
     */
    generateConfig          : function (answers) {
        async.waterfall([
            createEnvironmentObject,
            removeEnvironmentObjectFromAnswers,
            mergeDefaultConfigAndAnswer,
            generateConfigurationFile
        ],function () {
        });

        /**
         * @name            - Create environmentObject
         * @description     - Creates nestable environment object
         * @param callback  - Callback function (error)
         */
        function createEnvironmentObject(callback) {
            let environment = Object.assign({}, {
                DEBUG                   : answers.debug,
                PORT                    : answers.port,
                MONGODB_URL             : answers.mongodbURL,
                REVERSE_PROXY           : answers.reverseProxy,
                COLLECTION_RETURN_SIZE  : answers.collectionReturnSize,
                ELASTIC_SEARCH_URL      : answers.elasticSearchURL,
                TOKEN_EXPIRATION_TIME   : answers.tokenExpirationTime,
                LOG_STASH_PORT          : answers.logStashPort,
                SECRET                  : answers.secret
            });

            callback(null, environment);
        }

        /**
         * @name                - Remove environment object from answers
         * @description         - Removes environment object from answers and replaces with a nestable value
         * @param environment   - Constructed environment variables
         * @param callback      - Callback function (error)
         */
        function removeEnvironmentObjectFromAnswers(environment, callback) {
            delete answers.debug;
            delete answers.port;
            delete answers.mongodbURL;
            delete answers.reverseProxy;
            delete answers.collectionReturnSize;
            delete answers.elasticSearchURL;
            delete answers.tokenExpirationTime;
            delete answers.logStashPort;
            delete answers.secret;

            answers.environment = environment;
            callback(null);
        }

        /**
         * @name            - Merge default config and answer
         * @description     - Merges the default config with the provided answer
         * @param callback  - Callback function (error)
         */
        function mergeDefaultConfigAndAnswer(callback) {
            mergeConfigFiles(answers, callback);
        }

        /**
         * @name            - Generate configuration file
         * @description     - Generates configuration file according to the merged default config and user's answer
         * @param callback  - Callback function (error)
         */
        function generateConfigurationFile(callback) {
            lib.generator(path.resolve(__dirname, './src/templates/gennode_authorization/gennode'), replaceValues.genNodeConfig(answers.author, answers.serviceName, JSON.stringify(mergedConfig, null,  4)), 'gennode_authorization.config.js', '.', callback);
        }
    }


};



/**
 * @name                        - Merge config files
 * @description                 - Merges the config file with a default one
 * @param inputConfigModel      - Config file input
 * @param callback              - Callback function (error)
 */
function mergeConfigFiles(inputConfigModel, callback) {
    inputConfigModel = xtend(defaultConfig, inputConfigModel);
    mergedConfig = inputConfigModel;
    mergedConfig.environment = xtend(defaultConfig.environment, inputConfigModel.environment);
    mergedConfigEx.mergedConfig = mergedConfig;
    callback(null);
}


