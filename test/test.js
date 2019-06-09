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
            expect('../GeneratedTestServer').to.be.a.directory("No Server generated.").with.contents([".dockerignore", ".env", ".git", ".gitignore", "Dockerfile", "Jenkinsfile", "README.md", "apidoc.json", "apidocs", "app.js", "config", "controller", "coverage", "dal", "docker-compose.yml", "generated_test_server.postman_collection.json", "lib", "model", "node_modules", "package-lock.json", "package.json", "report", "route", "test"]);
            expect('../GeneratedTestServer/apidocs').to.be.a.directory("No Documentation generated.").with.contents(["css","fonts","img","locales","utils","vendor","api_data.js","api_data.json","api_project.js","api_project.json","index.html","main.js"]);
            expect('../GeneratedTestServer/config').to.be.a.directory("No config generated.").with.contents(["index.js"]);
            expect('../GeneratedTestServer/controller').to.be.a.directory("No controller generated").with.contents(["acm.js","role.js","service.js","token.js","user.js"]);
            expect('../GeneratedTestServer/coverage').to.be.a.directory("No coverage generated").with.contents(["lcov-report","coverage.json","lcov.info"]);
            expect('../GeneratedTestServer/dal').to.be.a.directory("No dal generated").with.contents(["acm.js","role.js","service.js","user.js"]);
            expect('../GeneratedTestServer/lib').to.be.a.directory("No lib generated").with.contents(["constant","helper","middleware"]);
            expect('../GeneratedTestServer/lib/constant').to.be.a.directory("No constant generated").with.contents(["constant.js","errorCodes.js","index.js"]);
            expect('../GeneratedTestServer/lib/helper').to.be.a.directory("No helper generated").with.contents(["api","others","index.js"]);
            expect('../GeneratedTestServer/lib/helper/api').to.be.a.directory("No helper api generated").with.contents(["index.js"]);
            expect('../GeneratedTestServer/lib/helper/others').to.be.a.directory("No helper others generated").with.contents(["controllerHelper.js","initializer.js","logger.js"]);
            expect('../GeneratedTestServer/model').to.be.a.directory("No model generated").with.contents(["acm.js","role.js","service.js","user.js"]);
            expect('../GeneratedTestServer/report').to.be.a.directory("No report generated").with.contents(["assets","index.html","index.json"]);
            expect('../GeneratedTestServer/route').to.be.a.directory("No route generated").with.contents(["acm.js","index.js","role.js","service.js","token.js","user.js"]);
            expect('../GeneratedTestServer/test').to.be.a.directory("No test generated").with.contents(["dummy_data.js","stress.yml","test.js","url_generator.js"]);
            done();
        });
    });


});

