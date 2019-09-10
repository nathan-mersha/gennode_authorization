/**
 * @author              Nathan Mersha
 * @name                test.js
 * @description         Test for gennode_authorization service.
 * @kind                Test
 * @copyright           Copyright 2019
 */

let
    chai         = require('chai'),
    expect       = chai.expect,
    shell        = require('shelljs'),
    gennode_auth = require('../main');
    chai.use(require('chai-fs'));


describe("Generate Server" ,function () {

    this.timeout(11000);
    it("Should fail to generate server (Port value is not a number)" ,function (done) {
        gennode_auth.genNodeAuthorization('./test/port_nan.config.js','./test/.');
        setTimeout(()=>{
            expect('../').to.be.a.directory("Server file generated.").and.not.include.contents(["GeneratedTestServerPortNAN"]);
            done();
        },10000);

    });

    // NOTE : Depending on your internet connection the test may take longer than 2 minutes, so depending on that variable
    //        Adjust test timeout const var.
    const estimatedTestSession = 120000; // 4 minutes.
    this.timeout(estimatedTestSession);
    it("Should successfully generate server.", function (done) {
        gennode_auth.genNodeAuthorization('./test/proper.config.js','./test/.',function () {
            shell.exec("ls")
            expect('.').to.be.a.directory("No Server generated.").with.contents(["apidocs", "config", "controller",".git",
                "coverage", "dal", "lib", "logs", "model", "node_modules", "report", "route", "socket", "test", ".dockerignore", ".env",
            ".gitignore", "apidoc.json", "app.js", "docker-compose.yml", "Dockerfile", "generated_test_server.postman_collection.json",
            "Jenkinsfile", "package.json", "package-lock.json", "README.md"]);
            expect('./apidocs').to.be.a.directory("No Documentation generated.").with.contents(["css","fonts","img","locales","utils","vendor","api_data.js","api_data.json","api_project.js","api_project.json","index.html","main.js"]);
            expect('./config').to.be.a.directory("No config generated.").with.contents(["index.js"]);
            expect('./controller').to.be.a.directory("No controller generated").with.contents(["acm.js", "admin.js", "log.js", "role.js", "schema.js", "service.js", "token.js", "user.js"]);
            expect('./coverage').to.be.a.directory("No coverage generated").with.contents(["lcov-report","coverage.json","lcov.info"]);
            expect('./dal').to.be.a.directory("No dal generated").with.contents(["acm.js","admin.js","role.js","schema.js", "service.js", "user.js"]);
            expect('./lib').to.be.a.directory("No lib generated").with.contents(["constant","helper","middleware"]);
            expect('./lib/constant').to.be.a.directory("No constant generated").with.contents(["accessRoutes.js","constant.js","errorCodes.js","index.js"]);
            expect('./lib/helper').to.be.a.directory("No helper generated").with.contents(["api","others","index.js"]);
            expect('./lib/helper/api').to.be.a.directory("No helper api generated").with.contents(["index.js"]);
            expect('./lib/helper/others').to.be.a.directory("No helper others generated").with.contents(["controllerHelper.js","initializer.js"]);
            expect('./lib/middleware').to.be.a.directory("No Middleware generated").with.contents(["authorize.js"]);
            expect('./logs').to.be.a.directory('No log file generated.').with.contents(["README.md", "info.log"]);
            expect('./model').to.be.a.directory("No model generated").with.contents(["acm.js", "admin.js", "role.js","schema.js","service.js","user.js"]);
            expect('./report').to.be.a.directory("No report generated").with.contents(["assets","index.html","index.json"]);
            expect('./route').to.be.a.directory("No route generated").with.contents(["acm.js", "admin.js", "index.js", "log.js", "role.js", "schema.js", "service.js", "token.js", "user.js"]);
            expect('./socket').to.be.a.directory("No socket controller generated").with.contents(["index.js", "log.js"]);
            expect('./test').to.be.a.directory("No test generated").with.contents(["dummy_data.js","stress.yml","test.js","url_generator.js"]);
            done();
        });
    });


});

